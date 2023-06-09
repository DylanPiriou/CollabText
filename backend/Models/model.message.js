const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: String,
    userId: String,
    username: String,
    message: String
})

module.exports = mongoose.model("Message", messageSchema);