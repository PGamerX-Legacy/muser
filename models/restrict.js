const mongoose = require('mongoose');

const restrict = new mongoose.Schema({
    channels: {
        type: Array
    },
    commands: {
        type: Array
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('restrict setting', restrict);