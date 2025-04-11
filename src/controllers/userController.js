// Get all users
import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ status: true, message: 'Users fetched successfully', users: users.map(user => ({ ...user.toObject(), id: user._id.toString() })) });
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
        res.json({ status: true, message: 'User fetched successfully', user: { ...user.toObject(), id: user._id.toString() } });
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
                message: 'User created successfully',
                id: user._id.toString(),  // Send the id as a string
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

        // Check if the new email already exists for another user
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ status: false, message: 'Email already in use by another user' });
            }
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.is_premium_purchased = req.body.is_premium_purchased !== undefined
            ? req.body.is_premium_purchased
            : user.is_premium_purchased;
        user.active = req.body.active !== undefined ? req.body.active : user.active;

        // Only update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            status: true,
            message: 'User updated successfully',
            id: updatedUser._id.toString(),
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
        res.json({ status: true, message: 'User removed successfully' });
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
            message: user.active ? 'User activated successfully' : 'User deactivated successfully',
            id: user._id.toString(),  // Send the id as a string
            name: user.name,
            email: user.email,
            active: user.active
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};
