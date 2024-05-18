const express = require("express")
const path = require('path');
const app = express()

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname,'/app', '/views'))

app.use(express.static(path.join(__dirname, '/app', '/public')))

const route = require('./app/routes/public')

app.use(route)

app.listen(port, () => {
    console.log(`Server is running holas port ${port}`)
})