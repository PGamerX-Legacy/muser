const Discord = require("discord.js")
const fetch = require("node-fetch");
const request = require("node-superfetch");

module.exports = {
    name: 'horse',
    description: "random horse pic",
   async execute(msg, args){
const { body } = await request.get("https://thishorsedoesnotexist.com/");
    return msg.channel.send("AI-Generated Horse", {
      files: [{ attachment: body, name: "ai-horse.jpg" }]
    });
      }}