const bcrypt = require('bcrypt');
const Staff = require('../models/staff.model');
const authService = require('../services/auth.service');

exports.login = async(req, res) => {
    console.log("Login user", req.body);

    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await Staff.findOne({ username: username }, {username: 1, password: 1, roles: 1});

        if (!result) {
            return res.status(404).json({ status: false, data: "User not found." });
        }
    
    const isMatch = await bcrypt.compare(password, result.password);
         
        if (isMatch) {
            const token = authService.generateAccessToken(result);
            return res.status(200).json({ status: true, data: token}); 
        } else {
            return res.status(401).json({ status: false, data: "Invalid credentials."});
        }
    } catch (err) {
        console.log("Problem logging in.", err);
        return res.status(400).json({ status: false, data: err });
    }
}