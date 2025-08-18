const jwt = require('jsonwebtoken');

function generateAccessToken(staff){
    console.log('Auth Service: ', staff)
    const payload = {
        username: staff.username,
        roles: staff.roles
    }

    const secret = process.env.TOKEN_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}

module.exports = { generateAccessToken };