

const Discord = require("discord.js")
const pew = new Set();
const randomPuppy = require('random-puppy');

module.exports = {
    name: 'pewdiepie',
    description: "Pewdiepie Subbredit ",
   async execute(msg, args){
     
             if (pew.has(msg.author.id))
      return msg.reply(
        `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
      );

    
    
 //  msg.reply("Command temporarily disabled ")
   
    const subReddits23 = ["PewdiepieSubmissions"]
    const random23 = subReddits23[Math.floor(Math.random() * subReddits23.length)];
    const img = await randomPuppy(random23);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setColor("RANDOM")
    .setTitle(`From /r/${random23}`)
    .setURL(`http://reddit.com/${random23}`)

    msg.channel.send(embed);
msg.channel.send("**If you don't get a meme try command again in 3 seconds because our API has been malfunctioning now-a-days**")
  
        pew.add(msg.author.id);
        setTimeout(() => {
          pew.delete(msg.author.id);
        }, 3000);
      ;
    console.log();
  
     
     
        }
}