const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'chuckjoke',
    description: "random chuckjoke",
   async execute(msg, args){

     fetch("https://api.chucknorris.io/jokes/random")
      .then(res => res.json())
      .then(json => {
        const embed = new Discord.MessageEmbed()
          .setColor("#E41032")
          .setTitle("Chuck Norris Fact")
          .setDescription(json.value)
          .setURL("https://api.chucknorris.io");
        return msg.channel.send(embed);
      })
      .catch(err => {
        msg.channel.send("An error occured, Chuck is investigating this!");
        return console.error(err);
      });

   }}