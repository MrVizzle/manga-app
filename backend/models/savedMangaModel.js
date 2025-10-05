const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Global saved

const savedMangaSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the users collection
        required: true
    },
    mangaId: {  // Id from MangaDex API
        type: String,
        required: true,
    },
    mangaTitle : {
        type: String,
        required: true,
        trim: true 
    },
    chapter: {
        type: Number,
        required: true,
    },
    readingStatus: {
        type: String,
        enum: ['reading', 'completed', 'dropped', 'on-hold', 'plan-to-read'],
        default: 'reading' 
    }
}, {timestamps: true});

savedMangaSchema.index({ userId: 1, mangaId: 1 }, { unique: true });

const SavedManga = mongoose.model('SavedManga', savedMangaSchema);
module.exports = SavedManga; // Export the SavedManga model
