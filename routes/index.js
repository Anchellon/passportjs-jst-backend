var express = require("express");
var router = express.Router();
const passport = require("passport");
const passwordUtils = require("../utils/passwordUtils");
const User = require("../models/plugins/User");

/* ------------POST ROUTES ---------*/
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login-failure",
        successRedirect: "login-success",
    })
);
router.post("/register", async (req, res, next) => {
    // console.log(req);
    console.log(req.body);
    const saltHash = passwordUtils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    let user = await User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        salt: salt,
        hash: hash,
        admin: true,
    });
    res.status(200).send(user);
    // res.redirect("/login");
});

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

module.exports = router;
