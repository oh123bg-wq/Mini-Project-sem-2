const CodeNote = require("../models/CodeNote");

// 创建代码笔记
exports.addNewNote = async (req, res) => {
    try {
        const note = new CodeNote({
            ...req.body,
            userEmail: req.user.email
        });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 获取当前用户的所有代码笔记（支持 Search & Filter）
exports.getAllNotes = async (req, res) => {
    try {
        const { search, language } = req.query; // 获取查询参数
        let query = { userEmail: req.user.email };

        // Search 功能：模糊匹配 title 或 description 或 code
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter 功能：根据编程语言过滤
        if (language && language !== 'All') {
            query.language = language;
        }

        const notes = await CodeNote.find(query).sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        const { search, subject } = req.query;
        let query = { userEmail: req.user.email };

        // 满足搜索条件 Requirement 3
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { bodyContent: { $regex: search, $options: 'i' } }
            ];
        }

        if (subject && subject !== 'All') {
            query.subject = subject;
        }

        const notes = await ClassNote.find(query).sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取单条代码笔记详情
exports.getNoteById = async (req, res) => {
    try {
        const note = await CodeNote.findOne({ _id: req.params.id, userEmail: req.user.email });
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
            { _id: req.params.id, userEmail: req.user.email },
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
        const note = await CodeNote.findOne({ _id: req.params.id, userEmail: req.user.email });
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
        const note = await CodeNote.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
        if (!note) {
            return res.status(404).json({ error: "Code note not found or unauthorized." });
        }
        res.json({ message: "Code note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};