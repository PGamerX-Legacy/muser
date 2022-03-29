const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the volume.")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("Please Provide volume you want to set")
        .setRequired(true)
    ),
  async execute(interaction) {
    const distube = interaction.client.distube;

    const volume = interaction.options.getInteger("volume");
    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply(`No song is playing! `);
    }
    if (volume > 0 && volume < 101) {
      await interaction.reply(`Setting volume to ${volume}%`);
      await distube.setVolume(queue, volume);
    } else {
      await interaction.reply(`Volume has to be between 1 and 100`);
    }
  },
};
