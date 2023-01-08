const AppError = require('../utils/appError');
const { filterObj } = require('../utils/utils');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

class UserController {
  static getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: users.length,
      data: {
        users
      }
    });
  });

  static createUser = catchAsync(async (req, res, next) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
      id: newId,
      ...req.body
    };
    tours.push(newTour);
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            message: err.message
          });
        }
        return res.status(201).json({
          status: 'success',
          data: {
            tour: newTour
          }
        });
      }
    );
  });

  static getUser = catchAsync(async (req, res, next) => {
    const tour = tours.find(t => t.id === +req.params.id);
    if (!tour)
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found'
      });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  });

  static updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user posts password data.
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates, please use /updateMyPassword',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated.
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user data.
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  });

  static deleteMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user posts password data.
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({ status: 'success', data: null });
  });

  static deleteUser = catchAsync(async (req, res, next) => {
    if (+req.params.id >= tours.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad Request, Invalid tour ID'
      });
    }

    const tourIndex = tours.findIndex(t => t.id === +req.params.id);
    if (tourIndex === -1)
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found'
      });

    tours.splice(tourIndex, 1);
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            message: err.message
          });
        }
        return res.status(204).json({
          status: 'success',
          data: null,
          message: 'This tour has been deleted'
        });
      }
    );
  });
}

module.exports = UserController;
