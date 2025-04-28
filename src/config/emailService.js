// 2. Create a util for email sending (utils/emailService.js)
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Set your SendGrid API key in .env file
// SENDGRID_API_KEY=your_sendgrid_api_key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SENDGRID_API_KEY', process.env.SENDGRID_API_KEY);
console.log('EMAIL_FROM', process.env.EMAIL_FROM);


export const sendOtpEmail = async (email, otp) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM, // Add this to your .env file
        subject: 'Your OTP for Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your Account</h2>
                <p>Thank you for registering with us. To complete your registration, please use the following OTP:</p>
                <h3 style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};


export const sendPasswordResetEmail = async (email, resetLink) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Please click the link below to reset your password:</p>
                <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};
