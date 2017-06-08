let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()) return res.redirect('/login');
    return res.render('regrade');
});

module.exports = router;
