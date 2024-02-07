const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    salt: String,
    admin: Boolean,
});
module.exports = mongoose.model("User", UserSchema);
