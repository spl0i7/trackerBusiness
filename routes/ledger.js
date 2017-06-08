let express = require('express');
let router = express.Router();

/* GET ledger page. */
router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    return res.render('ledger');
});

module.exports = router;
