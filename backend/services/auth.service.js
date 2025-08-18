const jwt = require('jsonwebtoken');

function generateAccessToken(staff){
    console.log('Auth Service: ', staff);

    const payload = {
        username: staff.username,
        roles: staff.roles
    }

    const secret = process.env.TOKEN_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token){
    const secret = process.env.TOKEN_SECRET;
    try {
        const payload = jwt.verify(token, secret);
        console.log("Token verified: ", payload);
        return { verified: true, data: payload }
    } catch (err) {
        return { verified: false, data: err}
    }
}

module.exports = { generateAccessToken, verifyAccessToken };