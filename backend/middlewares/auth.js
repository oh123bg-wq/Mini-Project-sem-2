const jwt = require('jsonwebtoken')
const User = require('../models/User')

// make sure user arleady login (Middleware)
exports.authenticate = async (req, res, next) => {
    try {
        // get token from frontend request(just get token the bearer dont need)
        const token = req.headers.authorization.split(" ")[1];
        // decoded the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // go find the user email
        const user = await User.findOne({ email: decoded.userEmail });
        if (!user) throw new Error("No user found!");
        // get the data from db after finding with the email
        req.user = user;
        req.userEmail = user.email;
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// make sure is admin (Middleware)
exports.requireAdmin = (req, res, next) => {
    // check the user role is admin or not
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Access denied. Admin rights required." });
    }
};