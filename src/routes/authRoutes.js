import express from 'express';
import {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP, forgotPassword, resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Resend OTP
router.post('/resend-otp', resendOTP);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);


export default router;