const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: 'dog',
    description: "dog pic",
   async execute(msg, args){

let msg200 = await msg.channel.send(
      "Fetching a image, please wait a second!"
    );
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(res => res.json())
      .then(json => {
        let embed = new Discord.MessageEmbed()
          .setTitle(`Here is a dog`)
          .setImage(json.message)
          .setFooter(`Awwww`);
        msg200.edit(embed);
      })}}