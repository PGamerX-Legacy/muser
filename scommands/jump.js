const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a specific song in the queue")
    .addIntegerOption((option) =>
      option
        .setName("song_position")
        .setDescription(
          "Please Provide song position you want to skip to, you can run /queue command to see the queue"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const distube = interaction.client.distube;
    const number = interaction.options.getInteger("song_position");

    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }
    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply(`No song is playing! `);
      return;
    }

    await interaction.reply(`:arrow_right: Jumping to ${number}...`);
    await distube.jump(queue, parseInt(number)).catch(async (err) => {
      await interaction.reply(`Invalid song position`);
      console.log(err);
    });
  },
};
