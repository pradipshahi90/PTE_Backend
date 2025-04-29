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
<<<<<<< HEAD
    totalMarks: {
        type: Number,
        default: null, // Admin will assign this later
    },
    isResultChecked: {
        type: Boolean,
        default: false, // Initially false until admin verifies/assigns marks
    },
    speakingTest: [mongoose.Schema.Types.Mixed],
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

=======
    speakingTest: [mongoose.Schema.Types.Mixed],
    submittedAt: Date,
});


>>>>>>> 5d30f3c (feat(exam): Add exam submit)
const ExamResult = mongoose.model('ExamResult', ExamResultSchema);
export default ExamResult;
