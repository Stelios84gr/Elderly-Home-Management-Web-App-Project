const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.get('/google/callback', authController.googleLogin);

module.exports = router;

// Google Sign-In URL:
// https://accounts.google.com/o/oauth2/v2/auth + path parameters

// path parameters:
// client_id = ...
// redirect_uri = ...
// response_type = code
// scope = email%20profile
// access_type = offline

// https://accounts.google.com/o/oauth2/v2/auth?client_id=[...]]&redirect_uri=[...]&response_type=code&scope=email%20profile&access_type=offline