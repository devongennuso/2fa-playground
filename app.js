var express       = require('express');
var exphbs        = require('express-handlebars');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var session       = require('client-sessions');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  partialsDir: [
    'views/components'
  ]
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// session management
app.use(session({
  cookieName: 'session',
  secret: 'xpDLG9Jqfg8uDyeiQuu',
  duration: 2 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));

// app.use(function(req, res, next) {
//   if (req.session.test) {
//     res.setHeader('x-test', 'true');
//   } else {
//     req.session.test = true;
//     res.setHeader('x-test', 'false');
//   }
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
  debug: true
  //outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

mongoose.connect('mongodb://localhost:27017/onetech');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connection open');
});

module.exports = app;
