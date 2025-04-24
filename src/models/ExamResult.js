import mongoose from 'mongoose';

const ExamResultSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionsWithAnswers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            category: String,
            questionText: String,
            correctAnswer: mongoose.Schema.Types.Mixed,
            userAnswer: mongoose.Schema.Types.Mixed,
            isCorrect: { type: String, enum: ['true', 'false', 'manual-grading', 'partial'] },
            maxScore: Number,
        },
    ],
    score: {
        score: Number,
        possibleScore: Number,
        percentage: Number,
    },
    speakingTest: [mongoose.Schema.Types.Mixed],
    submittedAt: Date,
});


const ExamResult = mongoose.model('ExamResult', ExamResultSchema);
export default ExamResult;
