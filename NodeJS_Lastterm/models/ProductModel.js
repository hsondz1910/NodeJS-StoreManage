const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    category: String,
    price: {
        type: Number,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    barcode: String
});

module.exports = mongoose.model('Product', ProductSchema);
