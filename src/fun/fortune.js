const Discord = require("discord.js")
const fetch = require("node-fetch");
const request = require("node-superfetch");

module.exports = {
    name: 'fortune',
    description: "Fortune Cookie!",
   async execute(msg, args){
   
     try {
      const res = await fetch("http://yerkee.com/api/fortune");
      const json = await res.json();
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Fortune Cookie")
        .setDescription(json.fortune);
      return msg.channel.send(embed);
    } catch (e) {
      msg.reply("Could not obtain fortune cookie :confused: ");
      return console.error(e);
    }
     
   
   }}