import mongoose from 'mongoose';

const SpeakingQuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Read Aloud', 'Repeat Sentence', 'Describe Image', 'Retell Lecture', 'Answer Short Question']
    },
    question: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String // optional, if you want to attach audio
    },
    imageUrl: {
        type: String // optional, for Describe Image
    },
    duration: {
        type: Number // in seconds
    }
}, {
    timestamps: true
});

export default mongoose.model('SpeakingQuestion', SpeakingQuestionSchema);
