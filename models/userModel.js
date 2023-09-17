const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("users", userModel);
