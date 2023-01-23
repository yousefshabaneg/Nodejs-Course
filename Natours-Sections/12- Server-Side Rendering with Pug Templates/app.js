const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const staticPath = path.join(__dirname, 'public');
const viewsPath = path.join(__dirname, 'views');

const app = express();

app.set('view engine', 'pug');
app.set('views', viewsPath);

app.use(express.static(staticPath));

//1) Global Middleware

// Set security HTTP header
// app.use(helmet());
app.use(helmet.contentSecurityPolicy());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP.
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000, //1HR,
  message: 'Too many requests, please try again in an hour.'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NO SQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS ATTACKS.
app.use(xss());

// Prevent parameter pollution.
app.use(
  hpp({
    whitelist: [
      'difficulty',
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize'
    ]
  })
);

//Test middleware.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
