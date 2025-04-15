// ----- controllers/examController.js -----
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

// Create a new exam with questions
export const createExam = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { title, description, sections } = req.body;

        // Process each section and create questions
        const processedSections = [];
        let totalScore = 0;

        for (const section of sections) {
            const sectionQuestions = [];

            // Create all questions for this section
            for (const questionData of section.questions) {
                const newQuestion = new Question(questionData);
                const savedQuestion = await newQuestion.save({ session });
                sectionQuestions.push(savedQuestion._id);
                totalScore += newQuestion.maxScore;
            }

            // Add processed section with question IDs
            processedSections.push({
                name: section.name,
                duration: section.duration,
                questions: sectionQuestions
            });
        }

        // Create the exam with processed sections
        const exam = new Exam({
            title,
            description,
            sections: processedSections,
            totalScore,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });

        const savedExam = await exam.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            data: savedExam
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all exams
export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find();

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single exam with populated questions
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate({
                path: 'sections.questions',
                model: 'Question'
            });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update an exam
export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete an exam and its questions
export const deleteExam = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the exam
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        // Extract all question IDs
        const questionIds = [];
        exam.sections.forEach(section => {
            questionIds.push(...section.questions);
        });

        // Delete all questions
        if (questionIds.length > 0) {
            await Question.deleteMany({ _id: { $in: questionIds } }, { session });
        }

        // Delete the exam
        await Exam.findByIdAndDelete(req.params.id, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Exam and all associated questions deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};