const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const userinfo = require("../models/user.js");
const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Apply filter(s) on the current queue")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("Please Provide the filter.")
        .setRequired(true)
        .addChoice("3d", "3d")
        .addChoice("bassboost", "bassboost")
        .addChoice("echo", "echo")
        .addChoice("karaoke", "karaoke")
        .addChoice("nightcore", "nightcore")
        .addChoice("vaporwave", "vaporwave")
        .addChoice("flanger", "flanger")
        .addChoice("gate", "gate")
        .addChoice("haas", "haas")
        .addChoice("reverse", "reverse")
        .addChoice("surround", "surround")
        .addChoice("mcompand", "mcompand")
        .addChoice("phaser", "phaser")
        .addChoice("tremolo", "tremolo")
        .addChoice("earwax", "earwax")
        .addChoice("disable", "disable")
    ),
  async execute(interaction) {
    const user_id = interaction.user.id;

    const data = await userinfo.findOne({ UserID: user_id });
    if (!data) {
      const embed = new MessageEmbed()
        .setTitle("Forbidden")
        .setDescription(
          "You are not allowed to use this command! Only people who have **voted** for the bot within the last week can use this command! (**Voting is free**)"
        )
        .setColor("RED")
        .addFields({
          name: "Vote for the bot!",
          value:
            "[Vote for Muser on top.gg](https://top.gg/bot/763418289689985035/vote) ",
        });

      return interaction.reply({
        embeds: [embed],
      });
    } else if (data.voter == true) {
      const distube = interaction.client.distube;

      let input = interaction.options.getString("filter");
      if (!interaction.member.voice.channel) {
        await interaction.reply({ content: "You are not in a voice channel!" });
        return;
      }

      const queue = distube.getQueue(interaction);
      if (!queue) {
        await interaction.reply(`No song is playing!`);
      }
      if (input === "disable") {
        await interaction.reply(`🎵 Disabled all the filters from the queue`);
        await distube.setFilter(queue, false);
        return;
      }
      await interaction.reply(
        `🎵 Applying ${input} filter on the current queue `
      );
      await distube.setFilter(queue, input);
    }
  },
};
