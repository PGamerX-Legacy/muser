const Discord = require("discord.js")
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const request = require("node-superfetch");

module.exports = {
    name: 'vase',
    description: "vase pic",
   async execute(msg, args){
   const num = Math.floor(Math.random() * 20000) + 1;
    const padded = num.toString().padStart(7, "0");
    return msg.channel.send(`AI-Generated Vase #${num}`, {
      files: [
        `http://thisvesseldoesnotexist.s3-website-us-west-2.amazonaws.com/public/v2/fakes/${padded}.jpg`
      ]
    });
}}