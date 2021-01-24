const Discord = require("discord.js")

module.exports = {
    name: 'slap',
    description: "slap a person",
   async execute(msg, args){

     let member = msg.mentions.users.first() || args.slice(1).join(" ");
    if (!args[1]) return msg.channel.send("**Who You need to slap boi?**");
    let reason2 = args.slice(2).join(" ");
    msg.reply(`just slapped **${member}**`);
     
   }}