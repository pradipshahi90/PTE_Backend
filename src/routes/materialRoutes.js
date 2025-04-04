import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    createReadingMaterial,
    getAllReadingMaterials,
    getReadingMaterialBySlug,
    updateReadingMaterial,
    deleteReadingMaterial
} from '../controllers/materialController.js';

const router = express.Router();

// Admin routes for managing reading materials
router.post('/create', protect, admin, createReadingMaterial);
router.get('/', getAllReadingMaterials);

// Changed: Get reading material by slug instead of ID
router.get('/:slug', getReadingMaterialBySlug);

// Update and delete still use ID for admin actions
router.put('/:id', protect, admin, updateReadingMaterial);
router.delete('/:id', protect, admin, deleteReadingMaterial);

export default router;
