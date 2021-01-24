const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: 'unban',
    description: "unbans a member",
   async execute(msg, args){
    if (!msg.member.hasPermission("BAN_MEMBERS")) {
      return msg.channel.send(
        `**${msg.author.username}**, You do not have perms to unban someone`
      );
    }

    if (!msg.guild.me.hasPermission("BAN_MEMBERS")) {
      return msg.channel.send(
        `**${msg.author.username}**, I do not have perms to unban someone`
      );
    }

    let userID = args[1];
    let reason = args.slice(2).join(" ");
           if(!reason)return msg.reply(`Reason ???`)

let PREFIX = db.get(`PREFIX_${msg.guild.id}`);

    if (!userID) return msg.reply("Mention a user id ");

    msg.guild.fetchBans().then(bans => {
      if (bans.size == 0)
        return msg.reply("Bruh noone in this server is banned");
      let bUser = bans.find(b => b.user.id == userID);
      if (!bUser) return msg.reply("User not banned lol");
      // if (!client.users.cache.has(args[1])) return msg.reply("Couldn't find user")

      try {
        msg.guild.members.unban(bUser.user);
      } catch (err) {
        msg.reply("Unknown ban");
      }
      let bruhgggg = msg.author;
      
      const unban = new Discord.MessageEmbed()
        .setDescription("Member Unbanned")
        .addField(`Member id : ${userID}`, `By: ${bruhgggg}`)
        .addField(`Reason`, `${reason}`)
        .setFooter(`Sad | ${PREFIX}help`);
      msg.channel.send(unban);
    });
    console.log();
     
   }}