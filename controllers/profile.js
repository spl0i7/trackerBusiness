let passport = require("passport");
let User = require("../models/User");
let passportLocalMongoose = require('passport-local-mongoose');

let profileController = {};

profileController.home = function (req, res) {
    return res.render('profile', {
        title: 'Change Password'
    });
}

profileController.doUpdate = function (req, res) {
    let newPassword = req.sanitize(req.body.newpassword);
    console.log(newPassword);
    User.findByUsername(req.user.username)
        .then(function(sanitizedUser){
        if (sanitizedUser){
            sanitizedUser.setPassword(newPassword, function(){
                sanitizedUser.save();
                return res.redirect('/');
            });
        } else {
            res.redirect('/profile');
        }
    },function(err){
        console.error(err);
    })
}

module.exports = profileController;