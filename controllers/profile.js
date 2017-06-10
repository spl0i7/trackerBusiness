let passport = require("passport");
let User = require("../models/User");

let profileController = {};

profileController.home = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    return res.render('profile', {
        firstname : req.user.firstname ,
        lastname : req.user.lastname,
        email : req.user.email
    });
}

profileController.doUpdate = function (req, res) {

}

module.exports = profileController;