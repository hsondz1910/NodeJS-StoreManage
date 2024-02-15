const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    address: String,
    phone: String,
    dateOfBirth: Date
});

module.exports = mongoose.model('Employee', EmployeeSchema);
