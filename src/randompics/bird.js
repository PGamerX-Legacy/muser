const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: 'bird',
    description: "bird pic",
   async execute(msg, args){

     function pickRandom(warray) {
      var randomNumber = Math.floor(Math.random() * warray.length);
      return warray[randomNumber];
    }
    var birds = [
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages%20(1).jpg?v=1594973390465`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages.jpg?v=1594973390591`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fdownload%20(5).jpg?v=1594973391172`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fdownload%20(4).jpg?v=1594973392160`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages%20(4).jpg?v=1594973428871`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages%20(5).jpg?v=1594973429215`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages%20(3).jpg?v=1594973429240`,
      `https://cdn.glitch.com/aa72828e-329b-4d4b-a55d-e8f868d6e1c2%2Fimages%20(2).jpg?v=1594973429818`
    ];
    var randomdoge = pickRandom(birds);
    const birb = new Discord.MessageEmbed()
      .setTitle("Random Bird")
      .setColor("Random")
      .setImage(pickRandom(birds))
      .setFooter("wow");
    msg.channel.send(birb);
     
}}