// noinspection DuplicatedCode

const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song"),
  async execute(interaction) {
    const distube = interaction.client.distube;

    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }
    const queue = distube.getQueue(interaction);
    await interaction.reply(`⏩ Skipping the song`);
    await distube.skip(queue);
  },
};
