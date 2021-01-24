const mongoose = require('mongoose');

const info = new mongoose.Schema({
    messages: {
        type: String
    },
    server:{
        type: String
    },
    mod:{
        type: String
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('Logging', info);