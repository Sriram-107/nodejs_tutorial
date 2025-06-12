const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 1002
        },
        Adming: Number,
        Editor: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

module.exports = new mongoose.model("User", userSchema);