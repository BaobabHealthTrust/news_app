// vendor libraries
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

// model
var model = require('./models/newsFeed');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
   new model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            return done(null, user);
         }
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   new model.User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

// view engine setup
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser());
app.use(session({secret: 'secret strategic xxzzz code'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.use('/sign_in', routes);
app.use('/signin', routes);
app.use('/add_user_menu', routes);
app.use('/add_user', routes);
app.use('/sign_out', routes);
app.use('/view_user_menu', routes);
app.use('/view_users', routes);
app.use('/edit_this_user', routes);
app.use('/save_edited_user', routes);
app.use('/reset_password_view', routes);
app.use('/reset_password', routes);

app.use('/add_news_menu/:category?', routes);
app.use('/save_news', routes);
app.use('/add_category_menu/:category?', routes);
app.use('/save_category', routes);
app.use('/edit_news_menu/:category?', routes);
app.use('/edit_my_news/:category?', routes);
app.use('/edit_category_menu/:category?', routes);
app.use('/edit_my_category/:category?', routes);
app.use('/save_edited_news', routes);
app.use('/save_edited_category', routes);
app.use('/void_news_menu/:category?', routes);
app.use('/void_news', routes);
app.use('/retrieve_news', routes);
app.use('/void_category_menu/:category?', routes);
app.use('/void_category', routes)
app.use('/view_news_menu/:category?', routes);
app.use('/view_category_menu/:category', routes);
app.use('/users', users);
app.use('/users/process_authentication', users);
app.use('/users/sign_out', users);
app.use('/api', api);
app.use('/api/news_feed/:ip_address?/', api);
app.use('/api/log/:data?', api);
app.use('/api/logs/', api);

/*************************************************************************/

/*************************************************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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