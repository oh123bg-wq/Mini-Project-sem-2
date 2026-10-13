const CodeNote = require("../models/CodeNote");

// Create a new code note
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

// Get all code notes
exports.getAllNotes = async (req, res) => {
    try {
        // Extract search keywords and language filter from URL query
        const { search, language } = req.query; 
        // make sure only fetch this user's notes
        let query = { userEmail: req.user.email };

        // Use MongoDB's $or operator to search in title 或 description 或 code.
        // $regex 允许部分匹配(allows partial matching)，
        // 'i' 代表不区分大小写(case-insensitive)。
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter 功能：根据编程语言过滤
        // If a specific language is selected (and it's not "All")
        if (language && language !== 'All') {
            query.language = language;
        }

        // Sort: Pinned notes at the top (-1), then newest first (-1)
        const notes = await CodeNote.find(query).sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get code note by ID
exports.getNoteById = async (req, res) => {
    try {
        // find one note that matches URL 里的 id (_id: req.params.id) 以及 userEmail
        const note = await CodeNote.findOne({ _id: req.params.id, userEmail: req.user.email });
        if (!note) {
            return res.status(404).json({ error: "Code note not found." });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a code note
exports.updateNote = async (req, res) => {
    try {
        // find the specific note and update (only update their own note)
        // { new: true } 表示返回更新成功后的最新文档对象（而非修改前的数据）
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

// Toggle Pin status (切换置顶状态)
exports.togglePinNote = async (req, res) => {
    try {
        // find the specific note ad toggle pin(only toggle pin their own note)
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

// Delete a code note
exports.deleteNote = async (req, res) => {
    try {
        // findOneAndDelete：查找匹配 _id 和 userEmail 的笔记并从数据库中直接删除
        const note = await CodeNote.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
        if (!note) {
            return res.status(404).json({ error: "Code note not found or unauthorized." });
        }
        res.json({ message: "Code note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};