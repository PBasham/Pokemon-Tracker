/*========================================
        Import Dependencies
========================================*/
require("dotenv").config()
const express = require("express")
const methodOverride = require("method-override")
const path = require("path")
const morgan = require("morgan")
const PokemonRouter = require("./controllers/pokemon.js")
const TeamRouter = require("./controllers/team.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
/*========================================
        Create Express application Object / Bind Liquid Templating Engine        
========================================*/
const app = require("liquid-express-views")(express())
// const app = require("liquid-express-views")(express(), {root: [path.resolve(__dirname, "views/")]})
/*========================================
        Middleware
========================================*/
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"))
// will app.use sesison here eventually
/*========================================
        Routes
========================================*/
app.use("/pokemon", PokemonRouter)
app.use("/team", TeamRouter)
app.get("/", (req, res) => {
    res.send("You've reached the '/' route")
})
/*========================================
        Server Listener
========================================*/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})