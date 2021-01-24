const Discord = require("discord.js")
const DPREFIX = process.env.DPREFIX;
const prefixModel = require("../models/prefixbro.js")

module.exports = {
    name: 'setpre',
    description: "changes prefix ",
   async execute(msg, args){
       const message = msg
     
    if(!msg.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You don't have permission`)
    const data = await prefixModel.findOne({
      GuildID: message.guild.id
  });

  if (!args[1]) return message.channel.send('You must provide a **new prefix**!');

  if (args[1].length > 5) return message.channel.send('Your new prefix must be under \`5\` characters!')

  if (data) {
      await prefixModel.findOneAndRemove({
          GuildID: message.guild.id
      })
      
      message.channel.send(`The new prefix is now **\`${args[1]}\`**`);

      let newData = new prefixModel({
          prefix: args[1],
          GuildID: message.guild.id
      })
      newData.save();
  } else if (!data) {
      message.channel.send(`The new prefix is now **\`${args[1]}\`**`);

      let newData = new prefixModel({
          prefix: args[1],
          GuildID: message.guild.id
      })
      newData.save()
  }

       
   }}