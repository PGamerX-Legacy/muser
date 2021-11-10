const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("quick.db")
require("dotenv").config();
const cronitor = require('cronitor')(process.env.CRONITORID);
const monitor = new cronitor.Monitor('museg');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with current ping of the bot'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: false});
		interaction.editReply({ content: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`, ephemeral: true });
		let ping = sent.createdTimestamp - interaction.createdTimestamp;
		monitor.ping({
			state: 'ok',
			message: `Ping = ${ping}`,
			metrics: {
				duration: `${ping}`,
			}
		});
	},
};