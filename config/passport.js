const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./connection");
const User = connection.models.User;
const validPassword = require("../utils/passwordUtils").validPassword;
// The custome fields come up when the req object is being handled in the express middleware(passport)
// and is attached so that it is available to the next middleware

const customFields = {
    usernameField: "email",
    passwordField: "password",
};
// PAssport local wont work if you change the fields "username", "password"
const verifyCallback = (username, password, done) => {
    User.findOne({ email: username })
        .then((user) => {
            if (!user) {
                return done(null, false);
            }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => done(err));
});
