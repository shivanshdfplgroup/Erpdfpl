const mongoose = require('mongoose');

const IssuesSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    screenName: {
        type: String,
    },
    userId: {
        type: String,
    },
    userName: {
        type: String,
    },
    errorCode: {
        type: String,
    },
    screenShotUrl: {
        type: String,
    },
    isSolved: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

const Issues = mongoose.model("Issues", IssuesSchema);

module.exports = Issues