const mongoose = require('mongoose');

const setbye = new mongoose.Schema({
    status: {
        type: String
    },
    channel: {
        type: String
    },
    message: {
        type: String
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('leave setting', setbye);