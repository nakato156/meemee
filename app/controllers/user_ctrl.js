const Post = require("../models/posts")
const User = require("../models/users")
const axios = require('axios');
const FormData = require('form-data');

const userCtrl = {}

userCtrl.home = (req, res) => {
    res.render("users/home", { titulo: "Home", profilePicture: req.session.user.profilePicture})
}

userCtrl.perfil = (req, res) => {
    const user = req.session.user
    user.bio = user.bio || ''
    res.render("users/perfil", { titulo: "Perfil", ...user })
}

userCtrl.editarPerfil = async (req, res) => {
    const {username, email, bio} = req.body
    
    let profilePicture = req.session.user.profilePicture;
    let deletehash = req.session.user.deletehash;
    if(req.file){
        const image = req.file.buffer
        const formData = new FormData();
        formData.append('image', image)
        const response = await axios.post(process.env.URL_HOST_IMG, formData, {
            headers: {
                Authorization: `Client-ID ${process.env.CLIENT_ID}`,
                ...formData.getHeaders()
            }
        })
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
        const user = await User.updateOne({_id: req.session.user._id}, {username, email, bio, profilePicture, deletehash})
        req.session.user = user
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
    res.render("share/modalUpload")
}

userCtrl.publicarPost = (req, res) => {

}

userCtrl.publicarReel = (req, res) => {
    res.render("users/publicarReel")
}

// Dar like a una publicación
userCtrl.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const newLikeCount = await post.toggleLike(req.session.user._id); // Asumiendo que el ID del usuario se envía en el cuerpo de la solicitud
        res.json({ message: 'Like toggled successfully', likeCount: newLikeCount });
    } catch (err) {
        res.status(500).json({ error: 'Error toggling like', details: err });
    }
};

module.exports = userCtrl