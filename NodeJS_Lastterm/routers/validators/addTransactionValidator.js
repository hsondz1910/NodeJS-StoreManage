const { check } = require('express-validator');

module.exports = [
    check('employee')
        .exists().withMessage('Vui lòng cung cấp nhân viên thực hiện giao dịch.')
        .notEmpty().withMessage('Nhân viên thực hiện giao dịch không được để trống.'),

    check('customer')
        .optional()
        .trim(),

    check('date')
        .optional()
        .isISO8601().withMessage('Ngày giao dịch không hợp lệ.'),

    check('totalAmount')
        .exists().withMessage('Vui lòng cung cấp tổng số tiền giao dịch.')
        .notEmpty().withMessage('Tổng số tiền giao dịch không được để trống.')
        .isNumeric().withMessage('Tổng số tiền giao dịch phải là kiểu số.'),
];
