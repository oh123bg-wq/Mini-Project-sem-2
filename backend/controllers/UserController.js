const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User register
exports.register = async (req, res) => {
    try {
        // req.body is get all user data like the user name.... from frontend
        const user = new User(req.body);
        // save the data and before save hash password 
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        // go db find the same email
        const user = await User.findOne({ email: req.body.email});
        // if no find this user or wrong password
        if (!user || !user.comparePassword(req.body.password)) {
            throw new Error("Invalid email or password");
        }
        // if correct then generate token(24hr will expired)
        // the userEmail is to let backend(auth.js) know is WHO
        const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        // send the token and user data back to frontend 
        res.json({ 
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
         });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        // -password mean expect paasword no send to frontend
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin delete user
exports.deleteUser = async (req, res) => {
    try {
        // req.params.id = Gets the ID from the URL
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin create user
exports.createUser = async (req, res) => {
    try {
        // req.body is get all user data like the user name.... from frontend
        const user = new User(req.body);
        // save the data and User Model 中的 pre('save')会自动 Hash 密码
        await user.save();
        // 剔除密码后返回
        const userResponse = await User.findById(user._id).select("-password");
        // show the data without showing password in admin page
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Admin Edit User
exports.updateUser = async (req, res) => {
    try {
        // prevent admin modify own account
        // by compare the ID from the URL with currently log-in user's ID
        if (req.params.id === req.user._id.toString()) {
            return res.status(403).json({ error: "Action Denied: You cannot edit your own account." });
        }

        // destructure the data from req.body 把前端发来的数据拆解开 
        const { name, email, role, password } = req.body;
        // no password is to prevent password = "" and make user cannot log in 
        let updateData = { name, email, role };
        
        // here just edit passowrd if admin edit
        // 如果输入了新密码，必须重新进行 Hash 加密
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            // {new:true}：告诉数据库,把【更新后】的数据返回给我,而不是更新前的旧数据。
            // runValidators: true is to make sure all follow UserSchema rules.
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