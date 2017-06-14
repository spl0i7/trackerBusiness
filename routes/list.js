let express = require('express');
let router = express.Router();
let actions = require('../controllers/list_actions')
let pagination = require('../controllers/pagination');
/* GET home page. */
router.get('/', actions.home);
router.delete('/remove', actions.removeCoins);
router.get('/edit/:coinId', actions.editCoin );
router.put('/edit/:coinId', actions.doEditCoin );
router.get('/add/', actions.addNew);
router.post('/add/', actions.doAddNew);
router.get('/sort/:type/:order', actions.sortInventory);
router.get('/search/:query', actions.searchInventory);
router.get('/sort/:type/:order/search/:query', actions.searchInventory);
router.post('/sell', actions.sellCoin);
router.get('/sell/:urlId', actions.sellCoinPage);
router.post('/sell/invoice', actions.doSellCoin);

module.exports = router;
