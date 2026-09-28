const mongoose = require('mongoose');

const CodeNoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
            },
        ],
        explanation: {
            type: String,
            required: true,
        },
        codeSnippet: {
            type: String,
            required: true,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('codeNotes', CodeNoteSchema);