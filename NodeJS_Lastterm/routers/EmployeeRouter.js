const express = require('express');
const Router = express.Router();
const { validationResult } = require('express-validator');
const Employee = require('../models/EmployeeModel');
const addEmployeeValidator = require('./validators/addEmployeeValidator');
const CheckRole = require('../auth/CheckAdminAccess');
const CheckLogin = require('../auth/CheckLogin');
const rateLimit = require("express-rate-limit");

const allEmployeeLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s (tính bằng mili giây)
    max: 5, // start blocking after 5 requests
    message: "Không thể gửi quá 5 request trong 10s khi đọc danh sách nhân viên"
});

const detailEmployeeLimiter = rateLimit({
    windowMs: 10 * 1000, // 10s
    max: 2, // start blocking after 2 requests
    message: "Không thể gửi quá 2 request trong 10s khi đọc chi tiết 1 nhân viên"
});

// Thêm nhân viên mới
Router.post('/', CheckLogin, CheckRole, addEmployeeValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user, fullName, address, phone, dateOfBirth } = req.body;
    const newEmployee = new Employee({ user, fullName, address, phone, dateOfBirth });

    newEmployee.save()
        .then(employee => res.json({ message: 'Nhân viên đã được thêm thành công', employee }))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem danh sách nhân viên
Router.get('/', CheckLogin, CheckRole, allEmployeeLimiter, (req, res) => {
    Employee.find()
        .populate('user')  // Nếu bạn muốn lấy thông tin chi tiết từ User Model
        .then(employees => res.json(employees))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xem chi tiết một nhân viên
Router.get('/:id', CheckLogin, CheckRole, detailEmployeeLimiter, (req, res) => {
    Employee.findById(req.params.id)
        .populate('user')  // Nếu bạn muốn lấy thông tin chi tiết từ User Model
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ message: 'Nhân viên không tồn tại' });
            }
            res.json(employee);
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Cập nhật thông tin nhân viên
Router.put('/:id', CheckLogin, CheckRole, addEmployeeValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(employee => res.json({ message: 'Thông tin nhân viên đã được cập nhật', employee }))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Xóa nhân viên
Router.delete('/:id', CheckLogin, CheckRole, (req, res) => {
    Employee.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Nhân viên đã được xóa' }))
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = Router;
