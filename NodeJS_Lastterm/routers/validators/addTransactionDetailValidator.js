const { check } = require('express-validator');

module.exports = [
    check('transaction')
        .exists().withMessage('Vui lòng cung cấp giao dịch liên quan.')
        .notEmpty().withMessage('Giao dịch liên quan không được để trống.'),

    check('product')
        .exists().withMessage('Vui lòng cung cấp sản phẩm liên quan.')
        .notEmpty().withMessage('Sản phẩm liên quan không được để trống.'),

    check('quantity')
        .exists().withMessage('Vui lòng cung cấp số lượng sản phẩm.')
        .notEmpty().withMessage('Số lượng sản phẩm không được để trống.')
        .isNumeric().withMessage('Số lượng sản phẩm phải là kiểu số.')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Số lượng sản phẩm phải lớn hơn 0.');
            }
            return true;
        }),

    check('price')
        .exists().withMessage('Vui lòng cung cấp giá sản phẩm.')
        .notEmpty().withMessage('Giá sản phẩm không được để trống.')
        .isNumeric().withMessage('Giá sản phẩm phải là kiểu số.'),
];
