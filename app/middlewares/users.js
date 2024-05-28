const jwt = require('jsonwebtoken');
const User = require('../models/users');
const user_middleware = {}

user_middleware.checkSession = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    return res.redirect('/login');
                } else {
                    const userDecode = (await User.findOne({username: decoded.username}))

                    if(userDecode){
                        req.session.user = userDecode.toObject();
                        next();
                    } 
                    else res.redirect('/login');

                }
            });
        } 
        else res.redirect('/login');
    }
}

module.exports = user_middleware