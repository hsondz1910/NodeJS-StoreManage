const { check } = require('express-validator');

module.exports = [
    check('productName')
        .exists().withMessage('Vui lòng cung cấp tên sản phẩm.')
        .notEmpty().withMessage('Tên sản phẩm không được để trống.')
        .trim(),

    check('price')
        .exists().withMessage('Vui lòng cung cấp giá sản phẩm.')
        .notEmpty().withMessage('Giá sản phẩm không được để trống.')
        .isNumeric().withMessage('Giá phải là kiểu số.'),

    check('category')
        .optional()
        .trim(),

    check('stockQuantity')
        .exists().withMessage('Vui lòng cung cấp số lượng tồn kho.')
        .notEmpty().withMessage('Số lượng tồn kho không được để trống.')
        .isNumeric().withMessage('Số lượng tồn kho phải là kiểu số.')
        .custom(value => {
            if (value < 0) {
                throw new Error('Số lượng tồn kho không thể âm.');
            }
            return true;
        }),

    check('barcode')
        .optional()
        .trim(),
];
