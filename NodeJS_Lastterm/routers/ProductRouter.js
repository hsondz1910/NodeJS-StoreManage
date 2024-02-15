const express = require('express');
const Router = express.Router();
const { validationResult } = require('express-validator');
const CheckLogin = require('../auth/CheckLogin');
const Product = require('../models/ProductModel');
const rateLimit = require("express-rate-limit");
const CheckRole = require('../auth/CheckAdminAccess');

const addProductValidator = require('./validators/addProductValidator');

const allProductLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s (tính bằng mili giây)
    max: 5, // start blocking after 5 requests
    message: "Không thể gửi quá 5 request trong 10s khi đọc danh sách sản phẩm"
});
const detailProductLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s
    max: 2, // start blocking after 2 requests
    message: "Không thể gửi quá 2 request trong 10s khi đọc chi tiết 1 sản phẩm"
});

// Get by json
Router.get('/', CheckLogin, allProductLimiter, (req, res) => {
    Product.find()
        .select('productName category price stockQuantity barcode _id')
        .then(products => {
            // console.log('Dữ liệu sản phẩm:', products);
            res.render('productManagement', {
                code: 0,
                message: 'Đọc danh sách sản phẩm thành công',
                data: products
            });
        })
        .catch(error => {
            res.json({ code: 1, message: error.message });
        });
});

Router.post('/add', CheckLogin, CheckRole, addProductValidator, (req, res) => {  
    const result = validationResult(req);
    
    if (result.isEmpty()) {
        const { productName, price, category, stockQuantity, barcode } = req.body;
        const product = new Product({
            productName,
            price,
            category,
            stockQuantity,
            barcode
        });

        product.save()
            .then(() => {
                return res.json({ code: 0, message: 'Thêm sản phẩm thành công', data: product });
            })
            .catch(error => {
                return res.json({ code: 2, message: error.message });
            });
    } else {
        const message = result.array()[0].msg;
        return res.json({ code: 1, message: message });
    }
});

Router.get('/:id', CheckLogin, detailProductLimiter, (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin mã sản phẩm' });
    }

    Product.findById(id)
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: 'Đã tìm thấy sản phẩm', data: product });
            } else {
                return res.json({ code: 2, message: 'Không tìm thấy sản phẩm' });
            }
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' });
            }
            return res.json({ code: 3, message: e.message });
        });
});

Router.delete('/delete/:id', CheckLogin, CheckRole, (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin mã sản phẩm' });
    }

    Product.findByIdAndDelete(id)
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: 'Đã xóa sản phẩm' });
            } else {
                return res.json({ code: 2, message: 'Không tìm thấy sản phẩm' });
            }
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' });
            }
            return res.json({ code: 3, message: e.message });
        });
});

Router.put('/edit/:id', CheckLogin, CheckRole, (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin mã sản phẩm' });
    }

    let supportedFields = ['productName', 'category', 'price', 'stockQuantity', 'barcode'];
    let updateData = req.body;

    console.log(updateData)

    if (!updateData) {
        return res.json({ code: 2, message: 'Không có dữ liệu cần cập nhật' });
    }

    for (let field in updateData) {
        if (!supportedFields.includes(field)) {
            delete updateData[field]; // xóa các field không được hỗ trợ
        }
    }

    Product.findByIdAndUpdate(id, updateData, {
        new: true // có nghĩa là update xong sẽ trả về data mới
    })
        .then(product => {
            if (product) {
                return res.json({ code: 0, message: 'Đã cập nhật thành công', data: product });
            } else {
                return res.json({ code: 2, message: 'Không tìm thấy sản phẩm bằng id' });
            }
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' });
            }
            return res.json({ code: 3, message: e.message });
        });
});

Router.get('/edit/:id', (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin mã sản phẩm' });
    }

    Product.findById(id)
        .then(product => {
            if (product) {
                // Render trang sửa sản phẩm và truyền thông tin sản phẩm
                res.render('editProduct', { product: product });
            } else {
                return res.json({ code: 2, message: 'Không tìm thấy sản phẩm' });
            }
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' });
            }
            return res.json({ code: 3, message: e.message });
        });
});

module.exports = Router;
