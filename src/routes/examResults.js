import express from 'express';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
=======
>>>>>>> 5d30f3c (feat(exam): Add exam submit)
import ExamResult from '../models/ExamResult.js';

const router = express.Router();

<<<<<<< HEAD
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

=======
// POST route to store exam results
router.post('/', async (req, res) => {
    const { examId, examTitle, score, questionsWithAnswers, userId } = req.body;

    try {
>>>>>>> 5d30f3c (feat(exam): Add exam submit)
        const newExamResult = new ExamResult({
            examId,
            examTitle,
            score,
            questionsWithAnswers,
<<<<<<< HEAD
            speakingTest: processedSpeakingTest,
            userId,
            submittedAt: new Date(),
=======
            userId,
>>>>>>> 5d30f3c (feat(exam): Add exam submit)
        });

        await newExamResult.save();
        res.status(201).json({ message: 'Exam result stored successfully' });
    } catch (error) {
        console.error('Error storing exam result:', error);
        res.status(500).json({ message: 'Error storing exam result', error });
    }
});

<<<<<<< HEAD
// PUT route to update exam result grading (admin only)
router.put('/:resultId', async (req, res) => {
    const { resultId } = req.params;
    const { totalMarks, isResultChecked } = req.body;

    // Validate inputs
    if (totalMarks === undefined && isResultChecked === undefined) {
        return res.status(400).json({
            message: 'At least one field (totalMarks or isResultChecked) must be provided'
        });
    }

    try {
        // Create update object with only the fields provided
        const updateData = {};
        if (totalMarks !== undefined) {
            updateData.totalMarks = totalMarks;
        }
        if (isResultChecked !== undefined) {
            updateData.isResultChecked = isResultChecked;
        }

        // Find and update the exam result
        const updatedResult = await ExamResult.findByIdAndUpdate(
            resultId,
            updateData,
            { new: true, runValidators: true }
        );

        // Check if exam result exists
        if (!updatedResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        res.status(200).json({
            message: 'Exam result updated successfully',
            result: updatedResult
        });
    } catch (error) {
        console.error('Error updating exam result:', error);
        res.status(500).json({ message: 'Error updating exam result', error: error.message });
    }
});

// PATCH route to batch update multiple exam results (admin only)
router.patch('/batch-update', async (req, res) => {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Invalid updates array provided' });
    }

    try {
        const updatePromises = updates.map(async (update) => {
            const { resultId, totalMarks, isResultChecked } = update;

            // Skip entries without ID
            if (!resultId) return null;

            // Create update object with only the fields provided
            const updateData = {};
            if (totalMarks !== undefined) {
                updateData.totalMarks = totalMarks;
            }
            if (isResultChecked !== undefined) {
                updateData.isResultChecked = isResultChecked;
            }

            // Skip if no fields to update
            if (Object.keys(updateData).length === 0) return null;

            // Update the document
            return ExamResult.findByIdAndUpdate(
                resultId,
                updateData,
                { new: true, runValidators: true }
            );
        });

        const results = await Promise.all(updatePromises);
        const updatedResults = results.filter(result => result !== null);

        res.status(200).json({
            message: 'Batch update completed',
            updatedCount: updatedResults.length,
            results: updatedResults
        });
    } catch (error) {
        console.error('Error in batch update:', error);
        res.status(500).json({ message: 'Error processing batch update', error: error.message });
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

=======
>>>>>>> 5d30f3c (feat(exam): Add exam submit)
// GET route to fetch all exam results for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
<<<<<<< HEAD
        const examResults = await ExamResult.find({ userId }).populate('examId');
=======
        const examResults = await ExamResult.find({ userId });
>>>>>>> 5d30f3c (feat(exam): Add exam submit)
        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error retrieving exam results:', error);
        res.status(500).json({ message: 'Error retrieving exam results', error });
    }
});

export default router;
