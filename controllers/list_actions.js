let User = require("../models/User");
let pagination = require('../controllers/pagination');
let crypto = require('crypto');

let actionController = {};

actionController.home = function(req, res) {
    let url = req.url;
    if(url.indexOf('?') != -1) {
        url.substring(0,url.indexOf('?'));
    }
    return renderList('list',req,res,req.user.inventory)
}
actionController.addNew = function (req, res) {
    return res.render('add_new');

}
actionController.doAddNew = function (req, res) {
    coinInfo = {
        year : req.sanitize(req.body.year),
        certification: req.sanitize(req.body.certification),
        price : req.sanitize(req.body.purchaseprice),
        denomination : req.sanitize(req.body.denomination),
        grade : req.sanitize(req.body.grade),
        comments : req.sanitize(req.body.comments),
    }
    User.findByIdAndUpdate({_id : req.user._id}, {$push: {inventory: coinInfo}}, {safe: true, upsert: true})
        .then(done=> {
            res.redirect('/list/add')
        })
        .catch(err=>console.log(err))
}
actionController.removeCoins = function (req, res) {
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
    let coin = req.user.inventory.filter((coin)=> { return coin._id == req.params.coinId  });
    return res.render('edit', {'coin' : coin[0]});
}
actionController.doEditCoin = function (req, res) {
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
    let searchQuery = req.sanitize(req.params.query);
    let searchedItems = [];
    let regex = new RegExp(searchQuery, 'gi');
    req.user.inventory.forEach(function (coin) {
        if(regex.test(coin.certification) || regex.test(coin.denomination) || regex.test(coin.grade))
            searchedItems.push(coin);
    })
    return renderList('search', req, res, searchedItems, searchQuery);
}
actionController.sellCoin = function (req, res) {
    let coinIds = req.body['coins[]'];
    req.session.saleCoins = {
        coinIds : coinIds,
        url     : crypto.randomBytes(7).toString('hex')
    }
    if(typeof  req.session.saleCoins.coinIds === 'string')
        req.session.saleCoins.coinIds = [req.session.saleCoins.coinIds]
    return res.json({success:true, url: req.session.saleCoins.url});
}
actionController.sellCoinPage = function (req, res) {
    if(req.session.saleCoins) {
        let saleCoins = JSON.parse(JSON.stringify(req.session.saleCoins));
        delete req.session.saleCoins;

        let coinIds = [];
        for(let i = 0 ; i < req.user.inventory.length; ++i) {
            for(let j = 0; j < saleCoins.coinIds.length; ++j) {
                if(req.user.inventory[i]._id == saleCoins.coinIds[j])
                    coinIds.push(req.user.inventory[i]);
            }
        }
        if(saleCoins.url === req.params.urlId) {
            return res.render('sell', {coinIds : coinIds});
        }
    }
    return res.redirect('/list');

}
actionController.doSellCoin = function (req, res) {
    let coinIds = Object.keys(req.body);
    let coins = [];
    for(let i = 0 ; i < coinIds.length-1; ++i) {
        for(let j = 0 ; j < req.user.inventory.length; ++j){
            if(String(coinIds[i]) === String(req.user.inventory[j]._id)) {
                let coin = JSON.parse(JSON.stringify(req.user.inventory[j]));
                coin.date = new Date();
                coin.price = req.sanitize(Number(+req.body[coinIds[i]]));
                coins.push(coin);
            }
        }
    }
    let customerName = req.sanitize(req.body[coinIds[coinIds.length -1]]);
    if(!customerName) customerName = "";
    User.findOneAndUpdate({_id: req.user._id}, {$pull: {inventory: {_id : {'$in' : coinIds}}}})
        .then(() => { return User.findByIdAndUpdate({_id: req.user._id}, {$push: {soldcoins: {$each:coins}}}, {safe: true, upsert: true})})
        .then(()=>{ return res.render('invoice', {coinIds : coins, customerName : customerName});})
        .catch(()=> { return res.json({success:false});});
}
actionController.doRegrade = function (req, res) {
    let coinIds = req.body['coins[]'];
    if(typeof coinIds === 'string')
        coinIds = [coinIds];

    let coins = [];
    for(let i = 0 ; i < coinIds.length; ++i) {
        for(let j = 0 ; j < req.user.inventory.length; ++j){
            if(String(coinIds[i]) === String(req.user.inventory[j]._id)) {
                let coin = JSON.parse(JSON.stringify(req.user.inventory[j]));
                coins.push(coin);
            }
        }
    }
    User.findOneAndUpdate({_id: req.user._id}, {$pull: {inventory: {_id: {'$in' : coinIds}}}}, {multi: true})
        .then(noAffected => {
            return User.findByIdAndUpdate({_id: req.user._id}, {$push: {regrade: {$each:coins}}}, {safe: true, upsert: true})})
        .then(()=>  { return res.json({success:true}) })
        .catch(err => {
            console.log(err)
            res.json({success:false})
        });
}
function renderList(view, req, res, inventory, query) {
    let paginationInfo = pagination(req, inventory);
    let url = req.url.split('?')[0];
    return res.render(view,
        {
            url : '/list' + url,
            pageCount: paginationInfo.pageCount,
            currentPage : paginationInfo.currentPage,
            inventory : paginationInfo.inventory,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email:  req.user.email,
            username: req.user.username,
            query: query
        });
}
module.exports = actionController;