import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ExamResult from '../models/ExamResult.js';

const router = express.Router();

// Ensure the uploads directory exists
const audioDir = path.join(process.cwd(), 'uploads/audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Helper to save base64 audio data
const saveAudioFile = (base64Data) => {
    const matches = base64Data.match(/^data:audio\/webm;base64,(.+)$/);
    if (!matches) return null;

    const buffer = Buffer.from(matches[1], 'base64');
    const filename = `${uuidv4()}.webm`;
    const filepath = path.join(audioDir, filename);

    fs.writeFileSync(filepath, buffer);
    return `/uploads/audio/${filename}`;
};

// POST route to store exam results with audio
router.post('/', async (req, res) => {
    const {
        examId,
        examTitle,
        score,
        questionsWithAnswers,
        speakingTest,
        userId,
    } = req.body;

    try {
        // Process speakingTest audio
        const processedSpeakingTest = (speakingTest || []).map((item) => {
            const audioPath = item.audioData ? saveAudioFile(item.audioData) : null;
            return {
                ...item,
                audioPath,
                audioData: undefined, // Remove base64 before saving
            };
        });

        const newExamResult = new ExamResult({
            examId,
            examTitle,
            score,
            questionsWithAnswers,
            speakingTest: processedSpeakingTest,
            userId,
            submittedAt: new Date(),
        });

        await newExamResult.save();
        res.status(201).json({ message: 'Exam result stored successfully' });
    } catch (error) {
        console.error('Error storing exam result:', error);
        res.status(500).json({ message: 'Error storing exam result', error });
    }
});

// GET route to fetch all exam results (admin)
router.get('/', async (req, res) => {
    try {
        const examResults = await ExamResult.find().populate('userId examId');
        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error retrieving all exam results:', error);
        res.status(500).json({ message: 'Error retrieving exam results', error });
    }
});

// GET route to fetch all exam results for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const examResults = await ExamResult.find({ userId }).populate('examId');
        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error retrieving exam results:', error);
        res.status(500).json({ message: 'Error retrieving exam results', error });
    }
});

export default router;
