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
		let ping = Date.now() - interaction.createdTimestamp
		await interaction.reply({content: `🏓Latency is ${ping}ms.`});
		monitor.ping({
			state: 'ok',
			message: `Ping = ${ping}`,
			metrics: {
				duration: `${ping}`,
			}
		});
	},
};