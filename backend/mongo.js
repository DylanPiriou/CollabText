const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URI);
        console.log("Base de données connectée")
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;