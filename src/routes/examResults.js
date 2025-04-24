import express from 'express';
import ExamResult from '../models/ExamResult.js';

const router = express.Router();

// POST route to store exam results
router.post('/', async (req, res) => {
    const { examId, examTitle, score, questionsWithAnswers, userId } = req.body;

    try {
        const newExamResult = new ExamResult({
            examId,
            examTitle,
            score,
            questionsWithAnswers,
            userId,
        });

        await newExamResult.save();
        res.status(201).json({ message: 'Exam result stored successfully' });
    } catch (error) {
        console.error('Error storing exam result:', error);
        res.status(500).json({ message: 'Error storing exam result', error });
    }
});

// GET route to fetch all exam results for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const examResults = await ExamResult.find({ userId });
        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error retrieving exam results:', error);
        res.status(500).json({ message: 'Error retrieving exam results', error });
    }
});

export default router;
