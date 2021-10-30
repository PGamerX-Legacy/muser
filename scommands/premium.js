const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js")
const db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('premium')
		.setDescription('Activate premium membership for a server')
        .addStringOption(option =>
            option.setName('server_id')
                .setDescription("Server ID to enable premium in...")
                .setRequired(true))
        ,
	async execute(interaction) {
    const guild_id = interaction.options.getString('server_id');
    const is_pre = await db.get(`PREMIUM_${guild_id}`)
    if(interaction.user.id !== "587663056046391302" || interaction.user.id !== 587663056046391302){
        return await interaction.reply({content: "You don't have permission to run this command, You first need to purchase premium on https://muser.pgamerx.com/premium", ephemeral: true})
    }
    if(is_pre !== "yes"){
    await db.set(`PREMIUM_${guild_id}`, "yes")
    await interaction.reply({content: `The server with ${guild_id} has been now marked as a premium server..`})
    }else{
        await interaction.reply({content: `The guild with ID ${guild_id} is already a premium guild...`})
    }
},
};