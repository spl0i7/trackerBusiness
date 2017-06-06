let User = require("../models/User");

let actionController = {};


actionController.addNew = function (req, res) {
    if(req.isAuthenticated())
        return res.render('add_new');
    return res.redirect('/login')
}

actionController.doAddNew = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    coinInfo = {
        year : req.body.year,
        certification: req.body.certification,
        price : req.body.purchaseprice,
        denomination : req.body.denomination,
        grade : req.body.grade,
        comments : req.body.comments
    }
    //todo check for valid input
    User.findByIdAndUpdate(
        req.user._id,
        {$push: {inventory: coinInfo}},
        {safe: true, upsert: true},
        function(err, model) {
            if(err) console.log(err)
            res.redirect('/add_new')
        }
    );
}


module.exports = actionController;