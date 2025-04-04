import mongoose from "mongoose";
import slugify from "slugify";

const readingMaterialSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
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
            isCorrect: {
                type: Boolean,
                required: function () { return this.type !== 'reorder'; }
            },
            order: {
                type: Number,
                default: null,
                required: function () { return this.type === 'reorder'; }
            }
        }
    ],
    fileUrl: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isPremium: {
        type: Boolean,
        default: false  // Default to 'false' if not specified
    }
});

// Auto-generate or update slug before saving
readingMaterialSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model("ReadingMaterial", readingMaterialSchema);
