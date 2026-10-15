const Cheatsheet = require("../models/Cheatsheet");

// Create a new Cheatsheet
exports.addNewCheatsheet = async (req, res) => {
    try {
        // Copy frontend data and 
        // make sure the user is same as the user in db
        const cheatsheet = new Cheatsheet({
            ...req.body,
            userEmail: req.user.email // Does this note belong to the guy holding the token?
        });
        await cheatsheet.save();
        res.status(201).json(cheatsheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Cheatsheets for the current user
exports.getAllCheatsheets = async (req, res) => {
    try {
        // Extract search keywords from URL query
        const { search } = req.query; 
        // make sure only fetch this user's notes
        let query = { userEmail: req.user.email };

        // Use MongoDB's $or operator to search in title，或 commands.command 和 commands.desc
        // $regex 允许部分匹配(allows partial matching)，
        // 'i' 代表不区分大小写(case-insensitive)。
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                // Use dot notation to search inside the array of sub-documents
                { 'commands.command': { $regex: search, $options: 'i' } },
                { 'commands.desc': { $regex: search, $options: 'i' } }
            ];
        }

        // Sort: newest first (-1)
        const cheatsheets = await Cheatsheet.find(query).sort({ updatedAt: -1 });
        res.json(cheatsheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Cheatsheet by ID
exports.getCheatsheetById = async (req, res) => {
    try {
        // find one note that matches URL 里的 id (_id: req.params.id) 以及 userEmail
        const cheatsheet = await Cheatsheet.findOne({ 
            _id: req.params.id, // 1. Is this the right note?
            userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
        });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found." });
        }
        res.json(cheatsheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Cheatsheet
exports.updateCheatsheet = async (req, res) => {
    try {
        // find the specific note and update (only update their own note)
        // { new: true } 表示返回更新成功后的最新文档对象（而非修改前的数据）
        const cheatsheet = await Cheatsheet.findOneAndUpdate(
            { 
                _id: req.params.id, // 1. Is this the right note?
                userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
            },
            req.body,
            { new: true, runValidators: true }
        );
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found or unauthorized." });
        }
        res.json(cheatsheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Cheatsheet
exports.deleteCheatsheet = async (req, res) => {
    try {
        // Dual verification: Match both _id and userEmail
        const cheatsheet = await Cheatsheet.findOneAndDelete({ 
            _id: req.params.id, // 1. Is this the right note?
            userEmail: req.user.email // 2. Does this note belong to the guy holding the token?
        });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found or unauthorized." });
        }
        res.json({ message: "Cheatsheet deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};