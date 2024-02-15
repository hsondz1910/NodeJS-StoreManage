const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Employee'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Locked'],
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
