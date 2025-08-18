const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

function verifyToken(req, resp, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return resp.status(401).json({ status: false, message: "Access denied; no token provided." });
    }

    const result = authService.verifyAccessToken(token);

    if (result.verified) {
        req.staff = result.data
        next()
    } else {
        return resp.status(403).json({ status: false, data: result.data });
    }
}

function verifyRoles(allowedRoles) {

    // allowedRoles remains an array even if only one role is included
    if (!Array.isArray(allowedRoles)) {
        allowedRoles = [allowedRoles];
    }

    return (req, res, next) => {
        if (!req.staff?.roles) {
            return res.status(403).json({ status: false, data: "Forbidden: No roles found." });
        }

        const staffRoles = req.user.roles;

        const hasPermission = staffRoles.some(role => allowedRoles.includes(role));

        if (!hasPermission) {
            return res.status(403).json({ status: false, data: "Access forbidden: User doesn't have privileged role." });
        }

        next()
    }
}

module.exports = { verifyToken, verifyRoles };