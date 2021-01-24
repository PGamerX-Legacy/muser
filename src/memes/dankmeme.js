

const Discord = require("discord.js")
const dank = new Set();
const randomPuppy = require('random-puppy');

module.exports = {
    name: 'dankmeme',
    description: "r/dankmeme",
   async execute(msg, args){

        
        

        if (dank.has(msg.author.id))
      return msg.reply(
        `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
      );

   
    const subReddits3 = ["dankmeme"]
    const random3 = subReddits3[Math.floor(Math.random() * subReddits3.length)];
    const img = await randomPuppy(random3);

    const embed = new Discord.MessageEmbed()
    .setImage(img)
    .setColor("RANDOM")
    .setTitle(`From /r/${random3}`)
    .setURL(`http://reddit.com/${random3}`)

    msg.channel.send(embed);
msg.channel.send("**If you don't get a meme try command again in 3 seconds because our API has been malfunctioning now-a-days**")
    
  
        dank.add(msg.author.id);
        setTimeout(() => {
          dank.delete(msg.author.id);
        }, 3000);
      ;
    console.log();
     
     
        }
}