const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../utils/passwordUtils");

router.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        console.log("hi");
        res.status(200).send({
            success: true,
            user: req.user,
            msg: "You are successfully authenticated to this route!",
        });
    }
);

// Validate an existing user and issue a JWT
router.post("/login", function (req, res, next) {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ success: false, msg: "could not find user" });
            }

            // Function defined at bottom of app.js
            const isValid = utils.validPassword(
                req.body.password,
                user.hash,
                user.salt
            );

            if (isValid) {
                const tokenObject = utils.issueJWT(user);

                res.status(200).json({
                    success: true,
                    token: tokenObject.token,
                    expiresIn: tokenObject.expires,
                });
            } else {
                res.status(401).json({
                    success: false,
                    msg: "you entered the wrong password",
                });
            }
        })
        .catch((err) => {
            next(err);
        });
});

// Register a new user
router.post("/register", function (req, res, next) {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        email: req.body.email,

        hash: hash,
        salt: salt,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        admin: true,
    });

    try {
        newUser.save().then((user) => {
            res.json({ success: true, user: user });
        });
    } catch (err) {
        res.json({ success: false, msg: err });
    }
});

module.exports = router;
