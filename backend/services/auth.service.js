const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

function generateAccessToken(staff){
    console.log('Auth Service: ', staff);

    const payload = {
        username: staff.username,
        email: staff.email,
        roles: staff.roles
    };

    const secret = process.env.TOKEN_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

function verifyAccessToken(token){
    const secret = process.env.TOKEN_SECRET;
    try {
        const payload = jwt.verify(token, secret);
        console.log("Token verified: ", payload);
        return { verified: true, data: payload }
    } catch (err) {
        logger.error("Error verifying access token.", err);
        return { verified: false, data: err}
    };
};

async function googleAuth(code) {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID
        });

        const userInfo = await ticket.getPayload();
        return { user: userInfo, tokens };
    } catch (err) {
        console.log("Error during OAuth 2.0 token verification:", err);
        logger.error("Error during OAuth 2.0 token verification:", err);
        return { error: "Google authentication failed." };
    };
};

module.exports = { generateAccessToken, verifyAccessToken, googleAuth };