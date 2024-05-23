const { Router } = require("express")
const router = Router()

const { login, registro, loginForm, registroForm } = require('../controllers/auth_ctrl')

router.get('/login', loginForm)
router.get('/registro', registroForm)

router.post('/registro', registro)
router.post('/login', login)
module.exports = router