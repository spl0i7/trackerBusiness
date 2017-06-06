let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        return res.render('ledger');
    else return res.redirect('/login')
});

module.exports = router;
