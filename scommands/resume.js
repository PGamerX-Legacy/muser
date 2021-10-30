const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current playing song')
                    ,
	async execute(interaction) {
        let distube;
        const is_premium = await db.get(`PREMIUM_${interaction.guild.id}`)
        if(is_premium == "yes"){
            distube = interaction.client.premium_distube
        }else{
            distube = interaction.client.distube
        }    
        if(!interaction.member.voice.channel) {await interaction.reply({content: "You are not in a voice channel!"})
    return}
   const queue = distube.getQueue(interaction)
   if(!queue) return await interaction.reply(`No song is playing!`)
   await interaction.reply(`⏩ Resuming the song`)
   await distube.resume(queue)
	},
};