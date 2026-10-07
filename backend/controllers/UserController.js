const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        res.json({ 
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
         });
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

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save(); // User Model 中的 pre('save') 应该会自动 Hash 密码
        
        // 剔除密码后返回
        const userResponse = await User.findById(user._id).select("-password");
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 修改：管理员更新用户信息 (Admin Edit User)
exports.updateUser = async (req, res) => {
    try {
        // 核心逻辑：后端拦截，禁止修改自己的账号
        if (req.params.id === req.user._id.toString()) {
            return res.status(403).json({ error: "Action Denied: You cannot edit your own account." });
        }

        const { name, email, role, password } = req.body;
        let updateData = { name, email, role };
        
        // 如果输入了新密码，必须重新进行 Hash 加密
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password"); 

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};