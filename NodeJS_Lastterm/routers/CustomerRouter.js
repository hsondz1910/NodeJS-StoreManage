const express = require('express');
const Router = express.Router();
const { validationResult } = require('express-validator');
const Customer = require('../models/CustomerModel');
const addCustomerValidator = require('./validators/addCustomerValidator');
const rateLimit = require("express-rate-limit");

const allCustomerLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s (tính bằng mili giây)
    max: 5, // start blocking after 5 requests
    message: "Không thể gửi quá 5 request trong 10s khi đọc danh sách khách hàng"
});

const detailCustomerLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s
    max: 2, // start blocking after 2 requests
    message: "Không thể gửi quá 2 request trong 10s khi đọc chi tiết 1 khách hàng"
});

// Thêm khách hàng mới
Router.post('/', addCustomerValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, address, phone, email } = req.body;
    const newCustomer = new Customer({ fullName, address, phone, email });

    newCustomer.save()
        .then(customer => res.json({ message: 'Khách hàng đã được thêm thành công', customer }))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem danh sách khách hàng
Router.get('/', allCustomerLimiter, (req, res) => {
    Customer.find()
        .then(customers => res.json(customers))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem chi tiết một khách hàng
Router.get('/:id', detailCustomerLimiter, (req, res) => {
    Customer.findById(req.params.id)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({ message: 'Khách hàng không tồn tại' });
            }
            res.json(customer);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Cập nhật thông tin khách hàng
Router.put('/:id', addCustomerValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(customer => res.json({ message: 'Thông tin khách hàng đã được cập nhật', customer }))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xóa khách hàng
Router.delete('/:id', (req, res) => {
    Customer.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Khách hàng đã được xóa' }))
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = Router;
