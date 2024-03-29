// noinspection DuplicatedCode

const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const userinfo = require("../models/user.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Toggles autoplay feature in Muser"),
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
        .addFields(
          {
            name: "Vote for the bot!",
            value:
              "[Vote for Muser on top.gg](https://top.gg/bot/763418289689985035/vote) ",
          },
          {
            name: "Don't want to vote? Get premium for just $2.99!",
            value:
              "[Get premium for $2.99/M](https://muser.pgamerx.com/premium)",
          }
        );

      return interaction.reply({
        embeds: [embed],
      });
    } else if (data.voter == true) {
      const distube = interaction.client.distube;

      if (!interaction.member.voice.channel) {
        await interaction.reply({ content: "You are not in a voice channel!" });
        return;
      }

      const mode = distube.toggleAutoplay(interaction);
      await interaction.reply(
        "Setting autoplay mode to `" + (mode ? "On" : "Off") + "`"
      );
    }
  },
};
