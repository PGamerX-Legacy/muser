const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggles autoplay feature in Muser')
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

const mode = distube.toggleAutoplay(interaction)
await interaction.reply("Setting autoplay mode to `" + (mode ? "On" : "Off") + "`")

	},
};