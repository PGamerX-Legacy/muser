const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: 'duck',
    description: "duck pic",
   async execute(msg, args){

let msg200 = await msg.channel.send(
      "Fetching a image, please wait a second!"
    );
    fetch("https://random-d.uk/api/v1/random")
      .then(res => res.json())
      .then(json => {
        let embed = new Discord.MessageEmbed()
          .setTitle(`Here is a duck`)
          .setImage(json.url)
          .setFooter(`Quack Quack`);
        msg200.edit(embed);
      });
   }}