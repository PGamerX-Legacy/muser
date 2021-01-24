const mongoose = require('mongoose');

const userinfo = new mongoose.Schema({
    prefix: {
        type: String
    },
    voter:{
        type: String
    },
    premium:{
        type: String
    },
    UserID: String
});

const MessageModel = module.exports = mongoose.model('users', userinfo);