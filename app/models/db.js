const mongoose = require("mongoose")

mongoose.connect("mongodb://mongo/meemeeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( db => console.log(`Connected to MongoDB ${db.connection.host}`))
.catch(err => console.error(err))