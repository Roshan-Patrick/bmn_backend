const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    create: (username, password, role, callback) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err;
            db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role], callback);
        });
    },
    findByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) throw err;
            callback(results[0]);
        });
    },
    getAllUsers: (callback) => {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }
};

module.exports = User;
