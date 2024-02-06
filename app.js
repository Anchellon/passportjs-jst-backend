var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var passport = require("passport");
const session = require("express-session");
var crypto = require("crypto");
let cors = require("cors");
// Connecting to mongoose
const connection = require("./config/connection");

const MongoStore = require("connect-mongo")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: "sessions",
});

app.use(
    session({
        secret: "some secret",
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
        },
    })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

/**
 * -------------- other ----------------
 */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
});
/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);

module.exports = app;
