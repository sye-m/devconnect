const mongoose = require('mongoose');
const { Schema } = mongoose;
let User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = User = mongoose.model('user', User);