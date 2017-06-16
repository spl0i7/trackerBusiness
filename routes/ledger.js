let express = require('express');
let controller = require('../controllers/ledger');
let router = express.Router();

/* GET ledger page. */
router.get('/', controller.home);
router.get('/buy', controller.buyLedger);
router.get('/sell', controller.sellLedger);
router.get('/regrade', controller.regradeLedger);
module.exports = router;
