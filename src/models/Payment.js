import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    transaction_code: String,
    transaction_uuid: String,
    total_amount: String,
    status: String,
    product_code: String,
    signature: String,
    signed_field_names: String,
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
