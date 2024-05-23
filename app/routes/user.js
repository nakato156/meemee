const { Router } = require("express")
const router = Router()

const { checkSession } = require('../middlewares/users')
const { home, perfil, editarPerfil, editarPerfilForm, publicarForm, publicarPost, publicarReel, toggleLike } = require('../controllers/user_ctrl')

router.use(checkSession)

router.get('/perfil', perfil)
router.get('/perfil/editar', editarPerfilForm)
router.get('/perfil/crear', publicarForm)

router.post('/perfil/editar', editarPerfil)
router.post('/publicar/post', publicarPost)
router.post('/publicar/reel', publicarReel)

router.post('/like/:postId', toggleLike)

router.get('/', home)

module.exports = router