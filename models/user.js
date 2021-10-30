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
    createdAt: { type: Date, expires: "1w", default: Date.now  },
    UserID: String
});

const MessageModel = module.exports = mongoose.model('users_muser', userinfo);