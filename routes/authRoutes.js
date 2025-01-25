const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    registerUser
);

router.post('/login', loginUser);
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logoutUser); 

module.exports = router;
