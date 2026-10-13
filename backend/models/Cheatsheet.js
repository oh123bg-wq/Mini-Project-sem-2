const mongoose = require('mongoose');

// Why do sub-document schema
// allows me to define a complex Array of Objects, 
// since each command needs both a 'command' string and a 'description'
const CommandItemSchema = new mongoose.Schema({
    command: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
});

const CheatsheetSchema = new mongoose.Schema(
    {
        userEmail: { 
            type: String, 
            required: true 
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: "fa-solid fa-terminal"
        },
        commands: [CommandItemSchema]
    },
    { timestamps: true },
);

module.exports = mongoose.model('cheatsheets', CheatsheetSchema);