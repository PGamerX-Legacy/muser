const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Apply loop on the current queue/song")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Please provide the type of loop.")
        .setRequired(true)
        .addChoice("song", "song")
        .addChoice("queue", "queue")
        .addChoice("off", "off")
    ),
  async execute(interaction) {
    const distube = interaction.client.distube;

    let input = interaction.options.getString("type");
    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }

    let mode;
    if (input === "song") {
      mode = 1;
    } else if (input === "queue") {
      mode = 2;
    } else if (input === "off") {
      mode = 0;
    }
    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply(`No song is playing!`);
      return;
    }
    await interaction.reply(`🔁 Setting loop mode to ${input}..`);
    await distube.setRepeatMode(queue, parseInt(mode));
  },
};
