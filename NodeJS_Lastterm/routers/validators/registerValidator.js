const { check } = require('express-validator');

module.exports = [
    check('username')
        .exists().withMessage('Vui lòng cung cấp tên người dùng.')
        .notEmpty().withMessage('Tên người dùng không được để trống.')
        .isLength({ min: 3 }).withMessage('Tên người dùng phải có ít nhất 3 ký tự.')
        .trim(),

    check('email')
        .exists().withMessage('Vui lòng cung cấp địa chỉ email.')
        .notEmpty().withMessage('Địa chỉ email không được để trống.')
        .isEmail().withMessage('Địa chỉ email không hợp lệ.')
        .normalizeEmail(),

    check('password')
        .exists().withMessage('Vui lòng cung cấp mật khẩu.')
        .notEmpty().withMessage('Mật khẩu không được để trống.')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự.'),

    check('role')
        .exists().withMessage('Vui lòng cung cấp vai trò người dùng.')
        .notEmpty().withMessage('Vai trò người dùng không được để trống.')
        .isIn(['Admin', 'Employee']).withMessage('Vai trò người dùng không hợp lệ.'),

    check('status')
        .exists().withMessage('Vui lòng cung cấp trạng thái tài khoản.')
        .notEmpty().withMessage('Trạng thái tài khoản không được để trống.')
        .isIn(['Active', 'Locked']).withMessage('Trạng thái tài khoản không hợp lệ.')
];
