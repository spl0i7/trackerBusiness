let User = require("../models/User");
let pagination = require('../controllers/pagination');

let ledgerController = {};

ledgerController.home = function (req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');

    let coins = [];
    let current = null;
    for(let i = 0 , j = 0 ; i < req.user.inventory.length || j < req.user.soldcoins.length; ++i, ++j) {

        if(i < req.user.inventory.length) {
            current = JSON.parse(JSON.stringify(req.user.inventory[i]));
            current.soldcoin = false;
            coins.push(current);
        }
        if( j < req.user.soldcoins.length) {
            current = JSON.parse(JSON.stringify(req.user.soldcoins[j]));
            current.soldcoin = true;
            coins.push(current);
        }
    }
    return renderList('ledger', req, res, coins)
}
ledgerController.buyLedger = function (req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');
    let coins = JSON.parse(JSON.stringify(req.user.inventory));
    coins.forEach((coin)=> coin.soldcoin = false);
    return renderList('ledger', req, res, coins)

}

ledgerController.sellLedger = function (req, res) {
    if(!req.isAuthenticated()) res.redirect('/login');
    let coins = JSON.parse(JSON.stringify(req.user.soldcoins));
    coins.forEach((coin)=> coin.soldcoin = true);
    console.log(coins);
    return renderList('ledger', req, res, coins)
}




function renderList(view, req, res, coins) {
    let paginationInfo = pagination(req, coins);
    let url = req.url;
    if(url.indexOf('?') != -1) {
        url = url.substr(0,url.indexOf('?'));
    }
    return res.render(view,
        {
            url : '/regrade' + url,
            pageCount: paginationInfo.pageCount,
            currentPage : paginationInfo.currentPage,
            coins : coins,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email:  req.user.email,
            username: req.user.username,
        });
}

module.exports = ledgerController;
