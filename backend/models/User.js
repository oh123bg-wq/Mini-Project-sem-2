const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    // Auto track createdAt & updatedAt
    { timestamps: true },
);

// 加密密码 hash paasword before save to mongodb
UserSchema.pre('save', async function () {
    // 如果密码没有被修改，then跳过
    if (!this.isModified('password')) {
        return; 
    }

    // Hash the plain text password
    this.password = await bcrypt.hash(
        this.password, 
        Number(process.env.BCRYPT_SALT_ROUNDS)
    );
});

// check the user password is it same as in mongodb or not
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);