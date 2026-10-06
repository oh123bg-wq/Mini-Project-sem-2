const mongoose = require('mongoose');

const CodeNoteSchema = new mongoose.Schema(
    {
        userEmail: { 
            type: String, 
            required: true 
        },
        title: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        tags: [
            {
                type: String
            },
        ],
        description: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        isPinned: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('codeNotes', CodeNoteSchema);