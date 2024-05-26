const { Router } = require("express")
const router = Router()

const { checkSession } = require('../middlewares/users')
const { home, perfil, editarPerfil, editarPerfilForm, publicarForm, publicarPost, publicarReel } = require('../controllers/user_ctrl')
const { indexPosts, toggleLike, reels, suggestReel, suggestPost } = require('../controllers/post_ctrl')

router.use(checkSession)

router.get('/', home)
router.get('/posts', indexPosts)
router.get('/posts/suggest', suggestPost)
router.get('/reels', reels)
router.get('/reels/suggest', suggestReel)

router.get('/perfil', perfil)
router.get('/perfil/editar', editarPerfilForm)
router.get('/perfil/crear', publicarForm)

router.post('/perfil/editar', editarPerfil)
router.post('/publicar/post', publicarPost)
router.post('/publicar/reel', publicarReel)

router.post('/like/:postId', toggleLike)


module.exports = router