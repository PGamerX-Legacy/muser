const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'insult',
    description: "random insult",
   async execute(msg, args){
   fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
      .then(res => res.json())
      .then(json => {
        const embed = new Discord.MessageEmbed()
          .setColor("#E41032")
          .setTitle("Evil Insult")
          .setDescription(json.insult)
          .setURL("https://evilinsult.com");
        return msg.channel.send(embed);
      })
      .catch(err => {
        msg.reply("Failed to deliver insult :sob:");
        return console.error(err);
      });
     
   }}