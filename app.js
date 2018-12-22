const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const upload = multer({dest: './public/images'})
const moment = require('moment');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const monk = require('monk')
const flash = require('connect-flash');

// Connection URL
const url = 'localhost:27017/nodeblog';

const db = monk(url);

const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set moment to local
app.locals.moment = require('moment');

app.locals.truncateText = (text, length) => {
  return truncated = text.substring(0, length);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Express Session
app.use(session({
  secret: 'kdfk0kdkf-dfksjafdjkd-jekfj',
  saveUninitialized: true,
  resave: true
}));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash 
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new Error(404));
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
