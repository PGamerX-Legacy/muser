

const Discord = require("discord.js")
const recentcmd2 = new Set();
const randomPuppy = require('random-puppy');

module.exports = {
    name: 'cat',
    description: "Random Cat Pic",
   async execute(msg, args){
    if (recentcmd2.has(msg.author.id))
      return msg.reply(
        `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
      );

    
       
    const subReddits = ["cat"]
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    const img = await randomPuppy(random);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setColor("RANDOM")
    .setTitle(`Random Cat Pic`)
    .setURL(`http://reddit.com/${random}`)

    msg.channel.send(embed);
msg.channel.send("If you don't get a pic try command again in 3 seconds because our API has been malfunctioning now-a-days")


      
        recentcmd2.add(msg.author.id);
        setTimeout(() => {
          recentcmd2.delete(msg.author.id);
        }, 3000);
      ;
    console.log();    }
}