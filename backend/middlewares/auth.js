const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ email: decoded.userEmail });
        if (!user) throw new Error("No user found!");
        req.user = user;
        req.userEmail = user.email;
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// 管理员权限判断中间件
exports.requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Access denied. Admin rights required." });
    }
};