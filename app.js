var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//global.jQuery = require('jquery');
//var bootstrap = require('bootstrap');

var routes = require('./routes/index');
var users = require('./routes/users');
var topics = require('./routes/topics');
var iot = require('./routes/iot');

var config = require('config.json')('./config/config.json');

var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.webdatabase
});

conn.connect();

console.log("My webpage start!");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bootstrap-3.3.4-dist')));
//app.use(express.static(path.join(__dirname, 'bootstrap-3.3.4-dist/css')));
//app.use(express.static(path.join(__dirname, 'bootstrap-3.3.4-dist/fonts')));
//app.use(express.static(path.join(__dirname, 'bootstrap-3.3.4-dist/js')));

app.use('/', routes);
app.use('/users', users);
app.use('/topics', topics);
app.use('/iot', iot);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
