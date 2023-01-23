const catchAsync = require('./../utils/catchAsync');
const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');
// const factory = require('./handlerFactory');

class ViewsController {
  static getOverview = catchAsync(async (req, res, next) => {
    //1) Get tour data frm collection
    const tours = await Tour.find();

    //2) Build Template
    //2) Render Template using the data from 1)
    res.status(200).render('overview', { title: 'All tours', tours });
  });

  static getTour = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug }).populate({
      path: 'reviews',
      fields: 'review rating user'
    });

    if (!tour) {
      return next(new AppError('Tour not found with that name', 404));
    }

    res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
  });

  static getLoginForm = (req, res, next) => {
    res.status(200).render('login', { title: 'Log into your account' });
  };

  static updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );
    res
      .status(200)
      .render('account', { title: 'Your account', user: updatedUser });
  });

  static getAccount = (req, res, next) => {
    res.status(200).render('account', { title: 'Your account' });
  };
}

module.exports = ViewsController;
