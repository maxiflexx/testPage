const db = require('../db/db');
const validator = require('../lib/validator');

class AuthController {
    register(req, res, next) {
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
};

module.exports = new AuthController();