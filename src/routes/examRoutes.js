import express from 'express';
import {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam
} from '../controllers/examController.js';

const router = express.Router();

// Exam routes
router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;