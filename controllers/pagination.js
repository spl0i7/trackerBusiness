module.exports = function (req, inventory) {

    let coins = JSON.parse(JSON.stringify(inventory));
    let totalCoins = coins.length;
    let pageSize = 25;
    let pageCount = Math.floor(totalCoins / pageSize) + 1;
    let currentPage = 1;
    let coinArrays = [];


    if( typeof  req.query.items !== 'undefined') {
        if(typeof req.query.items === 'number' )
            pageSize = req.sanitize(+req.query.items)
    }

    while(coins.length > 0) {
        coinArrays.push(coins.splice(0,pageSize));
    }

    if( typeof  req.query.page !== 'undefined') {
        currentPage = req.sanitize(+req.query.page);
    }


    if(req.query.page > pageCount) {
        currentPage = 1;
    }

    let coinList = coinArrays[+currentPage -1];

    return {
        pageCount : pageCount,
        currentPage: currentPage,
        inventory : coinList
    }
}