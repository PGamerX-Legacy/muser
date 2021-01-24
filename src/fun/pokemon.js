const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: 'pokemon',
    description: "pokemon info",
   async execute(msg){
  const { get } = require("request-promise-native");
    const { MessageEmbed } = require("discord.js");
    const args = msg.content.split(" ");

    let pokename = msg.content
      .split(" ")
      .slice(1)
      .join(" ");

    if (!pokename) return msg.reply("Tell a name Boomer");
    const options = {
      url: `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=${pokename}`,
      json: true
    } 
          
          msg.channel.send(`Fetching`).then(msg => {
            get(options)
            }).then(body => {
            let embed = new MessageEmbed()
              .setAuthor(
                body.name,
                `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.typeIcon}`
              )
              .setDescription(body.info.description)
              .setThumbnail(
                `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.photo}`
              )
              .setColor("#ff2050")
              .setFooter(
                `Weakness of pokemon - ${body.info.weakness}`,
                `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.weaknessIcon}`
              );

            if (!body.info.description) return msg.reply("Pokemon Not found");

            msg.channel.send(embed);
            msg.delete();
          }).catch((error) => {
            console.error(error);
            msg.channel.send("Another Error! I suck tbh ```" + err + "```")
          });
   }}