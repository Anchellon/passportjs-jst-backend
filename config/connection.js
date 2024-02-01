const mongoose = require("mongoose");

const connString = "mongodb://localhost:27017";
mongoose.connect(connString);
const connection = mongoose.connection;
module.exports = connection;
