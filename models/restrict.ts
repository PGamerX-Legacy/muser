import mongo from 'mongoose';

const restrict = new mongo.Schema({
    channels: {
        type: Array
    },
    commands: {
        type: Array
    },
    GuildID: String
});

module.exports = mongo.model('restrict setting', restrict);