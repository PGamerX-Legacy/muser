const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("quick.db")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with current ping of the bot'),
	async execute(interaction) {
		await interaction.reply({content: `🏓Latency is ${Date.now() - interaction.createdTimestamp}ms.`});
	},
};