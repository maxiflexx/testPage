const db = require('../db/db');

class AuthController {
    register(req, res, next) {
        console.log(req.body)
        db.query('INSERT INTO user (email, password, username, phonenumber) VALUES (?, ?, ?, ?)',
            [req.body.email, req.body.pwd, req.body.username, req.body.phone_number],
            function (error, results, fields) {
                if (error) {
                    error.message = 'DB Operation Failure';
                    error.status = 500
                    console.log(error)
                    next(error);
                    return;
                };
                console.log(req.body.email);
                res.redirect(301, '/');
            });
    };
};

module.exports = new AuthController();