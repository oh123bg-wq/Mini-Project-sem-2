const CodeNote = require("../models/CodeNote");

// 创建代码笔记
exports.addNewNote = async (req, res) => {
    try {
        const note = new CodeNote(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 获取当前用户的所有代码笔记
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await CodeNote.find({ userEmail: req.userEmail })
            .sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取单条代码笔记详情
exports.getNoteById = async (req, res) => {
    try {
        const note = await CodeNote.findOne({ _id: req.params.id, userEmail: req.userEmail });
        if (!note) {
            return res.status(404).json({ error: "Code note not found." });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新代码笔记
exports.updateNote = async (req, res) => {
    try {
        const note = await CodeNote.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
            req.body,
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ error: "Code note not found or unauthorized." });
        }
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 切换 Pin 状态
exports.togglePinNote = async (req, res) => {
    try {
        const note = await CodeNote.findOne({ _id: req.params.id, userEmail: req.userEmail });
        if (!note) {
            return res.status(404).json({ error: "Code note not found." });
        }

        note.isPinned = !note.isPinned;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 删除代码笔记
exports.deleteNote = async (req, res) => {
    try {
        const note = await CodeNote.findOneAndDelete({ _id: req.params.id, userEmail: req.userEmail });
        if (!note) {
            return res.status(404).json({ error: "Code note not found or unauthorized." });
        }
        res.json({ message: "Code note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};