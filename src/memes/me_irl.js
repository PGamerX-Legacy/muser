

const Discord = require("discord.js")
const me = new Set();
const randomPuppy = require('random-puppy');

module.exports = {
    name: 'me_irl',
    description: "r/me_irl",
   async execute(msg, args){
     
  
        if (me.has(msg.author.id))
      return msg.reply(
        `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
      );

    
    
 //  msg.reply("Command temporarily disabled ")
   
    const subReddits22 = ["me_irl"]
    const random22 = subReddits22[Math.floor(Math.random() * subReddits22.length)];
    const img = await randomPuppy(random22);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setColor("RANDOM")
    .setTitle(`From /r/${random22}`)
    .setURL(`http://reddit.com/${random22}`)

    msg.channel.send(embed);
msg.channel.send("**If you don't get a meme try command again in 3 seconds because our API has been malfunctioning now-a-days**")



    
    //, "me_irl", "dankmeme"
  
        me.add(msg.author.id);
        setTimeout(() => {
          me.delete(msg.author.id);
        }, 3000);
      ;
    console.log();
     
     
        }
}