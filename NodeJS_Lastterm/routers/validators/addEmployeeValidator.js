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
        .matches(/^[0-9]+$/).withMessage('Số điện thoại phải chỉ chứa số.')
        .trim(),

    check('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('Ngày sinh không hợp lệ. Định dạng YYYY-MM-DD.'),

    check('user')
        .exists().withMessage('Vui lòng cung cấp ID người dùng.')
        .isMongoId().withMessage('ID người dùng không hợp lệ.')
];
