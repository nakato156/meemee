const { Router } = require("express")
const router = Router()

router.get('/', (req, res) => {
    res.send("Funcionaaaaa")
    // res.render('index', {titulo: "MeeMee"})
})

module.exports = router