import mongo from 'mongoose';

const PrefixSchema = new mongo.Schema({
    prefix: {
        type: String
    },
    GuildID: String
});

module.exports = mongo.model('prefixes', PrefixSchema);