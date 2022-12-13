const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    total_submitted: {
        type: Number,
        default: 0
    },
    total_accepted: {
        type: Number,
        default: 0
    },
    total_peer_accepted: {
        type: Number,
        default: 0
    },
    total_withdrawn: {
        type: Number,
        default: 0
    },
    total_rejected: {
        type: Number,
        default: 0
    },
    userRole: {
        type: String,
        default: "Author"
    },
    expertise: [{
        type: String
    }],
    designation: {
        type: String
    },
    institute: {
        type: String
    },
    country: {
        type: String
    },
    image_path: {
        type: String
    }
});

const User = mongoose.model("User",userSchema);

module.exports = {User};
