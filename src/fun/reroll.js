const ms = require('ms');

module.exports = {
    name: "reroll",
    description: "Rerolls giveaway",

    async run (client, msg, args){

        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send('You do not have permission to rerol giveaways');

        if(!args[1]) return msg.channel.send('No giveaway ID provided');

        let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" ")) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if(!giveaway) return msg.channel.send('Couldn\'t find a giveaway with that ID/name');

        client.giveawaysManager.reroll(giveaway.messageID)
        .then(() => {
            msg.channel.send('Giveaway rerolled')
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with ID ${giveaway.messageID} is not ended`)){
                msg.channel.send('This giveaway hasn\'t ended yet')
            } else {
                console.error(e);
                msg.channel.send('An error occured')
            }
        })
    }}