const ClassNote = require("../models/ClassNote");

// Create a new note
exports.addNewNote = async (req, res) => {
    try {
        // req.body is get all user data like the note title.... from frontend
        const note = new ClassNote({
            ...req.body,
            userEmail: req.user.email // Does this note belong to the guy holding the token?
        });
        // save the note to mongodb
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        // Extract search keywords and subject filter from URL query string 
        // (e.g., ?search=react&subject=database)
        const { search, subject } = req.query;
        // only find curent user's note
        let query = { userEmail: req.user.email };

        // Search & Filter
        // if user typed something in search bar
        if (search) {
            // Use MongoDB's $or operator to search in BOTH title and bodyContent.
            // $regex 允许部分匹配(allows partial matching)，
            // 'i' 代表不区分大小写(case-insensitive)。
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { bodyContent: { $regex: search, $options: 'i' } }
            ];
        }

        // If a specific subject is selected (and it's not "All")
        if (subject && subject !== 'All') {
            query.subject = subject;
        }

        // Find matching notes and sort them: Pinned notes first, then newest first
        const notes = await ClassNote.find(query).sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get note by ID
exports.getNoteById = async (req, res) => {
    try {
        // find one note that matches URL 里的 id (_id: req.params.id) 以及 userEmail
        const note = await ClassNote.findOne({ 
            _id: req.params.id, // 1. Is this the right note?
            userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
        });

        // if can't find note
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        // otherwise send note back to frontend
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update note
exports.updateNote = async (req, res) => {
    try {
        // findOneAndUpdate：同时验证 _id 和 userEmail，并用 req.body 中的新字段更新它
        // only edit their own notes, preventing them from modifying someone else's data.
        // { new: true } 表示返回更新成功后的最新文档对象（而非修改前的数据）
        const note = await ClassNote.findOneAndUpdate(
            { 
                _id: req.params.id, // 1. Is this the right note?
                userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
            },
            req.body,
            { new: true, runValidators: true }
        );

        // if can't find note
        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized." });
        }

        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Toggle Pin status (切换置顶状态)
exports.togglePinNote = async (req, res) => {
    try {
        // 先查询属于该用户的指定 ID 笔记
        const note = await ClassNote.findOne({ 
            _id: req.params.id, // 1. Is this the right note?
            userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
        });

        // if can't find note
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        // Reverse the current boolean value (true becomes false, false becomes true)
        note.isPinned = !note.isPinned;

        // 保存修改后的状态回 MongoDB
        await note.save();

        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete note
exports.deleteNote = async (req, res) => {
    try {
        // findOneAndDelete：查找匹配 _id 和 userEmail 的笔记并从数据库中直接删除
        const note = await ClassNote.findOneAndDelete({ 
            _id: req.params.id, // 1. Is this the right note?
            userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
        });

        // if can't find note，说明无权删除或已被删除
        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized." });
        }

        res.json({ message: "Note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};