const mongoose = require('mongoose');

const alexa = new mongoose.Schema({
    channel: {
        type: String
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('alexa setting', alexa);