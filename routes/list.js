let express = require('express');
let router = express.Router();
let actions = require('../controllers/user_actions')
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        return res.render('list', {inventory : req.user.inventory, firstname: req.user.firstname, lastname: req.user.lastname});
    else return res.redirect('/login')
});

router.delete('/', actions.removeCoins);
router.get('/edit/:coinId', actions.editCoin );
router.put('/edit/:coinId', actions.doEditCoin );

module.exports = router;
