const Discord = require("discord.js")


module.exports = {
    name: 'howgayme',
    description: "gay-o-meter",
   async execute(msg, args){
var randomgg = [
      `69`,
      `0`,
      `39`,
      `100`,
      `50`,
      `46`,
      `72`,
      `37`,
      `40`,
      `46`,
      `70`,
      `21`,
      `53`,
      `69.69`
    ];

    //let finallolgg = Math.floor(Math.random() * randomgg.length);

    // var check = args.slice(2).join(" ")

    const youg = new Discord.MessageEmbed()
      .setTitle("Gay-o-Meter")
      .setColor("RANDOM")
      .setThumbnail(
        `https://cdn.glitch.com/38b33121-f779-43cc-a95d-c99a7cf7a9d4%2FLGBT_Rainbow_Flag.png?v=1594052534262`
      )
      .setDescription(
        `You are ${randomgg[Math.floor(Math.random() * randomgg.length)]} % gay`
      )
      .setFooter(`That is Gay `);
    msg.channel.send(youg);
     
   
   }}