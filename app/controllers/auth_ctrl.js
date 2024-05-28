const User = require("../models/users")
const { setCookie } = require("./cookie_ctrl")

const authCtrl = {}

authCtrl.login = async (req, res) => {
    const {username, password, rememberMe} = req.body;

    const user = await User.findOne({username: username});
    const isMatchPass = await user.comparePassword(password);
    if(!user || !isMatchPass){
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
    req.session.rememberMe = rememberMe;
    
    setCookie(res, userForToken, rememberMe)
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

    const userForToken = {
        username: username,
        name: name,
        email: email,
        genero: genero,
        bio: new_user.bio,
        id: new_user._id
    }
    try {
        setCookie(res, userForToken, rememberMe)
        req.session.user = new_user;
        req.session.rememberMe = rememberMe;

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