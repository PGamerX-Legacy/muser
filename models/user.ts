import mongo from 'mongoose';

const userinfo = new mongo.Schema({
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

module.exports = mongo.model('users_muser', userinfo);