// noinspection DuplicatedCode

const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the current queue"),
  async execute(interaction) {
    const distube = interaction.client.distube;
    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }
    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply(`No song is playing! `);
    }
    await interaction.reply(`🔀 Shuffling the queue`);
    await distube.shuffle(queue);
  },
};
