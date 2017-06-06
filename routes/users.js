let express = require('express');
let router = express.Router();
let auth = require('../controllers/authentication');

/* GET home page. */

module.exports = router;

// route to register page
router.get('/signup', auth.register);

// route for register action
router.post('/signup', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);
module.exports = router;