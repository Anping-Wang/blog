var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/home/index');
const admin = require('./routes/admin/admin');
const cats  = require('./routes/admin/cats');
const posts = require('./routes/home/posts');
const article = require('./routes/admin/article');
const message = require('./routes/admin/message');
const session = require('express-session');
const user = require('./routes/admin/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//托管静态资源
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use(session({
    secret : 'john',
    resave : false,
    saveUninitialized : true,
    cookie : {}
}));


//自定义中间件，控制所有/admin路由，实现登陆控制
app.use('/admin',(req,res,next) => {
    if(!req.session.isLogin){
        //没有登陆
        res.redirect('/user/login');
        return;
    }
    next();
});
app.use('/', indexRouter);
app.use('/admin',admin);
app.use('/admin/cats',cats);
app.use('/posts',posts);
app.use('/admin/article',article);
app.use('/admin/message',message);
app.use('/user',user);



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
