const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Starts a giveaway",

    async run (client, msg, args) {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send('You are not allowed to start giveaways');

        let channel = msg.mentions.channels.first();

        if (!channel) return msg.channel.send(`Correct usage is [prefix]start #channel Time winners prize`);

        let giveawayDuration = args[2];

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) return msg.channel.send(`Correct usage is [prefix]start #channel Time winners prize`)

        let giveawayWinners = args[3];

        if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) return msg.channel.send(`Correct usage is [prefix]start #channel Time winners prize`)
        let giveawayPrize = args.slice(4).join(" ");

        if (!giveawayPrize) return msg.channel.send(`Correct usage is [prefix]start #channel Time winners prize`);

        client.giveawaysManager.start(channel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinners,
            hostedBy: msg.author,

            messages: {
                giveaway: "GIVEAWAY",
                giveawayEned: "GIVEAWAY ENDED",
                timeRemaining: "Time remaining: **{duration}**",
                inviteToParticipate: "React with 🎉 to enter",
                winMessage: "Congrats {winners}, you won **{prize}**",
                embedFooter: "Giveaway time!",
                noWinner: "Couldn't determine a winner",
                hostedBy: "Hosted by {user}",
                winners: "winner(s)",
                endedAt: "Ends at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        })

        msg.channel.send(`Giveaway starting in ${channel}`);
    }
}