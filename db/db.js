const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect();

module.exports = db;

// CREATE TABLE `user` (
//     `id` int NOT NULL AUTO_INCREMENT,
//     `email` varchar(320) NOT NULL,
//     `password` varchar(100) NOT NULL,
//     `username` varchar(100) NOT NULL,
//     `phonenuber` varchar(11) NOT NULL,
//     PRIMARY KEY (`id`)
//   );