let express = require('express');
let router = express.Router();
let actions = require('../controllers/list_actions')
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        return res.render('list',
            {
                inventory : req.user.inventory,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                email:  req.user.email,
                username: req.user.username
            });
    else return res.redirect('/login')
});

router.delete('/remove', actions.removeCoins);
router.get('/edit/:coinId', actions.editCoin );
router.put('/edit/:coinId', actions.doEditCoin );
router.get('/add/', actions.addNew);
router.post('/add/', actions.doAddNew);

module.exports = router;
