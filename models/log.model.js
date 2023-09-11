const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    logs: {
        type: String,
    },
    userId :{
        type:String
    }
}, { timestamps: true })

const Logs = mongoose.model("Logs", logSchema);

module.exports = Logs