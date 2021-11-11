const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific point in the video')
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription("Please Provide timestamp you want to skip to")
                .setRequired(true))
                    ,
	async execute(interaction) {
        let distube;
        const is_premium = await db.get(`PREMIUM_${interaction.guild.id}`)
        if(is_premium == "yes"){
            distube = interaction.client.premium_distube
        }else{
            distube = interaction.client.distube
        }      
          const args = interaction.options.getString('timestamp');
        console.log(args)
        if(!interaction.member.voice.channel) {
            await interaction.reply({content: "You are not in a voice channel!"})
            return
        }
        const queue =  distube.getQueue(interaction)
        if(!queue){
            await interaction.reply(`No song is playing! `)
        }
        console.log(args.split(":"))
        console.log(args)
        if (args.split(":").length != 2) return await interaction.reply(`Correct usage is /seek Time . For eg - /seek 1:20`)
        if (args.split(":").some(x => isNaN(x))) return await interaction.reply(`Correct usage is /seek Time . For eg - /seek 1:20`)
        const time = args.split(":").reduce((acc, element, index) => acc + (index == 0 ? element * 60 : element))
        if (!time) return await interaction.reply(`You did not provide time ! Correct usage is /seek Time . For eg - /seek 1:20`)
        const finaltime = parseInt(time)

        let notmore = await queue.songs[0]
        console.log(await queue.songs[0].formattedDuration)
        let bruh = notmore.formattedDuration
        let bruhh = bruh.split(":").reduce((acc, element, index) => acc + (index == 0 ? element * 60 : element))
        let yesboi = parseInt(bruhh)
        if (finaltime > yesboi) return await interaction.reply(`You tried to seek to a duration that does not even exist smh`)
        await interaction.reply(`Seeking to ${args}...`)
        await distube.seek(queue, finaltime)

	},
};