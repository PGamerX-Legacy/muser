// noinspection DuplicatedCode

const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("The current queue"),
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
    await interaction.reply(
      "Current queue:\n" +
        queue.songs
          .map(
            (song, id) =>
              `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")
    );
  },
};
