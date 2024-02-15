const express = require('express');
const Router = express.Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');

const loginValidator = require('./validators/loginValidator');
const registerValidator = require('./validators/registerValidator');

Router.get('/login', (req, res) => {
    res.render('login');
});

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { username, password } = req.body;

        User.findOne({ username: username })
            .then((user) => {
                if (!user) {
                    throw new Error('Tên người dùng không tồn tại');
                }
                return bcrypt.compare(password, user.password)
                    .then((passwordMatch) => {
                        if (!passwordMatch) {
                            return res.status(401).json({
                                code: 3,
                                message: 'Đăng nhập thất bại, mật khẩu không chính xác',
                            });
                        }

                        const { JWT_SECRET } = process.env;
                        jwt.sign(
                            {
                                username: user.username,
                                email: user.email,
                                role: user.role
                            },
                            JWT_SECRET,
                            { expiresIn: '1h' },
                            (err, token) => {
                                if (err) throw err;

                                res.cookie('userDataLogin', token, { httpOnly: true, secure: false });
                                res.cookie('userRole', user.role, { httpOnly: true, secure: false });

                                // Chuyển hướng đến trang index
                                return res.redirect('/products');

                                // return res.json({
                                //     code: 0,
                                //     message: 'Đăng nhập thành công',
                                //     token: token,
                                // });

                                // const jsonPayload = {
                                //     code: 0,
                                //     message: 'Đăng nhập thành công',
                                //     token: token,
                                //   };

                                //   res.redirect(`/products?jsonPayload=${encodeURIComponent(JSON.stringify(jsonPayload))}`);
                            }
                        );
                    });
            })
            .catch((e) => {
                return res.status(401).json({ code: 2, message: 'Đăng nhập thất bại: ' + e.message });
            });
    } else {
        let messages = result.mapped();
        let message = '';
        for (let m in messages) {
            message = messages[m].msg;
            break;
        }

        return res.json({ code: 1, message: message });
    }
});

Router.get('/register', (req, res) => {
    res.render('register');
});

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { username, email, password, role, status } = req.body;

        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    throw new Error('Email này đã được sử dụng.');
                }
                return User.findOne({ username: username });
            })
            .then((user) => {
                if (user) {
                    throw new Error('Tên người dùng này đã được sử dụng.');
                }
                return bcrypt.hash(password, 10);
            })
            .then((hashed) => {
                let newUser = new User({
                    username,
                    email,
                    password: hashed,
                    role,
                    status
                });

                return newUser.save();
            })
            .then(() => {
                return res.json({
                    code: 0,
                    message: 'Đăng ký tài khoản thành công.',
                });
            })
            .catch((e) => {
                return res.json({
                    code: 2,
                    message: 'Đăng ký tài khoản thất bại: ' + e.message,
                });
            });
    } else {
        let messages = result.mapped();
        let message = '';
        for (let m in messages) {
            message = messages[m].msg;
            break;
        }

        return res.json({ code: 1, message: message });
    }
});

module.exports = Router;