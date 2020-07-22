const db = require('../db/db');
const validator = require('../lib/validator');
const nodemailer = require('nodemailer');
const authConfig = require('../config/auth');

class AuthController {
    register (req, res, next) {
        if (!(validator.email(req.body.email))) {
            res.send(`
                <script type="text/javascript">
                    alert("Invalid email");
                    window.location.href = "/register";
                </script>`);
        } else if (!(validator.password(req.body.pwd, req.body.re_pwd))) {
            res.send(`
                <script type="text/javascript">
                    alert("Invalid password");
                    window.location.href = "/register";
                </script>`);
        } else if (!(validator.phoneNumber(req.body.phone_number))) {
            res.send(`
                <script type="text/javascript">
                    alert("Invalid phone number");
                    window.location.href = "/register";
                </script>`);
        } else {
            db.query('SELECT * FROM user WHERE email = (?)', [req.body.email], function (err, results, fields) {
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
                            alert("Email duplicates");
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
                                    alert("Phone number duplicates");
                                    window.location.href = "/register";
                                </script>`);
                            return;
                        } else {
                            db.query('INSERT INTO user (email, password, username, phonenumber) VALUES (?, ?, ?, ?)',
                                [req.body.email, req.body.pwd, req.body.username, req.body.phone_number],
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
                        };
                    });
                };
            });
        };
    };

    mailSender (req, res, next) {
        if (authConfig.auth.status === true) {
            res.send(false);
            return;
        } else {
            authConfig.auth.status = true;
            authConfig.auth.code = req.body.code;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: authConfig.gmail.id,
                    pass: authConfig.gmail.pwd
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
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            console.log(req.body)
            res.send(true);
            return;
        };
        
        
    };
};

module.exports = new AuthController();