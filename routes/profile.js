let express = require('express');
let router = express.Router();
let actions = require('../controllers/profile');

/* GET home page. */
router.get('/', actions.home);
router.post('/', actions.doUpdate);

module.exports = router;
