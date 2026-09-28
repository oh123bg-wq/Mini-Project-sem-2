const mongoose = require('mongoose');

const ClassNoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
                required: true,
            },
        ],
        bodyContent: {
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

module.exports = mongoose.model('classNotes', ClassNoteSchema);