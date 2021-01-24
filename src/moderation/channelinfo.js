const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'channelinfo',
    description: "info of channel",
   async execute(msg, args){


    const channel = msg.channel;

    let nsfw;
    if (channel.nsfw === true) {
      nsfw = `Yes`;
    } else {
      nsfw = `No`;
    }

    const category =
      msg.guild.channels.cache.get(`${channel.parentID}`).name ||
      "No Category!";

    const EmbedText = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Channel Information`)
      .addField(`Channel Name`, channel.name, true)
      .addField(`Channel Type`, `Text`, true)
      .addField(`Channel Nsfw`, nsfw, true)
      .addField(`Channel Category`, category, true)
      .addField(`Channel Position`, channel.position, true)
      .addField(`Channel Created At`, channel.createdAt.toDateString())
      .addField(`Channel Topic`, channel.topic || "No Topic!");

    const EmbedVoice = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Channel Information`)
      .addField(`Channel Name`, channel.name, true)
      .addField(`Channel Type`, `Voice`, true)
      .addField(`Channel Category`, category, true)
      .addField(`Channel Position`, channel.position, true)
      .addField(`Channel Users Limit`, channel.userLimit, true)
      .addField(`Channel Bitrate`, channel.bitrate, true)
      .addField(`Channel Created At`, channel.createdAt.toDateString());

    let checkchannels;
    if (channel.type === "text") {
      checkchannels = EmbedText;
    } else {
      checkchannels = EmbedVoice;
    }

    msg.channel.send(checkchannels);
     
     
   }}