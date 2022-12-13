const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    article_name: {
        type: String
    },
    original_name: {
        type: String
    },
    journal:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    },
    date_of_submission: {
        type: Date,
        default: Date.now()
    }, 
    abstract: {
        type: String
    },
    authors: [{
        name: String,
        email: String,
        phone: String,
        institute: String,
        country: String
    }],
    submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewed_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },   
    peer_choice: [{
        name: String,
        email: String,
        phone: String,
        institute: String,
        country: String
    }],
    status: {
        type: String //Rejected,Under Peer review,Withdrawn,Peer Accepted
    },
    article_type: {
        type: String //Innovation,Research
    },
    date_of_review: {
        type: Date
    },
    date_of_withdrawal: {
        type: Date
    },
    path: {
        type: String
    },
    size: {
        type: Number
    },
    downloads: {
        type: Number,
        default: 0
    },
    peer_review_1: {
        path:{
            type: String,
            default:''
        },
        status: {
            type: String,
            default:''
        }
    },
    peer_review_2: {
        path:{
            type: String,
            default:''
        },
        status: {
            type: String,
            default:''
        }
    },
    peer_review_3: {
        path:{
            type: String,
            default:''
        },
        status: {
            type: String,
            default:''
        }
    },
    peer_review_4: {
        path:{
            type: String,
            default:''
        },
        status: {
            type: String,
            default:''
        }
    },
    peer_review_score: {
        type: Number,
        default: 0
    }
});

const Article = new mongoose.model("Article",articleSchema);

module.exports = {Article};