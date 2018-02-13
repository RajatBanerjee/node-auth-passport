var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes/index')
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var Strategy = require('passport-local').Strategy;
var configDB = require('./db/dbConnection.js');
var app = express();
mongoose.connect(configDB.url); 
require('./db/passport')(passport);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


app.use('/', router(passport));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  console.error("Error: ",err.message)
  res.render('error',{error:err});
});
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
