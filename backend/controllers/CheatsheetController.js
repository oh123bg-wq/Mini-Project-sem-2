const Cheatsheet = require("../models/Cheatsheet");

// 创建 Cheatsheet
exports.addNewCheatsheet = async (req, res) => {
    try {
        const cheatsheet = new Cheatsheet(req.body);
        await cheatsheet.save();
        res.status(201).json(cheatsheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 获取当前用户的所有 Cheatsheet
exports.getAllCheatsheets = async (req, res) => {
    try {
        const cheatsheets = await Cheatsheet.find({ userEmail: req.userEmail })
            .sort({ isPinned: -1, updatedAt: -1 });
        res.json(cheatsheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取单条 Cheatsheet 详情
exports.getCheatsheetById = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOne({ _id: req.params.id, userEmail: req.userEmail });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found." });
        }
        res.json(cheatsheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新 Cheatsheet
exports.updateCheatsheet = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
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

// 切换 Pin 状态
exports.togglePinCheatsheet = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOne({ _id: req.params.id, userEmail: req.userEmail });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found." });
        }

        cheatsheet.isPinned = !cheatsheet.isPinned;
        await cheatsheet.save();
        res.json(cheatsheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 删除 Cheatsheet
exports.deleteCheatsheet = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOneAndDelete({ _id: req.params.id, userEmail: req.userEmail });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found or unauthorized." });
        }
        res.json({ message: "Cheatsheet deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};