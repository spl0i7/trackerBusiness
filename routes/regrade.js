let express = require('express');
let controller = require('../controllers/regrade');
let router = express.Router();

/* GET home page. */
router.get('/', controller.home );
router.post('/', controller.doRegrade)
module.exports = router;
