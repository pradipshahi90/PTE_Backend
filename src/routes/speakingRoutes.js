import express from 'express';
import SpeakingQuestion from '../models/SpeakingQuestion.js';

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await SpeakingQuestion.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get question by ID
router.get('/:id', async (req, res) => {
    try {
        const question = await SpeakingQuestion.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new question
router.post('/', async (req, res) => {
    try {
        const newQuestion = new SpeakingQuestion(req.body);
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update question by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedQuestion = await SpeakingQuestion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete question by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuestion = await SpeakingQuestion.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
