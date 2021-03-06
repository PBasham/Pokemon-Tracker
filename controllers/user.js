/*========================================
        Import Dependencies
========================================*/
const express = require("express")
const User = require("../models/user.js")
const bcrypt = require("bcryptjs")

/*========================================
        Create Route
========================================*/
const router = express.Router()

/*========================================
        Routes
========================================*/
// signup method="GET" route - "/signup"
router.get("/signup", (req, res) => {
    res.render("user/signup")
})
// signup method="POST" route - "/signup" async
router.post("/signup", async (req, res) => {
    // Encrypt password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    // create user in database
    User.create(req.body)
        .then((userInfo) => {
            res.redirect("/user/login")
        })
        .catch((error) => {
            // send error as json
            console.log(error)
            res.json({ error })
        })
})

// login method="GET" route - "/login" async
router.get("/login", async (req, res) => {
    res.render("user/login")
})
// login method="POST" route - "/login" async
router.post("/login", async (req, res) => {
    // get page data from req body
    const { username, password } = req.body
    // check the database to see if the user exist and if the password matches
    User.findOne({ username })
        .then(async (user) => {
            // check if user exist
            if (user) {
                // compare password to one in database
                const result = await bcrypt.compare(password, user.password)
                if (result) {
                    // store properties for user in session object
                    req.session.username = username
                    req.session.loggedIn = true

                    res.redirect("/pokemon")
                } else {
                    // send error if password doesn't match
                    res.json({ error: "password doesn't match" })
                }
            } else {
                // send error if user doesn't exist
                res.json({ error: "user doesn't esist" })
            }
        })
        .catch((error) => {
            // send error as json
            console.log(error);
            res.json({ error });
        })
})

// logout method="GET" route - "/logout"
router.get("/logout", (req, res) => {
    // destroy session and redirect to main page
    req.session.destroy((err) => {
        res.redirect("/");
    });
});
/*========================================
        Export Router
========================================*/
module.exports = router