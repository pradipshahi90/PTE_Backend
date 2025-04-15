// ----- models/Exam.js -----
import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sections: [{
        name: {
            type: String,
            required: true,
            enum: ['reading', 'writing', 'listening']
        },
        duration: {
            type: Number, // in minutes
            required: true
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }],
    totalScore: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
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
examSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
