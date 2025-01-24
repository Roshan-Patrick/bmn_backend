const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    login: (req, res) => {
        const { username, password } = req.body;
        User.findByUsername(username, (user) => {
            if (!user) return res.status(401).send('Invalid credentials');
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) return res.status(401).send('Invalid credentials!! Please send credentials');

                const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: "1hr" });
                res.json({ 
                    token:token,
                    msg:"Authorized"
                 });
            });
        });
    },
    register: (req, res) => {
        const { username, password, role } = req.body;
        User.create(username, password, role, (err, result) => {
            if (err) {
                console.error('Error creating user:', err); // Log detailed error to the console
                return res.status(500).send('Error creating user');
            }
            res.status(201).send('User registered successfully');
        });
    },
    getUsers: (req, res) => {
        User.getAllUsers((users) => {
            res.json(users);
        });
    }
};

module.exports = authController;
