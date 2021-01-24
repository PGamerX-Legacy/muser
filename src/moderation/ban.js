const Discord = require("discord.js")
module.exports = {
    name: 'ban',
    description: "Ban a member",
   async execute(msg, args){

         if (!msg.member.hasPermission("BAN_MEMBERS"))
      return msg.reply("*_Sorry, you don't have permissions to use this!_*");

    let member = msg.mentions.members.first();
    if (!member)
      return msg.reply("__Please mention a valid member of this server__");
    if (!member.bannable)
      return msg.reply(
        "**I cannot ban this user! Do they have a higher role? Do I have ban permissions?**"
      );
          if(msg.author.id == member.user.id) return msg.reply("Boomer, You wanna ban yourself?")

if (msg.member.roles.highest.position <= member.roles.highest.position) return msg.reply(`Person has a higher or same role as you so... Later Boomer`)
    let reason2 = args.slice(2).join(" ");
        if(!reason2)return msg.reply("NEED A REASON BOOOOOOOMER")

     await member
     .ban({reason: reason2})
     .catch(error =>
        msg.reply(`Sorry ${msg.author} I couldn't ban because of : ${error}`)
      );
    msg.channel.send(
      `**${member.user.tag} has been banned by ${msg.author.tag} because: ${reason2}**`
    );
     
     
   }}