const Discord = require("discord.js")


module.exports = {
    name: 'howgay',
    description: "gay-o-meter",
   async execute(msg, args){

     
         if (!args[1]) return msg.reply("Mention Someone or tell a name smh");

    let person = msg.mentions.users.first() || args.slice(1).join(" ");

    if (!person) msg.reply("Mention Someone or tell a name smh");

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


    const youg2 = new Discord.MessageEmbed()
      .setTitle("Gay-o-Meter")
      .setColor("RANDOM")
      .setThumbnail(
        `https://cdn.glitch.com/38b33121-f779-43cc-a95d-c99a7cf7a9d4%2FLGBT_Rainbow_Flag.png?v=1594052534262`
      )
      .setDescription(
        `${person} is ${
          randomgg[Math.floor(Math.random() * randomgg.length)]
        } % gay`
      )
      .setFooter(`This is gay`);
    msg.channel.send(youg2);
   
   }}