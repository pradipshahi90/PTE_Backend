import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register user
export const registerUser = async (req, res) => {
    const { name, email, password, is_premium_purchased } = req.body;
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            is_premium_purchased,
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser,
            status:true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
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

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
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
            status:true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
