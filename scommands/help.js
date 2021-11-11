const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides help regarding the bot'),
	async execute(interaction) {
		const embed = new MessageEmbed()
        .setTitle(`Muser - The revolutionary Discord bot`)
        .setColor("RED")
        .setThumbnail("https://muser.pgamerx.com/assets/images/discord-music-removebg-preview.png")
        .setDescription(`A fully functional and dedicated Music bot supporting Youtube, Spotify, Soundcloud, Facebook, Instagram, and 700+ other websites for absolutely free!. The better groovy.`)
        .addField(`**Limited time Merch**`, `Hey ${interaction.user.username}, we are launching a limited time merch collection at cheap rates. Purchase the merch to get da drip and support me in the process! [Click here for More information](https://www.bonfire.com/botmuser/) `)
        .addField(`Commands`,
`
\`/play\` - Plays song/playlist from name/url 
\`/seek\` - Seek to a specific part in the song
\`/pause\` - Pauses the current playing song
\`/autoplay\` - Disables/Enables autoplay mode
\`/resume\` - Resumes the current playing song
\`/volume\` - Set volume for the music
\`/filters\` - Apply filter(s) on songs
\`/shuffle\` - Shuffles the queue
\`/queue\` - Displays the current queue
\`/skip\` - Skips the current song in the playlist
\`/stop\` - Stops playing and deletes the queue
`)
.addField(
    "**Important Links**",
    "**[Invite Me](https://discord.com/oauth2/authorize?client_id=763418289689985035&scope=+applications.commands+bot&permissions=37084480) | " +
    "[Support Server](https://discord.gg/4TeGKpSkdN) | " + "[Upvote on Top.gg](https://top.gg/bot/763418289689985035/vote) | " + "[Premium](https://muser.pgamerx.com/premium) | " + "[Website](https://muser.pgamerx.com/)**")
.setFooter("Developed by PGamerX")
await interaction.reply({embeds: [embed]})
},
};