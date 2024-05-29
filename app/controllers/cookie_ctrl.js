const jwt = require("jsonwebtoken")

const cookieCtrl = {}

cookieCtrl.setCookie = (res, rememberMe, userForToken) => {
    const JWT_EXPIRATION_LONG = process.env.JWT_EXPIRATION_LONG
    const JWT_EXPIRATION_SHORT = process.env.JWT_EXPIRATION_SHORT

    const timeExpiresIn = Number(rememberMe ? JWT_EXPIRATION_LONG : JWT_EXPIRATION_SHORT);
    const expiresIn = rememberMe ? timeExpiresIn * 24 * 60 * 60 * 1000 : timeExpiresIn * 60 * 60 * 1000
    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: expiresIn});

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn // 7 días o 1 hora
    });
    return token;
}

module.exports = cookieCtrl;