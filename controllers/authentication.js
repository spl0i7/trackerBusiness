let passport = require("passport");
let User = require("../models/User");

let userController = {};

// Restrict access to root page
userController.home = function(req, res) {
    return res.render('list', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
    if(req.isAuthenticated())
        return res.redirect('/');
    else
        return res.render('signup');
};

// Post registration
userController.doRegister = function(req, res) {

    User.register(new User({
            email : req.sanitize(req.body.email),
            username : req.sanitize(req.body.username),
            firstname: req.sanitize(req.body.firstname),
            lastname : req.sanitize(req.body.lastname)
    }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('error', {message:'error in signup', error:err});
        }
        passport.authenticate('local')(req, res, function () {
            // res.redirect('/');
            return res.redirect('/');
        });
    });
};

// Go to login page
userController.login = function(req, res) {
    if(req.isAuthenticated())
        return res.redirect('/');
    else
        return res.render('login', {status:true});
};

// Post login
userController.doLogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.render('login', {status:false}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/list');
        });
    })(req, res, next);
};

// logout
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;