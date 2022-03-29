// noinspection JSUnresolvedFunction

require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
const logdna = require("@logdna/logger");
let logdnakey = process.env.LOGDNAKEY;
const options = { app: "muser", level: "debug" };
const logger = logdna.createLogger(logdnakey, options);
logger.log("Hello world! I am the play command", "info");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play any song/playlist using song name/url (Any website)")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Please Provide song's name/url")
        .setRequired(true)
    ),
  async execute(interaction) {
    const distube = interaction.client.distube;
    console.log("Playing in " + " " + interaction.guild.id);
    ////logger.info("Playing in " + " " + interaction.guild.id)

    let input = interaction.options.getString("song");

    if (!interaction.member.voice.channel) {
      await interaction.reply({ content: "You are not in a voice channel!" });
      return;
    }
    const vc = interaction.member.voice.channel;
    await interaction.reply("🔎 Finding the song");
    await distube.playVoiceChannel(vc, input, {
      textChannel: interaction.channel,
    });
  },
};
