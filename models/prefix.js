const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
    prefix: {
        type: String
    },
    GuildID: String
});

const MessageModel = module.exports = mongoose.model('prefixes', PrefixSchema);