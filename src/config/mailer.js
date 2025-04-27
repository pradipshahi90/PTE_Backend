import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Use your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Use your Gmail password or app password
    },
});

const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Verify your email for registration',
        html: `<p>Your verification code is: <b>${code}</b></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

export { sendVerificationEmail };
