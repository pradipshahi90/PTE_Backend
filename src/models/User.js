import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    is_premium_purchased: {
        type: Boolean,
        default: false,
    },
    subscription_type: {
        type: String,
        enum: ['monthly', 'yearly', null], // Can be 'monthly', 'yearly', or null if not subscribed
        default: null,
    },
    subscription_start: {
        type: Date,
        default: null,
    },
    subscription_end: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// (Optional) Method to check if subscription is still valid
userSchema.methods.isSubscriptionActive = function() {
    if (!this.subscription_end) return false;
    return new Date() <= this.subscription_end;
};

const User = mongoose.model('User', userSchema);

export default User;
