const { check } = require('express-validator');

module.exports = [
    check('fullName')
        .exists().withMessage('Vui lòng cung cấp tên đầy đủ.')
        .notEmpty().withMessage('Tên đầy đủ không được để trống.')
        .trim(),

    check('address')
        .optional()
        .trim(),

    check('phone')
        .optional()
        .trim(),

    check('email')
        .optional()
        .trim()
        .isEmail().withMessage('Địa chỉ email không hợp lệ.'),
];
