const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

class AuthMiddleware {
  static protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there...
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('Unauthorized, please log in to get access.', 401)
      );
    }

    // 2) Verification token...
    const { user, decodedToken } = await User.verifyToken(token);

    // 3) Check if user still exists...
    if (!user) {
      return next(new AppError('This user doest not longer exist', 401));
    }

    // 4) Check if user changed password after the token was issued..
    if (user.changesPasswordAfter(decodedToken.iat)) {
      return next(
        new AppError('User recently changed password, Please log in again', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE...
    req.user = user;

    next();
  });

  static restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
      // 1) roles: ['admin', 'lead-guide']. , role = 'user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }

      next();
    });
  };
}

module.exports = AuthMiddleware;
