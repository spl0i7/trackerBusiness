let express = require('express');
let router = express.Router();
let actions = require('../controllers/user_actions');

/* GET home page. */

module.exports = router;

// route to new item
router.get('/add_new', actions.addNew);
router.post('/add_new', actions.doAddNew);

module.exports = router;