const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        if (!user || !user.comparePassword(req.body.password)) {
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // -password 表示在返回结果中剔除敏感的密码字段
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 管理员删除指定用户
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 管理员更新用户信息 (Admin Edit User)
exports.updateUser = async (req, res) => {
    try {
        // 从请求体中解构允许修改的字段（防止恶意修改密码等）
        const { name, email, role } = req.body;
        
        // 查找并更新用户，{ new: true } 返回更新后的数据
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
        ).select("-password"); // 排除密码字段

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};