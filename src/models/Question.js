// ----- models/Question.js -----
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['reading', 'writing', 'listening']
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questionText: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaType: {
        type: String,
        enum: ['none', 'audio', 'image', 'text'],
        default: 'none'
    },

    // For multiple-choice, fill-in-the-blank, etc.
    options: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    correctAnswer: {
        type: mongoose.Schema.Types.Mixed
    },

    maxScore: {
        type: Number,
        required: true,
        default: 1
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp on save
questionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Question = mongoose.model('Question', questionSchema);
export default Question;