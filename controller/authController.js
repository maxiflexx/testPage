const db = require('../db/db');
const validator = require('../lib/validator');
const nodemailer = require('nodemailer');
const authConfig = require('../config/auth');
const oatuh = require('../config/oauth.json');
const bcrypt = require('bcrypt');

class AuthController {
    register (req, res, next) {
        if (!(authConfig.auth.status)) {
            res.send(`
                <script type="text/javascript">
                    alert("인증 코드를 작성하세요.");
                    window.location.href = "/register";
                </script>`);
            return;
        } else {
            if (authConfig.auth.email !== req.body.email) {
                res.send(`
                    <script type="text/javascript">
                        alert("메일을 바르게 입력하세요.");
                        window.location.href = "/register";
                    </script>`);
                return;
            } else if (authConfig.auth.code !== req.body.code) {
                res.send(`
                    <script type="text/javascript">
                        alert("코드를 바르게 입력하세요.");
                        window.location.href = "/register";
                    </script>`);
                return;
            } else if (!(validator.password(req.body.pwd, req.body.re_pwd))) {
                res.send(`
                    <script type="text/javascript">
                        alert("패스워드를 바르게 입력하세요.");
                        window.location.href = "/register";
                    </script>`);
                return;
            } else if (!(validator.phoneNumber(req.body.phone_number))) {
                res.send(`
                    <script type="text/javascript">
                        alert("핸드폰 번호를 바르게 입력하세요.");
                        window.location.href = "/register";
                    </script>`);
                return;
            } else {
                db.query('SELECT * FROM user WHERE phonenumber = (?)', [req.body.phone_number], function (err, results, fields) {
                    if (err) {
                        err.message = 'DB Operation Failure';
                            err.status = 500;
                            console.log(err)
                            next(err);
                            return;
                    };
                    if (results.length !== 0) {
                        res.send(`
                            <script type="text/javascript">
                                alert("핸드폰 번호가 중복됩니다.");
                                window.location.href = "/register";
                            </script>`);
                        return;
                    } else {
                        bcrypt.hash(req.body.pwd, 10, (err, hash) => {
                            db.query('INSERT INTO user (email, password, username, phonenumber) VALUES (?, ?, ?, ?)',
                                [req.body.email, hash, req.body.username, req.body.phone_number],
                                function (err, results, fields) {
                                    if (err) {
                                        err.message = 'DB Operation Failure';
                                        err.status = 500;
                                        console.log(err)
                                        next(err);
                                        return;
                                    };
                                    console.log(req.body.email);
                                    res.redirect(301, '/');
                                    return;
                            });
                        })
                        
                    };
                });
            };
        };
    };

    mailSender (req, res, next) {
        if (!(validator.email(req.body.email))) {
            res.send({ status: false, message: '메일을 바르게 입력하세요.'});
            return;
        };

        if (authConfig.auth.status) {
            res.send({ status: false, message: '이미 발송했습니다.'});
            return;
        } else {
            db.query('SELECT * FROM user WHERE email=(?)', [req.body.email], function (err, results, fields) {
                if (err) {
                    err.message = 'DB Operation Failure';
                    err.status = 500;
                    console.log(err)
                    next(err);
                }
                if (results.length !== 0) {
                    res.send({ status: false, message: '이전에 가입한 적이 있습니다.'});
                    return;
                } else {
                    // https://blog.eunsatio.io/develop/nodemailer%EC%99%80-gmail%EB%A1%9C-%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1%ED%95%98%EA%B8%B0-%E3%85%A1-OAuth2 참고
                    authConfig.auth.code = req.body.code;
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            type: 'OAuth2',
                            user: authConfig.gmail.id,
                            clientId: oatuh.web.client_id,
                            clientSecret: oatuh.web.client_secret,
                            refreshToken: oatuh.web.refresh_token,
                            accessToken: oatuh.web.access_token,
                            expires: 3600
                        }
                    });
                    let mailOptions = {
                        from: authConfig.gmail.id,
                        to: req.body.email,
                        subject: 'Mailer Test',
                        html: `
                            <p>Please click the link below.</p>
                            <p>${authConfig.auth.code}</p>   
                        `
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                            res.send({ status: false, message: '발송 실패!! 다시 시도해주세요.'});
                            return;
                        } else {
                            console.log('Email sent: ' + info.response);
                            authConfig.auth.status = true;
                            authConfig.auth.email = req.body.email;
                            res.send({ status: true, message: '메일을 발송했습니다. 코드를 입력해주세요.'});
                            return;
                        };
                    });
                    transporter.close();
                };
            });
        };
    };

    login (req, res, next) {
        console.log('login_process')
        db.query('SELECT * FROM user WHERE email = (?)', [req.body.email], function (error, results, fields) {
            if (results.length === 0) {
                res.send(`
                    <script type="text/javascript">
                        alert("메일을 바르게 입력하세요.");
                        window.location.href = "/login";
                    </script>`);
                return;
            } else {
                bcrypt.compare(req.body.pwd, results[0].password, function (err, result) {
                    if (result) {
                        console.log('ok');
                        res.redirect('/');
                        return;
                    } else {
                        res.send(`
                            <script type="text/javascript">
                                alert("비밀번호를 바르게 입력하세요.");
                                window.location.href = "/login";
                            </script>`);
                        return;
                    };
                });
            };
        });
    };
};

module.exports = new AuthController();