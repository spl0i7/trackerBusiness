module.exports = function (req, pageSize, inventory) {
    let coins = JSON.parse(JSON.stringify(inventory));
    let totalCoins = coins.length;

    let pageCount = Math.floor(totalCoins / pageSize) + 1;
    let currentPage = 1;

    console.log(coins.length);
    let coinArrays = [];

    while(coins.length > 0) {
        coinArrays.push(coins.splice(0,pageSize));
    }

    if( typeof  req.query.page !== 'undefined') {
        currentPage = +req.query.page;
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