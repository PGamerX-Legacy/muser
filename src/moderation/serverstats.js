const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'serverstats',
    description: "Stats of server",
   async execute(msg, args){


  
    const embed4 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Server Info")
      .setImage(msg.guild.iconURL)
      .setDescription(`${msg.guild}'s information`)
      .addField("Owner", `The owner of this server is ${msg.guild.owner}`)
      .addField(
        "Member Count",
        `This server has ${msg.guild.memberCount} members`
      )
      .addField(
        "Emoji Count",
        `This server has ${msg.guild.emojis.cache.size} emojis`
      )
      .addField(
        "Roles Count",
        `This server has ${msg.guild.roles.cache.size} roles`
      );
     
     msg.channel.send(embed4)
     
   }}