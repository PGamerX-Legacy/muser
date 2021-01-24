const Discord = require("discord.js")
const google = require('google')
const embed = require('discord.js')
module.exports = {
    name: 'google',
    description: "google search",
   async execute(msg, args){

     
     try{
    let suffix = args.slice(1).join(' ');
       console.log(suffix)
    if (!suffix) {
        msg.channel.send({
            embed: {
                color: 0xff2727,
                description: `:warning: **${msg.author.username}**, You didn't give me anything to search. {[prefix]google \`input\`}`,
                footer: {
                    text: 'API Lantancy is ' + `${Date.now() - msg.createdTimestamp}` + ' ms',
                }
            }
        });
    }
    google.resultsPerPage = 25;
    google(suffix, function (err, res) {
        if (err) msg.channel.send({
            embed: {
                color: 0xff2727,
                description: `:warning: **${msg.author.username}**, ${err}`,
                footer: {
                    text: 'API Lantancy is ' + `${Date.now() - msg.createdTimestamp}` + ' ms',
                }
            }
        });
        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            if (!link.href) {
                res.next;
            } else {
                let embed = new Discord.MessageEmbed()
                    .setColor(`#ffffff`)
                    .setAuthor(`Result for "${suffix}"`, `https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png`)
                    .setDescription(`**Link**: [${link.title}](${link.href})\n**Description**:\n${link.description}`)
                    .setTimestamp()
                    .setFooter('API Lantancy is ' + `${Date.now() - msg.createdTimestamp}` + ' ms', msg.author.displayAvatarURL);
                return msg.channel.send({
                    embed: embed
                  
                });
            }
        }})
     }catch(err){
       console.log(err)
       msg.channel.send(err)
     }
   }}