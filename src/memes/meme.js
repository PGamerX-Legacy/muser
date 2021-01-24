

const Discord = require("discord.js")
const recentcmd = new Set();
const randomPuppy = require('random-puppy');
const fetch = require("node-fetch");

module.exports = {
    name: 'meme',
    description: "r/meme",
   async execute(msg, args){
    if (recentcmd.has(msg.author.id))
      return msg.reply(
        `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
      );

    
    
 //  msg.reply("Command temporarily disabled ")
  
 const response = await fetch('https://meme-api.herokuapp.com/gimme');
        const body = await response.json();

        if (body.nsfw === true) {
            msg.channel.send(`Holy crap!!! Our api accidently gave us a nsfw meme this time. But i saved you! phew Try this command again now it should work`);
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(msg.member.displayHexColor)
            .setImage(body.url)
            .setTitle(body.title)
            .setTimestamp()
            .setFooter(
                `Invoked by ${msg.author.username}`,
                `${msg.author.displayAvatarURL()}`
            );

        msg.channel.send(embed);

    
    //, "me_irl", "dankmeme"
  
        recentcmd.add(msg.author.id);
        setTimeout(() => {
          recentcmd.delete(msg.author.id);
        }, 3000);
      ;
    console.log();    }
}