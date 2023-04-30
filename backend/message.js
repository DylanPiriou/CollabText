const { Schema, model } = require("mongoose");

const Message = new Schema({
    room: String,
    userId: String,
    username: String,
    message: String,
    timestamp: Date
})

module.exports = model("Message", Message);