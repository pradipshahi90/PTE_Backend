import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// User management routes (admin only)
router.route('/users')
    .get(protect, admin, getAllUsers)
    .post(protect, admin, createUser);

router.route('/users/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.put('/users/:id/toggle-status', protect, admin, toggleUserStatus);

// Admin dashboard route
router.get('/dashboard', protect, admin, (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});

export default router;