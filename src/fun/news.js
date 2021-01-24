const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: 'news',
    description: "tells news",
   async execute(msg, args){
  try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=reuters&pageSize=2&apiKey=87a0130e397a4e45a4fd707eb93c5922`
      );
      const json = await response.json();
      const articleArr = json.articles;
      let processArticle = article => {
        const embed = new Discord.MessageEmbed()
          .setColor("#FF4F00")
          .setTitle(article.title)
          .setURL(article.url)
          .setAuthor(article.author)
          .setDescription(article.description)
          .setThumbnail(article.urlToImage)
          .setTimestamp(article.publishedAt)
          .setFooter("powered by NewsAPI.org");
        return embed;
      };
      async function processArray(array) {
        for (const article of array) {
          const msg69 = await processArticle(article);
          msg.channel.send(msg69);
        }
      }
      await processArray(articleArr);
    } catch (e) {
      msg.reply("Something failed along the way");
      return console.error(e);
    }
   
   }}