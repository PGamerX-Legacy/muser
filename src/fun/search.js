const querystring = require('querystring');
const fetch = require('node-fetch');
const Discord = require('discord.js')

module.exports = {
    name: "search",
   async execute(message, args){
        if (!args[1]) {
            return message.channel.send('You need to supply a search term! e.g. `&search Hello World`');
          }
     
          const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
            const query = querystring.stringify({ term: args.splice(1).join(' ') });
          const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json())
          .catch(error => {message.channel.send('**An error accourd, please try again in 3 Seconds!**')}  )
          const [answer] = list;
          if (!list.length) {
            return message.channel.send(`No results found for **${args.join(' ')}**.`);
        }
        const embedsurban = new Discord.MessageEmbed()
        .setColor('#EFFF00')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
            { name: 'Definition', value: trim(answer.definition, 1024) },
            { name: 'Example', value: trim(answer.example, 1024) },
            { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` }
        );
   message.channel.send(embedsurban) 
  
  }
}