const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    userInfo: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;