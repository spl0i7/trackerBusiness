let User = require("../models/User");
let pagination = require('../controllers/pagination');

let actionController = {};

actionController.home = function(req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    let url = req.url;
    if(url.indexOf('?') != -1) {
        url.substring(0,url.indexOf('?'));
    }
    return renderList('list',req,res,req.user.inventory)
}
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
actionController.sortInventory = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    let inventory = JSON.parse(JSON.stringify(req.user.inventory));
    switch (req.params.type) {
        case "price":
            console.log()
            inventory.sort(function (a, b) {
                if(req.params.order === "asc")
                    return a.price > b.price;
                else
                    return a.price < b.price;
            });

            break;
        case "description" :

            inventory.sort(function (a, b) {
                if(req.params.order === "asc")
                    return a.denomination  > b.denomination;
                else
                    return a.denomination  < b.denomination;
            })
            break;
        case "certification" :

            inventory.sort(function (a, b) {
                if(req.params.order === "asc")
                    return a.certification > b.certification;
                else
                    return a.certification < b.certification;
            });
            break;
    }

    return renderList('list', req, res, inventory);
}
actionController.searchInventory = function (req, res) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    let searchQuery = req.sanitize(req.params.query);
    let searchedItems = [];
    let regex = new RegExp(searchQuery, 'gi');
    req.user.inventory.forEach(function (coin) {
        if(regex.test(coin.certification) || regex.test(coin.denomination) || regex.test(coin.grade))
            searchedItems.push(coin);
    })
    return renderList('search', req, res, searchedItems);
}
function renderList(view, req, res, inventory) {
    let paginationInfo = pagination(req, 5, inventory);
    let url = req.url;
    if(url.indexOf('?') != -1) {
        url = url.substr(0,url.indexOf('?'));
    }
    return res.render(view,
        {
            url : '/list' + url,
            pageCount: paginationInfo.pageCount,
            currentPage : paginationInfo.currentPage,
            inventory : paginationInfo.inventory,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email:  req.user.email,
            username: req.user.username
        });
}
module.exports = actionController;