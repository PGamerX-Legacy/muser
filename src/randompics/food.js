const Discord = require("discord.js")
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const request = require("node-superfetch");

module.exports = {
    name: 'food',
    description: "food pic",
   async execute(msg, args){
    try {
      const { text } = await request.get("https://thissnackdoesnotexist.com/");
      const $ = cheerio.load(text);
      const img = $('div[class="Absolute-Center"]')
        .first()
        .attr("style")
        .match(/background-image:url\((.+)\);/i);
      const name = $('h1[class="snack-description"]')
        .first()
        .text();
      return msg.channel.send(
        name,
        img ? { files: [{ attachment: img[1], name: "ai-food.jpg" }] } : {}
      );
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    } 
}}