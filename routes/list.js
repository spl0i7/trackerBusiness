let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        return res.render('list', {inventory : req.user.inventory});
    else return res.redirect('/login')
});

module.exports = router;
