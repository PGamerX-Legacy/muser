const { SlashCommandBuilder } = require("@discordjs/builders");
const userinfo = require("../models/user.js");
const db = require("quick.db");
async function isVoter(user_id) {
  if (user_id) {
    const userdetail = await userinfo.findOne({
      UserID: user_id,
    });
    if (!userdetail) {
      return false;
    } else if (userdetail) {
      return true;
    }
  }
}
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
    const VOTER = await isVoter(user_id);
    if (!VOTER) {
      return await interaction.reply(
        `Filter command is only available for those who have voted for me (voting is free) or for those who have purchased the premium version. You can vote for me: <https://u.pgamerx.com/vote/muser>`
      );
    }
    let distube;
    const is_premium = await db.get(`PREMIUM_${interaction.guild.id}`);
    if (is_premium == "yes") {
      distube = interaction.client.premium_distube;
    } else {
      distube = interaction.client.distube;
    }
    let input = interaction.options.getString("filter");
    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply(`No song is playing!`);
    }
    if (input == "disable") {
      await interaction.reply(`🎵 Disabled all the filters from the queue`);
      await distube.setFilter(queue, false);
      return;
    }
    await interaction.reply(
      `🎵 Applying ${input} filter on the current queue `
    );
    await distube.setFilter(queue, input);
  },
};
