// 3. Update auth controller (controllers/authController.js)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import {sendOtpEmail, sendPasswordResetEmail} from "../config/emailService.js";
import bcrypt from "bcryptjs";

// Generate OTP
const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user (modified to include OTP)
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

        // Create new user with OTP
        const newUser = new User({
            name,
            email,
            password,
            otp,
            otpExpiry,
            isVerified: false
        });

        await newUser.save();

        // Send OTP email
        const emailSent = await sendOtpEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(201).json({
            message: 'User registered successfully. Please verify your email with the OTP sent.',
            userId: newUser._id,
            status: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP is expired
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpiry = undefined; // Clear expiry

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                is_premium_purchased: user.is_premium_purchased,
                role: user.role,
            },
            status: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        // Send OTP email
        const emailSent = await sendOtpEmail(user.email, otp);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(200).json({
            message: 'OTP resent successfully',
            status: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Modified login to check for verification
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token (doesn't require user to be verified)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                is_premium_purchased: user.is_premium_purchased,
                role: user.role,
            },
            status: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log('email',email);

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        console.log("userr",user);

        // Generate reset token (you can use crypto to generate a secure token)
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

        // Save reset token and expiry to the user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send the reset email
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        const emailSent = await sendPasswordResetEmail(user.email, resetLink);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send password reset email' });
        }

        res.status(200).json({
            message: 'A password reset email has been successfully sent to your email address. Please follow the instructions in the email to reset your password.',
            status: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Reset password API
export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        // Find the user by reset token
        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password before saving
        user.password = newPassword; // Plain text
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiry = undefined; // Clear the reset token expiry

        await user.save();

        res.status(200).json({ message: 'Password reset successfully', status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Forgot password API
