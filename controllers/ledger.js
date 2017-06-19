let User = require("../models/User");
let pagination = require('../controllers/pagination');

let ledgerController = {};

ledgerController.home = function (req, res) {
    let coins = [];
    let current = null;
    for(let i = 0 ; i < req.user.inventory.length ; ++i) {

        current = JSON.parse(JSON.stringify(req.user.inventory[i]));
        current.soldcoin = false;
        coins.push(current);
    }

    for(let i = 0 ; i < req.user.soldcoins.length; ++i) {
        current = JSON.parse(JSON.stringify(req.user.soldcoins[i]));
        current.soldcoin = true;
        coins.push(current);
    }
    for(let i = 0 ; i < req.user.regrade.length; ++i){
        current = JSON.parse(JSON.stringify(req.user.regrade[i]));
        coins.push(current);
    }
    coins.forEach((coin,index)=> coin.index = index+1);
    coins.sort((function (a, b) {
        return new Date(a.date) - new Date(b.date);
    }));
    return renderList('ledger', req, res, coins)
}
ledgerController.buyLedger = function (req, res) {
    let coins = JSON.parse(JSON.stringify(req.user.inventory));
    coins.forEach((coin, index)=>  {
        coin.soldcoin = false;
        coin.index = index+1;
    });
    return renderList('ledger', req, res, coins)

}
ledgerController.sellLedger = function (req, res) {
    let coins = JSON.parse(JSON.stringify(req.user.soldcoins));
    coins.forEach((coin, index)=> {
        coin.soldcoin = true
        coin.index = index+1;
    });
    return renderList('ledger', req, res, coins)
}
ledgerController.regradeLedger = function (req, res) {
    let coins = JSON.parse(JSON.stringify(req.user.regrade));
    coins.forEach((coin, index)=> {
        coin.index = index+1;
    });
    return renderList('ledger', req, res, coins)
}


function renderList(view, req, res, coins) {
    let paginationInfo = pagination(req, coins);
    let url = req.url.split('?')[0];

    return res.render(view,
        {
            title : 'My Ledger',
            url : '/ledger' + url,
            pageCount: paginationInfo.pageCount,
            currentPage : paginationInfo.currentPage,
            coins :paginationInfo.inventory,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email:  req.user.email,
            username: req.user.username,
        });
}

module.exports = ledgerController;
