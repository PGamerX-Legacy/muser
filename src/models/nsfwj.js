const mongoose = require('mongoose');

const setup = new mongoose.Schema({
    types:{
        type: Array
    },
    probability:{
        type: Number
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('NSFW setting', setup);