// Get all users
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ status: true, users });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        res.json({ status: true, user });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, is_premium_purchased, active } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            is_premium_purchased: is_premium_purchased || false,
            active: active !== undefined ? active : true
        });

        if (user) {
            res.status(201).json({
                status: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_premium_purchased: user.is_premium_purchased,
                active: user.active
            });
        } else {
            res.status(400).json({ status: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.is_premium_purchased = req.body.is_premium_purchased !== undefined ?
            req.body.is_premium_purchased : user.is_premium_purchased;
        user.active = req.body.active !== undefined ? req.body.active : user.active;

        // Only update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            status: true,
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            is_premium_purchased: updatedUser.is_premium_purchased,
            active: updatedUser.active
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Don't allow admin to delete themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ status: false, message: 'Admin cannot delete themselves' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ status: true, message: 'User removed' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

// Toggle user status (activate/deactivate)
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Toggle active status
        user.active = !user.active;
        await user.save();

        res.json({
            status: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            active: user.active,
            message: user.active ? 'User activated' : 'User deactivated'
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};
