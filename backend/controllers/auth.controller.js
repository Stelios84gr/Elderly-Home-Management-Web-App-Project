const bcrypt = require('bcrypt');
const Staff = require('../models/staff.model');
const authService = require('../services/auth.service');
const logger = require('../logger/logger');

exports.login = async(req, res) => {
    console.log("Login user", req.body);

    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await Staff.findOne({ username: username }, {username: 1, password: 1, roles: 1});

        if (!result) {
            logger.error("Error finding user.");
            return res.status(404).json({ status: false, data: "User not found." });
        };
    
    const isMatch = await bcrypt.compare(password, result.password);
         
        if (isMatch) {
            const token = authService.generateAccessToken(result);
            return res.status(200).json({ status: true, data: token}); 
        } else {
            logger.error("Error: Invalid credentials.");
            return res.status(401).json({ status: false, data: "Invalid credentials."});
        };
    } catch (err) {
        console.log("Problem logging in.", err);
        logger.error("Error logging in: ", err);
        return res.status(400).json({ status: false, data: err });
    };
};

exports.googleLogin = async(req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).json({ status: false, data: "Authorization code not returned." });
    } else {
        let user = await authService.googleAuth(code);
        if (user) {
            res.status(200).json({ status: true, data: user });
        } else {
            res.status(400).json({ status: false, data: "Problem logging in with user." });
        };
    };
};