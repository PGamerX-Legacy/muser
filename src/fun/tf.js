const Discord = require("discord.js")

module.exports = {
    name: 'tf',
    description: "true/false",
   async execute(msg, args){
   
   if (!args[1])
      return msg.channel.send(
        "***I need a question to answer between yes/no , Stoopid***"
      );
    let option = ["**Yes**", "**No**"];
    let Random = Math.floor(Math.random() * option.length);
    msg.channel.send(option[Random]);
     
   
   }}