const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    journal_name: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    editors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    created_on: {
        type: Date,
        default: Date.now()
    },
    synopsis: {
        type: String
    },
    // topics_covered: [{
    //     type: String
    // }],
    image: {
        type: String
    }
});

const Journal = mongoose.model("Journal",journalSchema);

module.exports = {Journal};