const express = require('express');
const  router = express.Router();
//set firebase
// var firebase = require('../connections/firebse_client');
// var firebaseDb = require('../connections/firebase_admin');
const { check } = require('express-validator');
const loginController = require('../controllers/LoginController');



/*此文件下的路徑皆為user/....*/
router.get('/login', loginController.getLoginView);

router.post('/login', loginController.login);

router.get('/register',loginController.getRegisterView);

router.post('/register',loginController.register);




module.exports = router;