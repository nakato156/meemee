const User = require("../models/users")
const jwt = require("jsonwebtoken")

const authCtrl = {}

authCtrl.login = async (req, res) => {
    const {username, password, rememberMe} = req.body;

    const user = await User.findOne({username: username});
    if(!user || user.password !== password){
        return res.json({msg: "Usuario o contraseña incorrecta ", field:"username"});
    }

    const userForToken = {
        username: username,
        name: user.name,
        email: user.email,
        genero: user.genero,
        bio: user.bio,
        id: user._id
    }

    req.session.user = user;
    
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

    res.json({token})
}
    
authCtrl.registro = async (req, res) => {
    const {username, name, email, password, birdthday, genero, rememberMe} = req.body;

    if((await User.find({username: username})).length > 0){
        return res.json({msg: "El usuario ya existe", field:"username"});
    }
    if((await User.find({email: email})).length > 0){
        return res.json({msg: "El email ya está en uso", field:"email"});
    }

    new_user = new User({username: username, name:name, email:email, password:password,  birdthday:birdthday, genero:genero});
    console.log(new_user);

    const userForToken = {
        username: username,
        name: name,
        email: email,
        genero: genero,
        bio: new_user.bio,
        id: new_user._id
    }
    try {

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

        req.session.user = new_user;

        await new_user.save();
        res.json({token});
    } catch (error) {
        res.status(500).json({msg: "Error al registrar el usuario"});
    }
};

authCtrl.loginForm = (req, res) => {
    res.render('auth/login', {titulo: "Login - MeeMee"})
}

authCtrl.registroForm = async (req, res) => {
    const user = await User.find({username: "wilson"})
    console.log(user);
    res.render('auth/registro', {titulo: "Registro - MeeMee"})
}

module.exports = authCtrl