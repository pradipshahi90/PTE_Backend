import mongoose from "mongoose";

const readingMaterialSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['mcq', 'fill-in-blanks', 'reorder', 'reading-comprehension', 'reading-writing-fill-in-the-blank'],
        required: true
    },
    passage: {
        type: String,  // Stores the passage text if applicable
        default: null
    },
    content: {
        type: String,
        required: true
    },
    options: [
        {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            order: { type: Number, default: 0 }  // Only relevant for re-order tasks
        }
    ],
    fileUrl: {
        type: String,
        default: null  // Optional URL for PDF or any related files
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ReadingMaterial", readingMaterialSchema);
