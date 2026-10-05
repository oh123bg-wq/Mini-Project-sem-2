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
    { timestamps: true },
);

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return; 
    }

    this.password = await bcrypt.hash(
        this.password, 
        Number(process.env.BCRYPT_SALT_ROUNDS)
    );
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);