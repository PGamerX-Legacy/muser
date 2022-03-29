// noinspection JSCheckFunctionSignatures

const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const userinfo = require("../models/user.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to a specific point in the video")
    .addStringOption((option) =>
      option
        .setName("timestamp")
        .setDescription("Please Provide timestamp you want to skip to")
        .setRequired(true)
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

      const args = interaction.options.getString("timestamp");
      console.log(args);
      if (!interaction.member.voice.channel) {
        await interaction.reply({ content: "You are not in a voice channel!" });
        return;
      }
      const queue = distube.getQueue(interaction);
      if (!queue) {
        await interaction.reply(`No song is playing! `);
      }
      console.log(args.split(":"));
      console.log(args);
      if (args.split(":").length !== 2)
        return await interaction.reply(
          `Correct usage is /seek Time . For eg - /seek 1:20`
        );
      if (args.split(":").some((x) => isNaN(x)))
        return await interaction.reply(
          `Correct usage is /seek Time . For eg - /seek 1:20`
        );
      const time = args
        .split(":")
        .reduce(
          (acc, element, index) => acc + (index === 0 ? element * 60 : element)
        );
      if (!time)
        return await interaction.reply(
          `You did not provide time! Correct usage is /seek Time . For eg - /seek 1:20`
        );
      const finaltime = parseInt(time);

      let notmore = await queue.songs[0];
      console.log(await queue.songs[0].formattedDuration);
      let bruh = notmore.formattedDuration;
      let bruhh = bruh
        .split(":")
        .reduce(
          (acc, element, index) => acc + (index === 0 ? element * 60 : element)
        );
      let yesboi = parseInt(bruhh);
      if (finaltime > yesboi)
        return await interaction.reply(
          `You tried to seek to a duration that does not even exist.`
        );
      await interaction.reply(`Seeking to ${args}...`);
      await distube.seek(queue, finaltime);
    }
  },
};
