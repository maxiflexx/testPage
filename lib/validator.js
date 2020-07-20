const validator = require("email-validator");

exports.email = function (email) {
    return validator.validate(email);
};

exports.password = function (pwd1, pwd2) {
    if (pwd1 === pwd2) {
        return true;
    };
    return false;
};

exports.phoneNumber = function (phoneNumber) {
    if (phoneNumber.length !== 11) {
        return false;
    } else {
        for(var i = 0; i < 11; i++) {
            if (isNaN(phoneNumber[i])) {
                return false;
            };
        };
        return true;
    };
};