const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    address: String,
    phone: String,
    email: {
        type: String,
        trim: true,
        lowercase: true
    }
});

module.exports = mongoose.model('Customer', CustomerSchema);
