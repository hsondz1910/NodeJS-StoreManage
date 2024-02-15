const express = require('express');
const Router = express.Router();
const { validationResult } = require('express-validator');
const Transaction = require('../models/TransactionModel');
const addTransactionValidator = require('./validators/addTransactionValidator');
const CheckLogin = require('../auth/CheckLogin');
const CheckAdminAccess = require('../auth/CheckAdminAccess');
const rateLimit = require("express-rate-limit");

const allTransactionLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s (tính bằng mili giây)
    max: 5, // start blocking after 5 requests
    message: "Không thể gửi quá 5 request trong 10s khi đọc danh sách giao dịch"
});

const detailTransactionLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s
    max: 2, // start blocking after 2 requests
    message: "Không thể gửi quá 2 request trong 10s khi đọc chi tiết 1 giao dịch"
});

// Thêm giao dịch mới
Router.post('/', CheckLogin, addTransactionValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { employee, customer, date, totalAmount } = req.body;
    const newTransaction = new Transaction({ employee, customer, date, totalAmount });

    newTransaction.save()
        .then(transaction => res.json({ message: 'Giao dịch đã được thêm thành công', transaction }))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem danh sách giao dịch
Router.get('/', CheckLogin, allTransactionLimiter, (req, res) => {
    Transaction.find()
        .populate('employee')
        .populate('customer')
        .then(transactions => res.json(transactions))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem chi tiết một giao dịch
Router.get('/:id', CheckLogin, detailTransactionLimiter, (req, res) => {
    Transaction.findById(req.params.id)
        .populate('employee')
        .populate('customer')
        .then(transaction => {
            if (!transaction) {
                return res.status(404).json({ message: 'Giao dịch không tồn tại' });
            }
            res.json(transaction);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Cập nhật thông tin giao dịch
Router.put('/:id', CheckLogin, CheckAdminAccess, addTransactionValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(transaction => {
            if (!transaction) {
                return res.status(404).json({ message: 'Giao dịch không tồn tại' });
            }
            res.json({ message: 'Giao dịch đã được cập nhật thành công', transaction });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xóa giao dịch
Router.delete('/:id', CheckLogin, CheckAdminAccess, (req, res) => {
    Transaction.findByIdAndDelete(req.params.id)
        .then(transaction => {
            if (!transaction) {
                return res.status(404).json({ message: 'Giao dịch không tồn tại' });
            }
            res.json({ message: 'Giao dịch đã được xóa thành công' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

/*
Không Xóa Giao Dịch: Một khi giao dịch đã được thực hiện và ghi lại, nó thường
    sẽ không được xóa khỏi hệ thống. Việc này giúp đảm bảo rằng có một hồ sơ đầy đủ và 
    không bị gián đoạn của tất cả các hoạt động kinh doanh. Nếu có lỗi hoặc sự cố, thông 
    thường sẽ được xử lý thông qua một giao dịch khắc phục hoặc điều chỉnh riêng biệt mà 
    không ảnh hưởng đến hồ sơ gốc.

Hạn Chế Sửa Đổi Giao Dịch: Tương tự như việc xóa, sửa đổi thông tin giao dịch sau khi 
    đã hoàn tất cũng thường bị hạn chế. Trong một số trường hợp, có thể cho phép sửa đổi 
    thông tin nhất định (như thông tin khách hàng) nhưng các yếu tố quan trọng của giao dịch 
    như số lượng, giá trị, sản phẩm, thường không được thay đổi.
*/

module.exports = Router;