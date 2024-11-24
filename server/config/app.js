let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose'); 

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let listingsRouter = require('../routes/listings');
let reservationsRouter = require('../routes/reservations');

let app = express();

// database setup
let DB = require('./db'); // Import the module with the URI
mongoose.connect(DB.URI); // Connect to the database
let mongoDB = mongoose.connection; 
mongoDB.on('error',console.error.bind(console,'Connection Error')) // Display any errors to console
mongoDB.once('open', () => { // If the connection is open, print a success message to console. 
  console.log('MongoDB Connected')
});
mongoose.connect(DB.URI,{useNewURIParser:true,
  useUnifiedTopology:true
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/listings', listingsRouter); 
app.use('/reservations', reservationsRouter); 

/*
app.use('/users', usersRouter);
app.use('/reservations', reservationsRouter); 
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
