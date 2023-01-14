const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const crypto = require('crypto');
const { createSendToken } = require('../utils/utils');

class AuthController {
  static signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
  });

  static login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide your email and password', 400));
    }

    const user = await User.login(email, password);
    createSendToken(user, 200, res);
  });

  static forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on Posted email.
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError('There is no user with this email address.', 404)
      );
    }

    // 2) Generate a random token.
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email.
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfrim to: ${resetURL} .\n If you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Password Reset token: valid for 10 min',
        message
      });
      res.status(200).json({
        status: 'success',
        message: `Token has been sent successfully to your email: ${user.email}`
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email, Try again later.',
          500
        )
      );
    }
  });

  static resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;
    const user = await User.resetPassword(token, password, passwordConfirm);

    createSendToken(user, 200, res);
  });

  static updatePassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, newPassword, newPasswordConfirm } = req.body;

    const user = await req.user.updatePassword(
      passwordCurrent,
      newPassword,
      newPasswordConfirm
    );

    createSendToken(user, 200, res);
  });
}

module.exports = AuthController;
