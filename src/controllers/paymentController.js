import Payment from '../models/Payment.js';
import User from '../models/User.js';  // Import the User model

export const savePayment = async (req, res) => {
    try {
        const { user, payment } = req.body;

        // Create and save the payment record
        const newPayment = new Payment({
            userId: user.id,
            name: user.name,
            email: user.email,
            transaction_code: payment.transaction_code,
            transaction_uuid: payment.transaction_uuid,
            total_amount: payment.total_amount,
            status: payment.status,
            product_code: payment.product_code,
            signature: payment.signature,
            signed_field_names: payment.signed_field_names
        });

        await newPayment.save();

        // Update the user's premium status
        await User.findByIdAndUpdate(
            user.id,
            { is_premium_purchased: true },
            { new: true }  // This returns the updated document
        );

        res.status(200).json({
            success: true,
            message: 'Payment stored successfully and premium status activated'
        });
    } catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getAllPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            payments
        });
    } catch (error) {
        console.error('Error fetching all payment history:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};
