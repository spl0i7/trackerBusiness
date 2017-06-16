let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let passport = require('passport');
let mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
let expressSanitizer = require('express-sanitizer');
let recaptcha = require('express-recaptcha');
let config = require('./config');
// load up the user model
let User = require('./models/User');


let index = require('./routes/index');
let users = require('./routes/authentication');
let list = require('./routes/list');
let ledger = require('./routes/ledger');
let regrade = require('./routes/regrade');
let profile = require('./routes/profile');

let app = express();


//mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database)
    .then(()=>console.log('database connection successful'))
    .catch(err=>console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
    secret: 'nooneknowsyouradogontheinternetnobody',
    resave:false,
    saveUninitialized:true

}));

//passport initialization

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* check for login */
app.use((req, res, next)=>{
    if( req.url.match(/^\/list/) ||
        req.url.match(/^\/ledger/) ||
        req.url.match(/^\/regrade/) ||
        req.url.match(/^\/profile/)) {
        if(!req.isAuthenticated()) return res.redirect('/login')
    }
    next();
});

/* recaptcha */
recaptcha.init(config.site_key, config.secret_key);

//config default middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());

//todo protected route middleware

app.use('/', index);
app.use('/', users);
app.use('/profile', profile);
app.use('/list', list);
app.use('/regrade', regrade);
app.use('/ledger', ledger);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
