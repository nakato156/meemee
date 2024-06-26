const Post = require("../models/posts")
const User = require("../models/users")
const axios = require('axios');
const FormData = require('form-data');
const { setCookie } = require('../controllers/cookie_ctrl')

const userCtrl = {}

async function uploadFile(formData){
    return await axios.post(process.env.URL_HOST_IMG, formData, {
        headers: {
            Authorization: `Client-ID ${process.env.CLIENT_ID}`,
            ...formData.getHeaders()
        }
    })
}

userCtrl.home = (req, res) => {
    res.render("users/home", { titulo: "Home", profilePicture: req.session.user.profilePicture})
}

userCtrl.perfil = async (req, res) => {
    const user = req.session.user
    user.bio = user.bio || ''
    user.profilePicture = user.profilePicture || ''

    console.log({perfil: user})
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 6;
    
    const skip = (page - 1) * pageSize;
    
    const posts = await Post.find({author: req.session.user._id}).sort({ createdAt: -1 }).skip(skip).limit(pageSize)
    res.render("users/perfil", { titulo: "Perfil", ...user, posts})
}

userCtrl.editarPerfil = async (req, res) => {
    const {username, email, bio} = req.body
    
    const oldUsername = req.session.user.username

    let profilePicture = req.session.user.profilePicture;
    let deletehash = req.session.user.deletehash;
    
    if(req.file){
        const image = req.file.buffer
        const formData = new FormData();
        formData.append('image', image)
        const response = await uploadFile(formData)
        if (response.status === 200) {
            if(deletehash){
                const data = new FormData();
                await axios({
                    method: 'delete', 
                    url:`${process.env.URL_HOST_IMG}/${deletehash}`,
                    headers: {
                        Authorization: `Client-ID ${process.env.CLIENT_ID}`,
                        ...data.getHeaders()
                    },
                    data: data
                })
            }
            
            deletehash = response.data.data.deletehash
            profilePicture = response.data.data.link
            req.session.user.profilePicture = response.data.data.link
        }
    }

    try {
        const user = await User.findByIdAndUpdate({_id: req.session.user._id}, {username, email, bio, profilePicture, deletehash}, { new: true })
        req.session.user = user

        if(oldUsername !== user.username) {
            const userForToken = {
                username: user.username,
                name: user.name,
                email: user.email,
                genero: user.genero,
                bio: user.bio,
                id: user._id
            }
            setCookie(res, userForToken, req.session.rememberMe)
        }

        res.json({status: true, link: profilePicture})
    } catch (error) {
        res.json({status: false})
    }

}

userCtrl.editarPerfilForm = (req, res) => {
    const user = req.session.user
    user.bio = user.bio || ''
    res.render("users/editarperfil", {titulo: "Editar", ...user})
}

userCtrl.publicarForm = (req, res) => {
    res.append("Cross-Origin-Opener-Policy", "same-origin");
    res.append("Cross-Origin-Embedder-Policy", "require-corp");
    res.render("components/modalUpload")
}

userCtrl.publicarPost = async (req, res) => {
    const { descripcion } = req.body
    const file = req.file
    
    const MAX_SIZE = 20 * 1024 * 1024;
    
    if(!descripcion) return res.json({status: false, message:"Debe ingresar una descripcion "})
    if(!file) return res.json({status: false, message:"Debe subir un archivo "})
    if(file.size > MAX_SIZE) return res.json({status: false, message:"El archivo no puede superar los 20MB "})

    const formData = new FormData();

    const type = file.mimetype.split('/')[0]
    formData.append(type, file.buffer)

    try {
        const response = await uploadFile(formData)
        if(response.status !== 200) return res.json({status: false, message:"No se pudo subir el archivo"})
    }
    catch (err) {
        return res.json({status: false, message:"Error al subir el archivo"})
    }
    
    // const session = await mongoose.startSession();
    let flag = true;
    try{
        // session.startTransaction();
        const resData = response.data.data
        const post = new Post({author: req.session.user._id, description:descripcion, mediaUrl:resData.link, type, deleteHash: resData.deletehash})
        const updateResult = await User.updateOne({ _id: req.session.user._id }, 
            {
                $push: { posts: post._id }, 
                $inc:{ postCount: 1} 
            },
            // { session }
        )
        if (updateResult.modifiedCount !== 1) {
            throw new Error('Failed to update user post count');
        }
        await post.save()
    } catch (error) {
        // console.error(error)
        flag = false;
    }

    req.session.user.postCount += 1

    if(flag) res.json({status: true, link: response.data.data.link})
    else res.json({status: false, message:"Error al subir el Post"})
}

userCtrl.publicarReel = (req, res) => {
    res.render("users/publicarReel")
}

module.exports = userCtrl