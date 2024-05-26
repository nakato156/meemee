require("dotenv").config()

const express = require("express")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const path = require('path');
const app = express()

const port = process.env.PORT || 3000;

app.use(cors());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/app', '/views'))

const conditionalMiddleware = require('./app/middlewares/global')

app.use(conditionalMiddleware);
app.use(express.static(path.join(__dirname, '/app', '/public')))
app.use(cookieParser());
app.use(session({secret: process.env.SECRET_SESSION, resave: true, saveUninitialized: true}))

require('./app/models/db')

const auth_route = require('./app/routes/auth')
const user_route = require('./app/routes/user')

app.use(auth_route)
app.use(user_route)

app.listen(port, () => {
    console.log(`Server is running holas port ${port}`)
})