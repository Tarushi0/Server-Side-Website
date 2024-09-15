var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// Database connection URL
const url = 'mongodb://127.0.0.1:27017/projdb';
const connect = mongoose.connect(url);

// Importing route handlers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/Pages/userRouter')
var bookingRouter = require('./routes/Pages/bookingRouter');

// Creating an Express application
var app = express();

// Session middleware for user authentication
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true,
}));

// Setting the view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serving static files from the 'public' directory
app.use('/public', express.static('public'));

// Connecting to the MongoDB database
connect.then((db) => {
  console.log("Connected correctly to the server");
}, (err) => { console.log(err); });

// Middleware to set userId in locals
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// Routing for user and booking endpoints
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/bookings', bookingRouter);

// Catching 404 errors and forwarding to the error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler middleware
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;
