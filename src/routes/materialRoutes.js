// routes/readingMaterialRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    createReadingMaterial,
    getAllReadingMaterials,
    getReadingMaterialById,
    updateReadingMaterial,
    deleteReadingMaterial
} from '../controllers/materialController.js';

const router = express.Router();

// Admin routes for managing reading materials
router.post('/create', protect, admin, createReadingMaterial);
router.get('/', getAllReadingMaterials);
router.get('/:id', getReadingMaterialById);
router.put('/:id', protect, admin, updateReadingMaterial);
router.delete('/:id', protect, admin, deleteReadingMaterial);

export default router;
