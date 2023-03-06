var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	cookieName:'session',// cookie name dictates the key name added to the request object
	secret:'2233qqww',// should be a large unguessable string
	ephemeral:true, // when true, cookie expires when the browser closes
	httpOnly:true,// when true, cookie is not accessible from javascript
  saveUninitialized: false,
  resave: false,
  secure:true // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
}));
app.use('/',indexRouter);
app.use('/users', usersRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
  res.render('error');
});

module.exports = app;
