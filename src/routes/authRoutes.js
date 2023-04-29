const express = require('express');
const authController = require('../controllers/authController');
const newPassUser = require('../controllers/newPassController');
const singUpController = require('../controllers/singUpController');
const ConfirmSingUpController = require('../controllers/confirmSingController');

const router = express.Router();

router.post('/login', authController.loginUser);

router.post('/singUp', singUpController.signUpUser);

router.post('/newPasword', newPassUser.newPassUser);

router.post('/confirmSingUp', ConfirmSingUpController.confirmSignUpController);

module.exports = router;
