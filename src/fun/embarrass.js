const Discord = require("discord.js")

module.exports = {
    name: 'embarrass',
    description: "embarrass someone",
   async execute(msg, args){
  
     let channel = msg.channel;
    let member = msg.mentions.members.first() || msg.member,
      user = member.user;
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`test`)
      .setFooter("ok");

    try {
      //  const webhooks = await channel.fetchWebhooks();
      let webhook = await channel.createWebhook(`${user.username}`, {
        avatar: `${user.displayAvatarURL()}`
      });

      var emb = [
        "I genuinely like the nutshack.",
        "Trollface is my favorite meme. PROBLEM?",
        "I get legitimetly scared when I play five nights at freddys",
        "delet this.",
        "I once deep fried a vibrator.",
        "Sometimes.. I think why am I alive",
        "I could not teach my son how to ride a bike cause I can not ride one myself.",
        "I am a gamer, therefore, I am better than you.",
        "my favorite emote is :joy:",
        "I vomit over my girlfriend while she’s sleeping and clean it all up before she wakes up.",
        "My grandma runs faster than me, and she is 95 with arthritis.",
        "Thanks for the gold kind stranger!",
        "I have a crush on the map from dora the explorer.",
        "I got my parents to buy me a Macbook for gaming"
      ];

      webhook.send(emb[Math.floor(Math.random() * emb.length)], {
        username: `${user.username}`,
        avatarURL: `${user.displayAvatarURL()}`
        //    embeds: [embed],
      });
      setTimeout(() => {
        webhook.delete();
      }, 3000);
    } catch (error) {
      msg.reply("Err ahhh! Do I have the perms to manage weebhooks?");
      console.error("Error trying to send: ", error);
    }
   
   }}