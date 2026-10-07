const Cheatsheet = require("../models/Cheatsheet");

// 创建 Cheatsheet
exports.addNewCheatsheet = async (req, res) => {
    try {
        const cheatsheet = new Cheatsheet({
            ...req.body,
            userEmail: req.user.email 
        });
        await cheatsheet.save();
        res.status(201).json(cheatsheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 获取当前用户的所有 Cheatsheet（ Search & Filter）
exports.getAllCheatsheets = async (req, res) => {
    try {
        const { search, category } = req.query; // 获取查询参数
        let query = { userEmail: req.user.email };

        // Search 功能：模糊匹配 title，或者匹配数组内的 commands.command 和 commands.desc
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'commands.command': { $regex: search, $options: 'i' } },
                { 'commands.desc': { $regex: search, $options: 'i' } }
            ];
        }

        // Filter 功能：根据分类过滤
        if (category && category !== 'All') {
            query.category = { $regex: category, $options: 'i' }; // 忽略大小写的分类匹配
        }

        const cheatsheets = await Cheatsheet.find(query).sort({ updatedAt: -1 });
        res.json(cheatsheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取单条 Cheatsheet 详情
exports.getCheatsheetById = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOne({ _id: req.params.id, userEmail: req.user.email });
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
            { _id: req.params.id, userEmail: req.user.email },
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

// 删除 Cheatsheet
exports.deleteCheatsheet = async (req, res) => {
    try {
        const cheatsheet = await Cheatsheet.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
        if (!cheatsheet) {
            return res.status(404).json({ error: "Cheatsheet not found or unauthorized." });
        }
        res.json({ message: "Cheatsheet deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};