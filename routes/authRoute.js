const express = require('express');
const { registerUser: register, loginUser: login } = require('../controllers/authController');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);

module.exports = router