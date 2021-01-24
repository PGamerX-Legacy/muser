const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'unlock',
    description: "lunlocks a channel",
   async execute(msg, args){

 let channel = msg.channel;
    if (!msg.member.hasPermission("MANAGE_CHANNELS"))
      return msg.reply("You need `Manage Channels` perms to use this");
    try {
      channel.updateOverwrite(channel.guild.roles.everyone, {
        SEND_MESSAGES: true
      });
      msg.channel.send("**Channel succesfully unlocked**");
    } catch (err) {
      console.log(err);
      msg.reply("Some unexpected error occured. Do I have the permissions?");
    }
     
   }}