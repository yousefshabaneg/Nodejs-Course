const express = require('express');
const morgan = require('morgan');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const staticPath = path.join(__dirname, 'public');

app.use(express.static(staticPath));
//1) Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //middleware based on body parser

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

// 3) Routes Error handling
app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} resource on the server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
