let User = require("../models/User");

let actionController = {};


actionController.addNew = function (req, res) {
    if(!req.isAuthenticated())
        return res.redirect('/login');
    return res.render('add_new');

}

actionController.doAddNew = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    coinInfo = {
        year : req.sanitize(req.body.year),
        certification: req.sanitize(req.body.certification),
        price : req.sanitize(req.body.purchaseprice),
        denomination : req.sanitize(req.body.denomination),
        grade : req.sanitize(req.body.grade),
        comments : req.sanitize(req.body.comments)
    }
    User.findByIdAndUpdate({_id : req.user._id}, {$push: {inventory: coinInfo}}, {safe: true, upsert: true})
        .then(done=> {
            res.redirect('/list/add')
        })
        .catch(err=>console.log(err))
}


actionController.removeCoins = function (req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    let coinIds = req.body['coins[]'];
    User.findOneAndUpdate({_id: req.user._id}, {$pull: {inventory: {_id: {'$in' : coinIds}}}}, {multi: true})
        .then(noAffected => {
            console.log(`Affected : ${noAffected}`)
            res.json({success:true})
        })
        .catch(err => {
            console.log(err)
            res.json({success:false})
        });
}
actionController.editCoin = function (req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');
    console.log(req.params);
    let coin = req.user.inventory.filter((coin)=> { return coin._id == req.params.coinId  });
    return res.render('edit', {'coin' : coin[0]});
}

actionController.doEditCoin = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');

    let coinInfo = {
        year : req.sanitize(req.body.year),
        certification: req.sanitize(req.body.certification),
        price : req.sanitize(req.body.purchaseprice),
        denomination : req.sanitize(req.body.denomination),
        grade : req.sanitize(req.body.grade),
        comments : req.sanitize(req.body.comments)
    }


    User.update({_id: req.user._id, 'inventory._id' :req.params.coinId }, {$set: {
        'inventory.$.year' : coinInfo.year,
        'inventory.$.certification' : coinInfo.certification,
        'inventory.$.price' : coinInfo.price,
        'inventory.$.denomination' : coinInfo.denomination,
        'inventory.$.grade' : coinInfo.grade,
        'inventory.$.comments' : coinInfo.comments,
        }})
        .then(noAffected=> { return res.json({success:true}) })
        .catch(err => {
            console.log(err)
            return res.json({success:false})
        });
}


module.exports = actionController;