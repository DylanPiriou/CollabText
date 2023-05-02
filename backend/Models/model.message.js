const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: String,
    userId: String,
    username: String,
    message: String
})

 const Msg = mongoose.model("Message", messageSchema);
 module.exports = Msg