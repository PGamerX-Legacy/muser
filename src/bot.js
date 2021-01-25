const Discord = require("discord.js");
let mongourl = process.env.MONGOURL
let bot_token = process.env.BOT_TOKEN
const alexa = require('alexa-bot-api')
const setup = require('./models/nsfwj.js')
const paginationEmbed = require('discord.js-pagination');
const ai = new alexa();
const DIG = require('discord-image-generation')
const prompter = require('discordjs-prompter');
const { ReactionCollector, MessageCollector } = require('discord.js-collector')
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');
const mongoose = require("mongoose");
const canvacord = require("canvacord");
const prefix = require('./models/prefixbro.js');
const logingo = require('./models/logging.js');
const userinfo = require('./models/user.js');
const alexainfo = require('./models/alexa.js');
const welcomeinfo = require('./models/welcome.js');
const restrictinfo = require('./models/restrict.js');
const byeinfo = require('./models/bye.js');
mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const client = new Discord.Client({ ws: { intents: 32511 } });
const { parse } = require("twemoji-parser");
const figlet = require("figlet");
const moment = require("moment");
const worldometer = require("worldometer-coronavirus-info");
const weather = require("weather-js");
const recentcovid = new Set();
const recentadv = new Set();
const fetch = require("node-fetch");
const giveMeAJoke = require("discord-jokes");
const DPREFIX = process.env.DPREFIX;
const bot = client;

let blacklisted = []
let beta = ["189759562910400512", "556119013298667520", "587663056046391302", "663231875707568139", "761932885565374474", "707865025007845387","724275771278884906"]
let allowed = []
let allowedchannels = [];

client.once('ready', () => {
  client.api.applications("716985864512864328").commands.post({
    data: {
      name: "hello",
      description: "Replies with Hello World!"
    }
  });
  client.api.applications("716985864512864328").commands.post({
    data: {
      name: "echo",
      description: "Echos your text as an embed!",

      options: [
        {
          name: "content",
          description: "Content of the embed",
          type: 3,
          required: true
        }
      ]
    }
  });

  client.ws.on('INTERACTION_CREATE', async interaction => {
    if(blacklisted.includes(interaction.member.user.id)) return interaction.user.send(`You are Blacklisted from Using The Bot because of Breaking TOS`)
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if (command == 'hello') {
      if(interaction.member.guild.id == "681882711945641997") return
      if(blacklisted.includes(interaction.member.user.id)) return interaction.user.send(`You are Blacklisted from Using The Bot because of Breaking TOS`)


      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Hello World!"
          }
        }
      });
    }

    if (command == "echo") {
      if(interaction.member.guild.id == "681882711945641997") return
      if(blacklisted.includes(interaction.member.user.id)) return interaction.user.send(`You are Blacklisted from Using The Bot because of Breaking TOS`)

      const description = args.find(arg => arg.name.toLowerCase() == "content").value;
      const embed = new Discord.MessageEmbed()
        .setTitle("Echo!")
        .setDescription(description)
        .setAuthor(interaction.member.user.username);

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, embed)
        }
      });
    }
  });

})
async function createAPIMessage(interaction, content) {
  const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
    .resolveData()
    .resolveFiles();

  return { ...apiMessage.data, files: apiMessage.files };
}
function catchErr(err, msg) {
  console.log(err.stack)
  const error = new Discord.MessageEmbed()
    .setTitle(`An Error occured`)
    .setColor("RED")
    .setDescription(`Error is ${err} | Make sure you ran command properly`)
    .addField(`If you ran it correctly`, "[Join Our Server](https://discord.com/invite/vkBnQwhpHM)")
  msg.channel.send(error)
  console.log(err.stack)

}



process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

const cooldowns = new Map()


process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
  });


client.on('guildMemberAdd', async (member) => {
  // mention , usertag , memberCount
  const welcome = await welcomeinfo.findOne({
    GuildID: member.guild.id
  })
  if (!welcome) return
  console.log(welcome)
  if (welcome) {
    if (welcome.status !== "yes") return
    let channel2 = await member.guild.channels.cache.get(welcome.channel)
    let message2 = welcome.message
    let message3 = await message2.replace("{mention}", member);
    let message4 = await message3.replace("{usertag}", `${member.user.username}#${member.user.discriminator}`)
    let finalmsg = await message4.replace("{memberCount}", member.guild.memberCount)

    channel2.send(finalmsg)
  }

})
client.on('guildMemberRemove', async (member) => {
  // mention , usertag , memberCount
  const bye = await byeinfo.findOne({
    GuildID: member.guild.id
  })
  if (!bye) return
  console.log(bye)
  if (bye) {
    if (bye.status !== "yes") return
    let channel2 = await member.guild.channels.cache.get(bye.channel)
    let message2 = bye.message
    let message3 = await message2.replace("{mention}", member);
    let message4 = await message3.replace("{usertag}", `${member.user.username}#${member.user.discriminator}`)
    let finalmsg = await message4.replace("{memberCount}", member.guild.memberCount)

    channel2.send(finalmsg)
  }

})




client.snipes = new Map()
client.on('messageDelete', function (msg, channel) {

  client.snipes.set(msg.channel.id, {
    content: msg.content,
    author: msg.author.tag,
    image: msg.attachments.first() ? msg.attachments.first().proxyURL : null
  })

})

bot.memes = new Discord.Collection();
bot.fun = new Discord.Collection();
bot.gifs = new Discord.Collection();
bot.moderation = new Discord.Collection();
bot.randompics = new Discord.Collection();
bot.others = new Discord.Collection();
const fs = require('fs')
const commandFiles = fs
  .readdirSync("./memes/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const memes = require(`./memes/${file}`);

  bot.memes.set(memes.name, memes);
}

const commandFiles2 = fs
  .readdirSync("./fun/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles2) {
  const fun = require(`./fun/${file}`);

  bot.fun.set(fun.name, fun);
}

const commandFiles3 = fs
  .readdirSync("./gifs/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles3) {
  const gifs = require(`./gifs/${file}`);

  bot.gifs.set(gifs.name, gifs);
}
const commandFiles4 = fs
  .readdirSync("./moderation/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles4) {
  const moderation = require(`./moderation/${file}`);

  bot.moderation.set(moderation.name, moderation);
}

const commandFiles5 = fs
  .readdirSync("./randompics/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles5) {
  const randompics = require(`./randompics/${file}`);

  bot.randompics.set(randompics.name, randompics);
}


bot.on("guildCreate", async guild => {
  try {
    client.users.fetch(guild.owner).then(owner => {
      const helpembed3 = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`Thanks For adding me in ${guild.name}`)
        .addField(
          "Need Support?",
          "[My Support Server](https://pgamerx.com/discord)"
        )
        .addField(
          `Wanna know everything about me?`,
          "[My Website](https://sheep.pgamerx.com)"
        )
        .addField(
          "Wanna know my commands?",
          "[My Command List](https://sheep.pgamerx.com/commands)"
        )

        .addField(
          `Love me <:love:736194392305434704>!`,
          "[Upvote me on top.gg!](https://top.gg/bot/716985864512864328/vote)"
        )
        .addField(
          `Love me a lot ! <:love:736194392305434704><:love:736194392305434704><:love:736194392305434704>!`,
          "[Become A Patreon](https://sheep.pgamerx.com/premium)"
        )

      owner.send(helpembed3);


    })
    bot.channels.cache
      .get("759395218348048414")
      .send(
        "<:love:736194392305434704><:love:736194392305434704>I got added in a new Guild! `" + guild.name + "`" + `This guild is epic! My Guild count ${bot.guilds.cache.size}`
      );
  } catch (err) {
    console.log(err)
  }




});

bot.on("guildDelete", async guild => {
  try {
    bot.channels.cache
      .get("759395218348048414")
      .send(
        `:cry::cry:I got Removed from a Guild - **${guild.name}** - This guild is unepic. My Guild count ${bot.guilds.cache.size}`
      );
  } catch (err) {
    console.log(err)
  }
})
const queue = new Map();
var mcount = bot.users.cache.size;
var scount = bot.guilds.cache.size;
bot.on("debug", console.debug);
bot.on("warn", console.warn);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)



      client.user.setPresence({ activity: { name: `in ${client.guilds.cache.size} servers | s!help` }, status: 'online' })

});
const DBL = require("dblapi.js");
const dbl = new DBL(
  "TOKEN",
  { webhookPort: 5000, webhookAuth: "bruhboomer" },
  bot
);

dbl.on("error", e => {
  console.log(`Oops! ${e}`);
});
dbl.webhook.on("ready", hook => {
  console.log(
    `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
  );
});


dbl.webhook.on("vote", async (vote) => {

  try {

    const userdetail = await userinfo.findOne({
      UserID: vote.user
    })

    if (!userdetail) {
      let newData = new userinfo({
        UserID: vote.user,
        voter: "yes"
      })
      newData.save()
    } else if (userdetail) {
      if (userdetail.premium === "yes") {
        await userinfo.findOneAndRemove({
          UserID: vote.user
        })

        let newData = new userinfo({
          voter: "yes",
          premium: "yes",
          UserID: vote.user
        })
        newData.save();
      } else {
        await userinfo.findOneAndRemove({
          UserID: vote.user
        })
        let newData = new userinfo({
          voter: "yes",
          UserID: vote.user
        })
        newData.save();
      }
    }

    bot.channels.fetch("783581253001150494").then(channel => {

      channel.send(`Thanks to <@${vote.user}> (${vote.user}) for voting me ! It's really appreciated! You all can also vote for me here - <https://bit.ly/sheepvote>`);



    })
    console.log(vote)

    bot.users.fetch(vote.user).then(user => {



      const thanks2 = new Discord.MessageEmbed()
        .setColor("RANDOM")

        .setTitle("Thanks For Voting! :)")
        .setDescription(
          `Thanks for voting <:love:736194392305434704>:. You now get following benifits !`
        )
        .addField(`Access to Filter Commands`, `You can now use music filter commands like bassboost,nightcore,vaporwave,echo`)
        .addField(`Less cooldown `, `Instead of 7 seconds you will only get 4 seconds cooldown on music commands`)
        .addField(`Epic Role`, `You will get an epic role in our discord server`)
        .addField(`My love and wishes`, `I will give you best wishes in everything`)

      try {
        let Tet7 = bot.guilds.cache.get("690557545965813770");

        let upvoter = Tet7.roles.cache.find(role => role.name === "Upvoter!");
        user.send(thanks2)

      } catch (err) {
        console.log(err)
      }


    })
  } catch (err) {
    console.log(err)
  }
})



bot.on("error", console.error);

bot.on("shardDisconnect", (event, id) =>
  console.log(
    `Shard ${id} disconnected (${event.code}) ${event}, trying to reconnect!`
  )
);
bot.on("shardReconnecting", id => console.log(`Shard ${id} reconnecting...`));

nsfwjs.load().then(model => {

bot.on("message", async msg => {
  let channel123 = msg.guild.channels.cache.find(c => c.name === "attachment-logs")
  const message = msg

  let channel = msg.guild.channels.cache.find(c => c.name === "attachment-logs")
  const info = await setup.findOne({
      GuildID: msg.guild.id
  })
 

  if(msg.author.bot) return
  const userdetail = await userinfo.findOne({
    UserID: msg.author.id
  })

  if (!userdetail) {
    let newData = new userinfo({
      UserID: msg.author.id
    })
    newData.save()
  }


  let alexaboi = await alexainfo.findOne({
    GuildID: msg.guild.id
  })

  if(alexaboi){
   let channel = alexaboi.channel
   if(channel == msg.channel.id){
     if(userdetail.voter !== "yes"){message.reply(`There is just one more step you need to perform in order to use this feature! Kindly check your dms`)
    return msg.author.send(`This Feature is only available to upvoters! Upvoting is free - https://bit.ly/sheepvote. However, if you did vote and didn't get the feature, then, contact PGamerX#7851 or join our support server`)
    }
    const reply = await ai.getReply(message.content, "en");
    msg.reply(reply)
   }
  }



  if (msg.author.bot) return;

  const novoter = new Discord.MessageEmbed()
    .setTitle(`You are not upvoter`)
    .setDescription("Hey there , You need to upvote me in order to use that ! You can [upvotehere](https://bit.ly/sheepvote). Already upvoted but can't use the command? Join our [Support Server](https://pgamerx.com/discord)")
    .setColor("RED")

  if (msg.channel.type == "dm") {
    const helpembed2 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("**Hey looks like you are interested in adding me :)**")
      .setDescription("**I cannot be more happy if you add me**")
      .addField(
        "Need Support?",
        "[My Support Server](https://discord.com/invite/vkBnQwhpHM)"
      )
      .addField(
        "Wanna know my commands?",
        "[My Command List](https://sheep.pgamerx.com/commands)"
      )
      .addField(
        "Wanna invite me? You'll Get a shoutout in our server once you add me :)",
        "[Invite me through our website](https://sheep.pgamerx.com)"
      )
      .addField(
        `Love me <:love:736194392305434704>?`,
        "[Upvote me for shoutout and role in support server](https://top.gg/bot/716985864512864328/vote)"
      )
      .addField(
        `Love me a lot!!!!<:love:736194392305434704><:love:736194392305434704><:love:736194392305434704>!`,
        "[Show love to developers](http://bit.ly/sheephelp)"
      );

    return msg.author.send(helpembed2);
  }



  /*const PREFIX = (await prefix.findOne({
    GuildID: msg.guild.id
  }))?.prefix || "s!";
*/


  const PREFIX = (await prefix.findOne({
    GuildID: msg.guild.id
  }) || {}).prefix || DPREFIX;


  if (msg.content.includes(`<@${bot.user.id}>`)) {
    console.log(PREFIX)
    msg.channel.send(
      `My Prefix for this server is **${PREFIX}** to change it do ${PREFIX}setpre`
    );
  }


  // eslint-disable-line

  if (
    msg.content.includes == `<@${bot.user.id}>` ||
    msg.content == `<@!${bot.user.id}> help`
  ) {
    console.log(PREFIX)

    var random = [
      `Hello ${msg.author.username} My prefix for this server is ${PREFIX}`
    ];
    msg.channel.send(random[Math.floor(Math.random() * random.length)]);
  }

  if (!msg.content.startsWith(PREFIX)) return;
  if (msg.content.startsWith(msg.author.bot)) {
        console.log(PREFIX)

    msg.reply(`Hi I got pinged My prefix for this server is ${PREFIX}`);
  }
  const args = msg.content.split(" ");


  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(PREFIX.length);
  const ms = require("ms"); // npm install ms


  const ohno = await restrictinfo.findOne({
    GuildID: msg.guild.id
  })
  if (!ohno) {
    let newData = new restrictinfo({
      GuildID: msg.guild.id,
      channels: ["69", "420"],
      commands: ["69", "420"],
    })
    newData.save()

  }

  if(blacklisted.includes(msg.author.id)) return msg.author.send(`You are Blacklisted from Using The Bot because of Breaking TOS`)


  let ohcommands = ohno.commands



  if (ohcommands.includes(command)) return msg.channel.send(`${command}Command is disabled in this server by server admins`)


  try {
    if (command === "beg" || command === "work" || command === "slots" || command === "gamble" || command === "dice" || command === "balance" || command === "bal") {
      return msg.channel.send(`Economy is now removed from me because of bad response and feedback`)
    }
    if (command === "delete") {
      let yowhattime = null
      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }
      let user = msg.mentions.users.first() || client.users.cache.get(args[2]) || msg.author
      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.delete(avatar);
      let attachment = new Discord.MessageAttachment(image, "deleted.png");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);
    }

    if (command === "changemymind") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let boomer = args.splice(1).join(" ");
      if (!boomer) return msg.reply("GIVE ME SOME TEXT ALONG WITH LMAO");
      let img = await canvacord.Canvas.changemymind(boomer);
      let attach = new Discord.MessageAttachment(img, "img.png");
      msg.channel.send(attach);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "triggered") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.trigger(avatar);
      let attachment = new Discord.MessageAttachment(image, "triggered.gif");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "blur") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      const api = require('random-stuff-api')
      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await api.canva.blur(avatar);
      let attachment = new Discord.MessageAttachment(image, "blur.png");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }
    if (command === "trash") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.trash(avatar);
      let attachment = new Discord.MessageAttachment(image, "trash.png");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "snipe") {
      const embeds = new Discord.MessageEmbed()
        .setTitle('There is nothing to snipe!')
        .setDescription('This is most likely because you sniped it after more then 1 minute!')
        .setColor('RED')
        .setFooter(`Noice`)
      const msg2 = client.snipes.get(message.channel.id)
      if (!msg2) return message.channel.send(embeds)
      const embed = new Discord.MessageEmbed()
        .setAuthor(msg2.author)
        .setDescription(msg2.content)
        .setColor('GREEN')
        .setTimestamp()
      if (msg2.image) embed.setImage(msg2.image)

      message.channel.send(embed)
    }
    if (command === "rip") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.rip(avatar);
      let attachment = new Discord.MessageAttachment(image, "trash.png");
      msg.channel.send(attachment);

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "jail") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.jail(avatar);
      let attachment = new Discord.MessageAttachment(image, "jail.png");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }
    if (command === "deepfry") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.deepfry(avatar);
      let attachment = new Discord.MessageAttachment(image, "deepfry.png");
      msg.channel.send(attachment);
      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "playstore") {
      let reason = args.slice(1).join(" ");

      var gplay = require("google-play-scraper");
      if (!args[1])
        return msg.reply(`Correct usage is ${PREFIX}playstore APPNAME`);
      const [results] = await gplay.search({
        term: `${reason}`,
        num: 1
      });

      if (results.title === undefined) {
        return msg.reply(`App Not Found BOOMER`);
      }

      let currency = results.currency;
      if (currency == undefined) {
        const result = new Discord.MessageEmbed()
          .setTitle(results.title)
          .setDescription(results.summary)
          .setThumbnail(results.icon)
          .setColor("RANDOM")
          .addField("Developed by", results.developer)
          .addField("PRICE", `It's Free Lmao`)
          .addField("How To Download?", results.url)
          .setFooter(`App id - ${results.appId}`)

        msg.channel.send(result)
      } else {
        const result = new Discord.MessageEmbed()
          .setTitle(results.title)
          .setDescription(results.summary)
          .setThumbnail(results.icon)
          .setColor("RANDOM")
          .addField("Developed by", results.developer)
          .addField("PRICE", `${results.price}${currency}`)
          .addField("How To Download?", results.url)
          .setFooter(`App id - ${results.appId}`)

        msg.channel.send(result)
      }
    }
    if (command === "youtube") {
      let msge = null
      let user = null
      let test = msg.mentions.users.first() || client.users.cache.get(args[1])
      if (!test) {
        msge = args.splice(1).join(` `)
        user = msg.author
      } else if (test) {
        msge = args.splice(2).join(` `);
        user = test
      }


      if (!user) return msg.reply(`Missing text`);
      if (!msge) return msg.reply(`Missing text`);


      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      const image = await canvacord.Canvas.youtube(avatar, `${user.username}`, `${msge}`);
      let attachment = new Discord.MessageAttachment(image, "youtube.png");
      return msg.channel.send(attachment);
    }
    if (command === "wanted") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.wanted(avatar);
      let attachment = new Discord.MessageAttachment(image, "wanted.png");
      msg.channel.send(attachment);

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }
    if (command === "wasted") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author
      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      let image = await canvacord.Canvas.wasted(avatar);
      let attachment = new Discord.MessageAttachment(image, "wasted.png");
      msg.channel.send(attachment);

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }

    if (command === "quote") {
      let msge = null
      let user = null
      let test = msg.mentions.users.first() || client.users.cache.get(args[1])
      if (!test) {
        msge = args.splice(1).join(` `)
        user = msg.author
      } else if (test) {
        msge = args.splice(2).join(` `);
        user = test
      }


      if (!user) return msg.reply(`Missing text`);
      if (!msge) return msg.reply(`Missing text`);


      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      const image = await canvacord.Canvas.quote({
        image: `${avatar}`,
        message: `${msge}`,
        username: `${user.username}`,
        color: "pink"
      });
      let attachment = new Discord.MessageAttachment(image, "quote.png");
      return msg.channel.send(attachment);
    }

    if (command === "phub") {
      let msge = null
      let user = null
      let test = msg.mentions.users.first() || client.users.cache.get(args[1])
      if (!test) {
        msge = args.splice(1).join(` `)
        user = msg.author
      } else if (test) {
        msge = args.splice(2).join(` `);
        user = test
      }


      if (!user) return msg.reply(`Missing text`);
      if (!msge) return msg.reply(`Missing text`);

      let avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
      const image = await canvacord.Canvas.phub({
        username: `${user.username}`,
        message: `${msge}`,
        image: `${avatar}`
      });
      let attachment = new Discord.MessageAttachment(image, "pnhub.png");
      return msg.channel.send(attachment);
    }
    if (command === "beautiful") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author
      let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
      // Make the image
      let img = await new DIG.Beautiful().getImage(avatar)
      // Add the image as an attachement
      let attach = new Discord.MessageAttachment(img, "delete.png");;
      message.channel.send(attach)

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }
    if (command === "bobross") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author
      let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
      // Make the image
      let img = await new DIG.Bobross().getImage(avatar)
      // Add the image as an attachement
      let attach = new Discord.MessageAttachment(img, "bobross.png");;
      message.channel.send(attach)

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);
    }

    if (command === "hitler") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }


      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
      // Make the image
      let img = await new DIG.Hitler().getImage(avatar)
      // Add the image as an attachement
      let attach = new Discord.MessageAttachment(img, "delete.png");;
      message.channel.send(attach)
      console.log(yowhattime)

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);

    }



    if (command === "fixitpls") {
      await prefix.findOneAndRemove({ guildID: "264445053596991498" })
      await prefix.findOneAndRemove({ guildID: "690557545965813770" })
      msg.channel.send(`done`)
    }

    if (command === "facepalm") {
      let yowhattime = null

      if (userdetail.voter) {
        yowhattime = 2000
      } else {
        yowhattime = 5000
      }
      const cooldown = cooldowns.get(message.author.id);

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now());
        msg.channel.send(
          `You have to wait` + " " + "`" + `${remaining}` + "`" + " " + "before you can use this command again again.")
        return msg.channel.send("Tip : Upvoters have to wait only **2 seconds** whereas others have to wait 5 seconds").catch(console.error);
      }


      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
      // Make the image
      let img = await new DIG.Facepalm().getImage(avatar)
      // Add the image as an attachement
      let attach = new Discord.MessageAttachment(img, "facepalm.png");;
      message.channel.send(attach)

      cooldowns.set(message.author.id, Date.now() + yowhattime);
      setTimeout(() => cooldowns.delete(message.author.id), yowhattime);
    }
    if (command === "cat") {
      bot.randompics.get("cat").execute(msg, args);
    }
    if (command === "duck") {
      bot.randompics.get("duck").execute(msg, args);
    }
    if (command === "horse") {
      bot.randompics.get("horse").execute(msg, args);
    }
    if (command === "bird") {
      bot.randompics.get("bird").execute(msg, args);
    }
    if (command === "fortune") {
      bot.fun.get("fortune").execute(msg, args);
    }
    // if (command === "search") {
    //client.fun.get("search").execute(msg, args);
    // }
    if (command === "serverstats") {
      bot.moderation.get("serverstats").execute(msg, args);
    }
    if (command === "food") {
      bot.randompics.get("food").execute(msg, args);
    }
    if (command === "vase") {
      bot.randompics.get("vase").execute(msg, args);
    }

    if (command === "dog") {
      bot.randompics.get("dog").execute(msg, args);
    }
    if (command === "ban") {
      bot.moderation.get("ban").execute(msg, args);
    }
    if (command === "news") {
      bot.fun.get("news").execute(msg, args);
    }
    if (command === "howgayme") {
      bot.fun.get("howgayme").execute(msg, args);
    }
    if (command === "google") {
      bot.fun.get("google").execute(msg, args);
    }
    if (command === "howgay") {
      bot.fun.get("howgay").execute(msg, args);
    }
    if (command === "chuckjoke") {
      bot.fun.get("chuckjoke").execute(msg, args);
    }
    if (command === "insult") {
      bot.fun.get("insult").execute(msg, args);
    }

    if (command === "slap") {
      bot.fun.get("slap").execute(msg, args);
    }
    if (command === "avatar") {
      bot.fun.get("avatar").execute(msg, args);
    }
    if (command === "pokemon") {
      bot.fun.get("pokemon").execute(msg, args);
    }
    if (command === "embarrass") {
      bot.fun.get("embarrass").execute(msg, args);
    }
    if (command === "channelinfo") {
      bot.moderation.get("channelinfo").execute(msg, args);
    }
    if (command === "unban") {
      bot.moderation.get("unban").execute(msg, args);
    }
    if (command === "lock") {
      bot.moderation.get("lock").execute(msg, args);
    }
    if (command === "unlock") {
      bot.moderation.get("unlock").execute(msg, args);
    }
    if (command === "setpre") {
      bot.moderation.get("setpre").execute(msg, args);
    }

    if (command === "setpre69") {
      bot.moderation.get("setpre69").execute(msg, args);
    }

    if (command === "fast") {
      const quiz = require("./quiz.json");
      const item = quiz[Math.floor(Math.random() * quiz.length)];
      const filter = response => {
        return item.answers.some(
          answer => answer.toLowerCase() === response.content.toLowerCase()
        );
      };
      const fast = new Discord.MessageEmbed()
        .setTitle("YOU HAVE 10 SECONDS TO TYPE THIS")
        .setDescription(item.question)
        .setColor("RANDOM");
      msg.channel.send(fast).then(() => {
        msg.channel
          .awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
          .then(collected => {
            msg.channel.send(`${collected.first().author} was first one `);
          })
          .catch(collected => {
            msg.channel.send("Looks like nobody is as fast as me ");
          });
      });
    }




    if (command === "invites") {
      try {
        let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

        msg.guild.fetchInvites().then(invites => {
          const userInvites = invites
            .array()
            .filter(o => o.inviter.id === user.id);
          var userInviteCount = 0;
          for (var i = 0; i < userInvites.length; i++) {
            var invite = userInvites[i];
            userInviteCount += invite["uses"];
          }
          msg.channel.send(`**${user}** has **${userInviteCount}** invites.`);
        });
      } catch (err) {
        console.log(err);
        msg.channel.send(`Error! Do i have perms to fetch invites ?`);
      }
    }
    if (command === "eval") {
      const owners_id = ["587663056046391302"];
      if (!owners_id.includes(msg.author.id))
        return msg.channel.send("You not owner boi");
      const args2 = msg.content.split(" ").slice(1);

      const clean = text => {
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      };

      try {
        const code = args2.join(" ");
        let evaled = await eval(code);

        msg.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
        msg.channel.send(clean(evaled), { code: "xl" });
      } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }

    if (command === "covidall") {
      let msg6 = await msg.channel.send(
        "Deriving information. This might take a while"
      );

      const corona = await worldometer.trackAll(); //returns object
      const totalCases = await corona.totalCases; //returns total cases
      const totalDeaths = await corona.totalDeaths;
      const totalRecovered = await corona.totalRecovered;
      const activeCases = await corona.activeCases;
      const closedCases = await corona.closedCases;

      //let msg6 = await msg.channel.send("Deriving information. This might take a while")
      const coronaall = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addField("Cases", `${totalCases}`)
        .addField("Deaths", `${totalDeaths}`)
        .addField("Recovered", `${totalRecovered}`)
        .setFooter("Stay Home Stay Safe :) ");
      msg6.edit(coronaall);
      // api.all().then(console.log)

      /*  recentcmd.add(msg.author.id)
        setTimeout(() => {
          recentcmd.delete(msg.author.id)
        }, 5000)
  */
    }
    if(command === "logging"){
      if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`You don't have the correct Permission! `)
      if(agrs[1] === "set"){
        if(args[2] === "message"){
     prompter.message(msg.channel, {
       question: "Kindly Mention the channel you want to set for logging message events (messageDelete , messageUpdate ......)",
       userID: msg.author.id,
       max: 1,
       timeout: 30000
     }).then(async (responses) => {
      if (!responses.size) {
        return msg.channel.send(`Time out ! Run the command again now `);
      }
      const response = responses.first()
      let channel = response.mentions.channels.first().id
      if(!channel) return response.channel.send(`You never mentioned a channel`)
      let first = await logingo.findOneAndRemove({
        GuildID: response.guild.id
      })
      let message = first.message
      let server = first.server
      await logingo.findOneAndRemove({
        GuildID: response.guild.id
      })
      let newData = new restrictinfo({
        GuildID: response.guild.id,
        server: server,
        message: message,
        mod: mod
      })
      newData.save()     })
        }
      }
    }
    if (command === "enable") {
      if (!msg.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Nope , you don't have the permissions`)
      if (args[1] === "command") {
        const restrict = await restrictinfo.findOne({
          GuildID: msg.guild.id
        })
        
        if (restrict) {
          let channels22 = restrict.channels
          let commands22 = restrict.commands
          prompter
            .message(msg.channel, {
              question: "Kindly type command you want to enable ! Command has to be in lowercase",
              userId: msg.author.id,
              max: 1,
              timeout: 30000,
            })
            .then(async (responses) => {
              if (!responses.size) {
                return msg.channel.send(`Time out ! Run the command again now `);
              }
              // Gets the first message in the collection
              const response = responses.first()
              let cmd = response.content


              const index = commands22.indexOf(response.content);
              if (index > -1) {
                commands22.splice(index, 1);
              }
              await restrictinfo.findOneAndRemove({
                GuildID: response.guild.id
              })
              let newData = new restrictinfo({
                GuildID: response.guild.id,
                channels: channels22,
                commands: commands22,
              })
              newData.save()
              response.channel.send(`Yes boi , ${cmd} is now enabled`)

            })
        }
      }
    }
    if (command === "disable") {
      if (!msg.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Nope , you don't have the permissions`)
      if (args[1] === "command") {
        const restrict = await restrictinfo.findOne({
          GuildID: msg.guild.id
        })
        if (restrict) {
          let channels22 = restrict.channels
          let commands22 = restrict.commands
          prompter
            .message(msg.channel, {
              question: "Kindly type command you want to disable ! Command has to be in lowercase",
              userId: msg.author.id,
              max: 1,
              timeout: 30000,
            })
            .then(async (responses) => {
              if (!responses.size) {
                return msg.channel.send(`Time out ! Run the command again now `);
              }
              // Gets the first message in the collection
              const response = responses.first()
              let cmd = response.content

              commands22.push(cmd)

              await restrictinfo.findOneAndRemove({
                GuildID: response.guild.id
              })
              let newData = new restrictinfo({
                GuildID: response.guild.id,
                channels: channels22,
                commands: commands22,
              })
              newData.save()
              response.channel.send(`Yes boi , ${cmd} is now disabled`)

            })
        }
      }
    }

    if (command === "jojo") {
      try {
        fetch(`https://api.tenor.com/v1/random?key=EH35O4HY8VDJ&q=jojo&limit=1`)
          .then(res => res.json())
          .then(json => msg.channel.send(json.results[0].url));
      } catch (err) {
        console.log(err);
        msg.channel.send(err);
      }
    }

    if (command === "joke") {
      giveMeAJoke.getRandomDadJoke(function (joke) {
        msg.channel.send(joke);
      });
    }

    if (command === "cnjoke") {
      giveMeAJoke.getRandomCNJoke(function (joke) {
        msg.channel.send(joke);
      });
    }


    if (command === "whois") {
      let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[1]) || msg.member

      let user = msg.mentions.users.first() || client.users.cache.get(args[1]) || msg.author

      const joinDiscord = moment(user.createdAt).format("llll");
      const joinServer = moment(user.joinedAt).format("llll");

      let whois = new Discord.MessageEmbed()
        .setAuthor(
          user.username + "#" + user.discriminator,
          user.displayAvatarURL
        )
        .setDescription(`${user}`)
        .setColor(`RANDOM`)
        .setThumbnail(`${user.displayAvatarURL()}`)
        .addField("**Joined Server:**", `${member.joinedAt.toDateString()}`)
        .addField("**Joined Discord:**", `${joinDiscord}`)
        .addField("Status:", user.presence.status)
        .addField("Roles:", member.roles.cache.map(r => `${r}`).join(" | "))
        .setFooter(`ID: ${user.id}`)
        .setTimestamp();

      msg.channel.send(whois);
    }

    if (command === "setstatus" || command === "status") {
      const owners_id = ["587663056046391302"];
      if (!owners_id.includes(msg.author.id))
        return msg.channel.send("You not owner boi");

      var botmessage = args.slice(1).join(" ");
      if (!botmessage) {
        msg.channel.send("What should I **play**?");
        return;
      }
      msg.delete();
      bot.user.setActivity(botmessage, { type: "IDLE" });
    }
    if (command === "stealemoji") {
      if (!msg.member.hasPermission(`MANAGE_EMOJIS`)) {
        return msg.channel.send(
          `You Don't Have Permission To Use This Command! Manage Emojis`
        );
      }

      const emoji = args[1];
      if (!emoji) return msg.channel.send(`Please Give Me A Emoji!`);
      const Link = `${args[1]}`;

      let customemoji = Discord.Util.parseEmoji(Link);
      const Color = `RANDOM`;

      const name = args.slice(2).join(" ");

      msg.guild.emojis.create(`${Link}`, `${name}`);
      const Added = new Discord.MessageEmbed()
        .setTitle(`Emoji Added`)
        .setColor(`${Color}`)
        .setDescription(
          `Emoji Has Been Added! | Name : ${name ||
          `${customemoji.name}`} | Preview : [Click Me](${Link})`
        );
      return msg.channel.send(Added);

      let CheckEmoji = parse(emoji, { assetType: "png" });
      if (!CheckEmoji[1])
        return msg.channel.send(`Please Give Me A Valid Emoji!`);
      msg.channel.send(`You Can Use Normal Emoji Without Adding In Server!`);
    }

    if (command === "patreon") {
      msg.channel.send(`Kindly Visit https://sheep.pgamerx.com/premium for more info`)
    }
    if (command === "premium") {
      msg.channel.send(`Kindly Visit https://sheep.pgamerx.com/premium for more info`)
    }

    if (command === "meme") {
      bot.memes.get("meme").execute(msg, args);
    }

    if (command === "pewdiepie") {
      bot.memes.get("pewdiepie").execute(msg, args);
    }

    if (command === "dankmeme") {
      bot.memes.get("dankmeme").execute(msg, args);
    }

    if (command === "me_irl") {
      bot.memes.get("me_irl").execute(msg, args);
    }

    if (command === "weather") {
      try {
        weather.find({ search: args.join(" "), degreeType: "C" }, function (
          error,
          result
        ) {
          if (error) return msg.channel.send(error);
          if (!args[1]) return msg.channel.send("Please specify a location");

          if (result === undefined || result.length === 0)
            return msg.channel.send("**Invalid** location");

          let current = result[0].current;
          let location = result[0].location;

          const weatherinfo = new Discord.MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Weather forecast for ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(0x111111)
            .addField("Timezone", `UTC${location.timezone}`, true)
            .addField("Degree Type", "Celsius", true)
            .addField("Temperature", `${current.temperature}°`, true)
            .addField("Wind", current.winddisplay, true)
            .addField("Feels like", `${current.feelslike}°`, true)
            .addField("Humidity", `${current.humidity}%`, true);
          console.log(result);
          console.log(result[0]);
          console.log(result[1]);
          console.log(error);
          console.log(current);
          console.log(location);

          msg.channel.send(weatherinfo);
        });
        /* recentcmd.add(msg.author.id)
        setTimeout(() => {
          recentcmd.delete(msg.author.id)
        }, 7000)*/
      } catch (err) {
        console.log(err);
        msg.channel.send(err);
      }
    }

    if (command === "tf") {
      bot.fun.get("tf").execute(msg, args);
    }

    if (command === "purge") {
      const deleteCount = Number(args[1]);

      if (!msg.member.hasPermission("MANAGE_MESSAGES"))
        return msg.channel.send("No");

      if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return msg.reply(
          "**Please provide a number between 2 and 100 for the number of messages to delete**"
        );
      msg.channel
        .bulkDelete(deleteCount)
        .then(messages => msg.reply(`**Deleted ${messages.size} messages**`))
        .catch(e => {
          console.error(e);
          return msg.reply(
            "**Something went wrong when trying to delete messages :(**"
          );
        });
    }

    if (command === "discord") {
      msg.reply(`https://discord.com/invite/vkBnQwhpHM`);
      msg.channel.send(
        `**You can join our server for suggestions,help,bugs or even for fun ;)**`
      );
    }

    if (command === "clap") {
      if (!args[1]) return msg.reply("What should i clap");
      if (!args[2]) return msg.reply("Atleast enter two words");
      msg.channel.send(args.slice(1).join(":clap:"));
    }

    if (command === "motivation") {
      const fs = require("fs");
      const jsonQuotes = fs.readFileSync(
        "resources/quotes/motivational.json",
        "utf8"
      );

      const quoteArray = JSON.parse(jsonQuotes).quotes;

      const randomQuote =
        quoteArray[Math.floor(Math.random() * quoteArray.length)];

      const quoteEmbed = new Discord.MessageEmbed()
        .setTitle(randomQuote.author)
        .setDescription(randomQuote.text)
        .setColor("#ff003c");
      return msg.channel.send(quoteEmbed);
      console.log();
    }

    if (command === "yeet") {
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.reply("This is available to Admins only");

      let count = msg.guild.memberCount;
      msg.channel.send(
        "Ok Boomer Looks Like you wanna ban this much members -" + count
      );
    }

    if (command === "kick") {
      if (!msg.member.hasPermission("KICK_MEMBERS"))
        return msg.reply(
          "*_Sorry, you don't have permissions to use this!_* :( "
        );

      let member = msg.mentions.members.first() || client.users.cache.get(args[1])
      if (!member)
        return msg.reply("__Please mention a valid member of this server__");
      if (!member.kickable)
        return msg.reply(
          "*I cannot kick this user! Do they have a higher role? Do I have kick permissions?*"
        );

      // slice(1) removes the first part, which here should be the user mention or ID
      // join(' ') takes all the various parts to make it a single string.
      let reason = args.slice(2).join(" ");
      if (!reason) reason = "No reason provided";
      if (msg.author.id == member.user.id)
        return msg.reply("Boomer, You wanna kick yourself?");

      if (msg.member.roles.highest.position <= member.roles.highest.position)
        return msg.reply(
          `Person has a higher or same role as you so... Later Boomer`
        );
      await member
        .kick(reason)
        .catch(error =>
          msg.reply(
            `**Sorry ${msg.author} I couldn't kick because of : ${error}**`
          )
        );
      msg.channel.send(
        `**${member.user.tag} has been kicked by ${msg.author.tag} because: ${reason}**`
      );
    }

    if (command === "ping") {
      const msg2 = await msg.channel.send(`🏓 Pinging...`);
      msg2.edit(`🏓 Pong ${Math.floor(msg2.createdAt - msg.createdAt)}ms`);
    }


    if (command === "servers") {
      let message = msg
      const stats = new Discord.MessageEmbed()
      .setTitle(`Stats`)
      .setColor("RANDOM")
      .addField(`Server Count`,`${client.guilds.cache.size}`)
      
              return message.channel.send(stats)
        
        .catch(console.error);
    }

    if (command === "info") {
      msg.channel.send(
        `**I am an Amazing Bot Made my PGamerX#7350** , ***Do ${PREFIX}help for Commands*** , **My Version is 1.0**`
      );
    }
    if (command === "trollslowmode") {
      let devs = ["587663056046391302"];
      if (!devs.includes(msg.author.id)) return msg.channel.send("Noob");

      {
        var time = msg.content
          .split(" ")
          .slice(1)
          .join(" ");
        if (!time) return msg.reply("Please enter a time in seconds!");

        msg.channel.setRateLimitPerUser(time);
        msg.channel.send("**Command Succesfully executed!**");
      }
    }
    if (command === "verify6969") {
      const helpembed2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("**React to be Verified**")
        .setDescription(
          `**If you have read <#690781607124009025> Then React with :sheep: to get Verified role and enter the server :)**`
        )

        .addField(
          "Wanna know my commands?",
          "[My Command List](https://sheep.pgamerx.com/commands)"
        )
        .addField(
          "Wanna invite me?",
          "[My Top.gg page](https://top.gg/bot/716985864512864328/)"
        );

      msg.channel.send(helpembed2);
    }
    if (command === "slowmode") {
      if (!msg.member.hasPermission("MANAGE_MESSAGES"))
        return msg.reply(
          "You don't have `Manage Messages` Permissions which is the least perms needed by a mod"
        );

      {
        var time = msg.content
          .split(" ")
          .slice(1)
          .join(" ");


        if (time > 21600)
          return msg.reply(
            "**Slowmode Cannot be more than 21600 seconds i.e 6 hours**"
          );

        if (!time) return msg.reply("Please enter a time in seconds!");
        if (time === "off" || time === "0") {
          msg.channel.setRateLimitPerUser(0);
          return msg.reply("Slowmode Turned off!");
        } else {
          msg.channel.setRateLimitPerUser(time);

          msg.channel.send(
            `Slow mode now enabled with a cooldown of ${time} seconds`
          );
        }
      }
    }

    if (command === "ascii") {
      try {
        var text = msg.content
          .split(" ")
          .slice(1)
          .join(" ");

        if (!text) {
          return msg.channel.send(
            `Please provide text for the ascii conversion!`
          );
        }
        let maxlen = 20;
        if (text.length > 20) {
          return msg.channel.send(
            `Please put text that has 20 characters or less because the conversion won't be good!`
          );
        }
        // AGAIN, MAKE SURE TO INSTALL FIGLET PACKAGE!
        figlet(text, function (err, data) {
          msg.channel.send(data, {
            code: "AsciiArt"
          });
        });
      } catch (err) {
        console.log(err);
        msg.reply("Unknown Error occured Kindly Contact PGamerX#7350");
      }
    }

    if (command === "say") {
      return msg.reply(`Command disabled currently due to issues`)
      let omgu = msg.mentions.roles.first()
      if (omgu) {
        return msg.reply(`Don't try to ping a role using me !`)
      }
      var text = msg.content
        .split(" ")
        .slice(1)
        .join(" ");

      if (!text) return msg.reply("Please give me some text to say! :)");
      if (text.content.includes("&")) return ("Don't try to break me")
      msg.channel.send(text);
      msg.delete();
    }

    if (command === "invite") {
      const invite = new Discord.MessageEmbed()
        .setTitle("Invite Me!!!")
        .setDescription("Make me your family by inviting me to your server !")
        .addField(
          "My top.gg Page. Invite me and maybe upvote too?",
          "[Click Here!](https://top.gg/bot/716985864512864328)"
        )
        .setColor("RANDOM")
        .setFooter("Invite me :)");
      msg.channel.send(invite);
    }

    if (command === "coinflip") {
      var choices = ["heads", "tails"];

      var output = choices[Math.floor(Math.random() * choices.length)];

      msg.channel.send(`You got **${output}!**`);
    }

    if (command === "lenny") {
      msg.channel.send("(͡° ͜ʖ ͡°)");
    }

    if (command === "lyrics") {
      msg.channel.send(`Command disabled sorry`)
    }

    if (command === "privacy") {
      try {
        const privacy = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle("You are Safe")
          .setThumbnail(
            `https://cdn.glitch.com/38b33121-f779-43cc-a95d-c99a7cf7a9d4%2Fsafe.png?v=1594094062884`
          )
          .setDescription("We Don't store any of your Data!")
          .addField(
            "Chat",
            "The bot never stores your chat data it only respond to commands with it's prefix and never stores anything"
          )
          .addField(
            "User Info",
            "We never store your username or anything. The only time we display your pfp and name is when whois command is executed"
          )
          .addField(
            "Server Info",
            "Server info is not stored in any case. We access number of emoji or roles or server name only when serverstats command is executed"
          )
          .setFooter("You are Safe");
        msg.channel.send(privacy);
      } catch (err) {
        console.log(err);
        msg.reply("**Some unexpeted error occcured**");
      }
    }

    if (command === "dance") {
      if (!args[1]) return msg.reply("**Brvh enter some text along with**");
      if (!args[2]) return msg.reply("Atleast enter two words");

      try {
        msg.channel.send(
          args.slice(1).join(`<a:sheep_dance:729337379206201447>`)
        );
      } catch (err) {
        console.log(err);
        msg.reply("**Do i have perms to use external emotes ?**");
      }
    }
    if (command === "covidadv") {
      if (recentadv.has(msg.author.id))
        return msg.reply(
          `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
        );
      let msg0 = await msg.channel.send("Loading. This might take a while");

      const corona = await worldometer.trackAll(); //returns object
      const totalCases = await corona.totalCases; //returns total cases
      const totalDeaths = await corona.totalDeaths;
      const totalRecovered = await corona.totalRecovered;
      const activeCases = await corona.activeCases;
      const closedCases = await corona.closedCases;

      try {
        const coronaadv = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle("Advance Covid Stats")
          .setDescription("No. of cases are not exact and may differ")
          .addField("Global Cases", `${totalCases}`, true)
          .addField("Global Deaths", `${totalDeaths}`, true)
          .addField("Global Recoveries", `${totalRecovered}`, true)
          .addField("Active Cases", `${activeCases}`, true)
          .addField("Closed Cases", `${closedCases}`, true)
          .setFooter(`Stay Home, Stay safe | ${PREFIX}help`);
        msg0.edit(coronaadv);
        recentadv.add(msg.author.id);
        setTimeout(() => {
          recentadv.delete(msg.author.id);
        }, 3000);
      } catch (err) {
        console.log(err);
        msg.reply("**Unknown error occcured**");
      }
    }

    if (command === "random") {
      var facts = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      var fact = Math.floor(Math.random() * facts.length);
      msg.channel.send(`Your random number between 0-10 is **${fact}**`);
    }

    if (command === "covid") {
      if (recentcovid.has(msg.author.id))
        return msg.reply(
          `**You are on cooldown you can use this cmd once in 3 seconds. This is to prevent rate limting**`
        );

      const country = args.slice(1).join(" ");
      const corona = await worldometer.trackCountry(country).catch(function (e) {
        if (e) return msg.channel.send("Country not found");
      });
      const totalCases = await corona.cases.total; //total cases
      const recovered = await corona.cases.recovered;
      const deaths = await corona.cases.deaths;
      const dischargePercent = await corona.closedCases.percentage.discharge;
      const deathPercent = await corona.closedCases.percentage.death;
      const closedCases = await corona.closedCases.total;
      const flagImg = await corona.country.flagImg;
      const countryName = await corona.country.name;

      if (!country) return msg.reply("Please name a country along with");

      let msg777 = await msg.channel.send("Loading. This might take a while");

      if (totalCases === undefined || totalCases.length === 0)
        return msg777.edit("**Invalid** location");
      if (recovered === undefined || recovered.length === 0)
        return msg777.edit("**Invalid** location");
      if (deaths === undefined || deaths.length === 0)
        return msg777.edit("**Invalid** location");
      if (closedCases === undefined || closedCases.length === 0)
        return msg777.edit("**Invalid** location");
      if (flagImg === undefined || flagImg.length === 0)
        return msg777.edit("**Invalid** location");
      if (countryName === undefined || countryName.length === 0)
        return msg777.edit("**Invalid** location");

      try {
        const countryembed = new Discord.MessageEmbed()
          .setTitle(`${countryName}`)
          .setColor("RANDOM")
          .setDescription("No. of cases are not exact and may differ")
          .setThumbnail(`${flagImg}`)
          .addField("Cases", `${totalCases}`, true)
          .addField("Deaths", `${deaths}`, true)
          .addField("Recoveries", `${recovered}`, true)
          .addField("Discharge %", `${dischargePercent} %`, true)
          .addField("Closed Cases", `${closedCases}`, true)
          .setFooter(`Stay Home, Stay safe | ${PREFIX}help`);
        msg777.edit(countryembed);
        recentcovid.add(msg.author.id);
        setTimeout(() => {
          recentcovid.delete(msg.author.id);
        }, 3000);

        // msg.channel.send("**If you recieve undefined you must have missspelled like Unites States of America to America or Sri-Lanka to Sri Lanka etc**")
      } catch (err) {
        console.log(err);
        msg.reply("**Error occured**");
      }
    }

    if (command === "wobble") {
      if (!args[1]) return msg.reply("**Brvh enter some text along with**");
      if (!args[2]) return msg.reply("Atleast enter two words");

      msg.channel.send(args.slice(1).join(`<a:wobble:729580002181644316>`));
    }

    if (command === "mute") {
      let reason = args.slice(2).join(" ");
      let user = msg.mentions.users.first();
      let muteRole = msg.guild.roles.cache.find(role => role.name === "Muted");

      if (!msg.member.hasPermission("MANAGE_ROLES"))
        return msg.reply("You need atleast Manage roles perms to do this brvh");

      if (!user) return msg.reply("**Provide a valid user BOOMER**");
      if (!reason) return msg.reply("I need a Reason");
      // if(msg.author.id == user.user.id) return msg.reply("Boomer, You wanna ban yourself?")

      //   if (msg.member.roles.highest.position <= member.roles.highest.position) return msg.reply(`Person has a higher or same role as you so... Later Boomer`)
      if (!muteRole) {
        try {
          msg.reply(` No role called Muted found creating one  `);
          muteRole = await msg.guild.roles.create({ data: { name: "Muted" } });
          msg.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muteRole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        } catch (e) {
          console.log(e.stack);
        }
      }

      if (msg.mentions.users.size < 1)
        return msg
          .reply("You must mention someone to mute them.")
          .catch(console.error);
      const embed = new Discord.MessageEmbed()
        .setColor(0x00ae86)
        .setTimestamp()
        .addField("Action:", "Mute")
        .addField("User:", `${user.username}#${user.discriminator} (${user.id})`)
        .addField(
          "Modrator:",
          `${msg.author.username}#${msg.author.discriminator}`
        )
        .addField("Reason", reason);

      if (!msg.guild.me.hasPermission("MANAGE_ROLES"))
        return msg
          .reply("I do not have the correct permissions.")
          .catch(console.error);

      msg.guild
        .member(user)
        .roles.add(muteRole)
        .then(() => {
          msg.channel.send(embed).catch(console.error);
        });
    }
    if (command === "help" || command === "cmd" || command === "commands" || command === "command") {
      const botMessage = await msg.channel.send("Loading Menu Please wait !")
      
        let pages = [
          new MessageEmbed()
            .setTitle(`Black Sheep`)
            .setThumbnail(`https://images.discordapp.net/avatars/716985864512864328/a89fc5ca8f51f4fbe192b6f19ad2609d.png?size=512`)
            .setColor(`RANDOM`)
            .addField(`**:question: | New To Black Sheep?**`, "Here is a short but detailed guide aboout Black Sheep ! [Click here](https://github.com/pgamerxstudio/blacksheep#readme)")
            .addField(`Commands !`,
              `
1.Fun Commands - Page 1
2.Image Manipulation - Page 2
3.Random Image Commands - Page 3
4.Moderation Commands - Page 4
5.Other Commands - Page 5
6.Welcome and Leave Message - Page 6
`
            )
            .addField(
              "**Important Links**",
              "**[Invite Me](http://bit.ly/sheepadd) | " +
              "[Support Server](https://discord.com/invite/vkBnQwhpHM) | " + "[Upvote on Top.gg](https://bit.ly/sheepvote)**")
          .addField(`We need your Help!`, "Hey there! We are deciding to make our bot fully transparent by making it open-source on github. But this will increase chances of code-stealing and scams using copies of our bots. So we have decided to purchase a trademark for Black sheep, but, we can't afford it without your support! So consider supporting on [Ko-Fi](https://ko-fi.com/pgamerx)")
              ,
          new MessageEmbed()
            .setTitle('Fun Commands')
            .setDescription
            (
              `
${PREFIX}alexa setup #channel - Set's up channel for Alexa
${PREFIX}alexa remove - Disables Alexa
tf - Answers a question within True/false
playstore - Provides information about app which you ask from google playstore
fast - Gives a random word which have to be typed by someone within 10 seconds
slap - Slap a user
motivation - Motivational Quote
pokemon - information about a pokemon
meme - Random meme
insult - Random Insult
lenny - (Í¡Â° ÍœÊ– Í¡Â°)
joke - A funny Dad Joke
cnjoke - Random cn joke
chuckjoke - Random Chuck joke
howgayme - Tells how much of a gay you are
embarrass - Let's keep it a suprise ;)
howgay - Gay-o-meter
news - Top 2 latest news
fortune - Random Fortune Cookie
say - Says whatever you say
coinflip - As it name says
`)
            .setFooter(`Page 1`)
            .setColor("GREEN"),
          new MessageEmbed()
            .setTitle('Image Manipulation Commands')
            .setDescription
            (
              `
jail - Go into jail
bobross - Bobross will paint you
beautiful - Beautiful
facepalm - You messed up
hitler - Oh no
deepfry - Deepfry yourself or someone smh
trash - Put yourself in trash
quote - Fake quote something
triggered - Get yourself or your friend triggered
changemymind - Change your mind
Delete - Tired to write it
phub - You know right
rip - Rest in peace
wanted - Police incoming
wasted - wasted tan
blur - Blurs your image
pixelate - Pixelates your image   
`
            )
            .setFooter(`Page 2`)
            .setColor("GREEN"),
          new MessageEmbed()
            .setTitle('Random Image Commands')
            .setDescription
            (
              `
horse - Random horse pic
cat - Random cat pic
dog - Random dog pic
bird - Random bird pic
duck - Random duck pic
vase - Random vase pic
food - Random food pic
`)
            .setFooter(`Page 3`)
            .setColor("GREEN"),
          new MessageEmbed()
            .setTitle('Moderation Commands')
            .setDescription
            (
              `
ban - bans a user
unban - unabans a user
lock - locks a channel
unlock - unlocks a channel
mute - Mutes a user
serverstats - Display stats about the server
channelinfo - Provides info about channel this command is run in
whois - Gives information about mentioned user
setpre - changes prefix for specific server

`
            )
            .setFooter(`Page 4`)
            .setColor("GREEN"),
          new MessageEmbed()
            .setTitle('Other Commands')
            .setDescription
            (
              `
servers - number of servers bot is in
ping - Tells the bot latency
patreon - Support by becoming a patreon
discord - Provides link to support server
ascii - Tells a text in ascii format
wobble - Try it yourself
clap - Try it yourself
covidall - Overall Covid-19 stats
covidadv - Advanced Covid-19 stats
covid(country) - Covid-19 Stats about specific country
weather(city name) - Weather stats about specififc city
`
            )
            .setFooter(`Page 5`)
            .setColor("GREEN"),
          new MessageEmbed()
            .setTitle('Welcome and Leave Message')
            .setDescription
            (
              `
**Welcome Message -**
1. \`${PREFIX}welcome channel\` - Sets the channel for welcome message
2. \`${PREFIX}welcome message\` - Sets the message for welcoming new user
3. \`${PREFIX}welcome delete\` - Delete's the existing welcome configuration

**Leave Message -**
1. \`${PREFIX}leave channel\` - Sets the channel for leave message
2. \`${PREFIX}leave message\` - Sets the message for saying good bye to a member 
3. \`${PREFIX}leave delete\` - Delete's the existing leave configuration

`
            )
            .setFooter(`Page 6`)
            .setColor("GREEN")
        ]

        let emojiList = ['⏪', '⏩']
        paginationEmbed(msg, pages, emojiList, 100000);

    }
    if (command === "recent") {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Message For Fellow Developers`)
        .setDescription("Hey everyone , Our bot has grown a lot! It is currently in 1.2k+ servers. So That's why we are starting a programme called [Start it](https://start.pgamerx.com). In this programm we don't only guide you guys in how to host for free etc but also help you guys in promoting your bot for free. If you think your bot is under-rated and deserves more attention ! You can drop it in our [brand new server](https://discord.com/invite/J6NQWrbk4b) and we will check it! If your bot is good enough, It'll be featured on bot's help command as well as [Our New Website](https://start.pgamerx.com)")
        .setColor("GREEN")
      msg.channel.send(embed)
    }

    if (command === "welcome") {
      if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":no_entry_sign: You Don't have permission sir")

      if (args[1] === "channel") {

        const welcome = await welcomeinfo.findOne({
          GuildID: message.guild.id
        })

        if (!welcome) {
          let channel = null
          let welcomemsg = null
          const botMessage = await message.channel.send("Alright It's time to choose the channel ! Kindly mention the channel or provide the channel ID");
          const reply = await MessageCollector.asyncQuestion({
            botMessage,
            user: message.author.id,
          });

          if (reply) {
            let kek = reply.mentions.channels.first() || msg.guild.cache.get(reply.content) || reply.channel
            let bruh = kek.id
            channel = bruh
            reply.channel.send(`Alright ! <#${bruh}> has been set as channel for welcome message. Now use \`${PREFIX}welcome message command\``)

            let newData = new welcomeinfo({
              GuildID: reply.guild.id,
              channel: bruh,
              status: "yes",
            })
            newData.save()
          }
        } else if (welcome) { return message.channel.send(`Hey ! You already have a welcome message set ! Firstly you need to remove it using ${PREFIX}welcome delete`) }
      }
      else if (args[1] === "message") {
        const welcome = await welcomeinfo.findOne({
          GuildID: msg.guild.id
        })
        let tempchannel = welcome.channel
        if (!tempchannel) return message.channel.send(`You need to set up a channel first ! Use the \`${PREFIX}welcome channel\` command`)
        let channel = tempchannel
        let messagechoose = new Discord.MessageEmbed()
          .setTitle(`Time to set the Message!`)
          .setDescription(`
Kindly send the message which you would like to set as welcome message . 
  **PlaceHolders** -
1. \`{mention}\` - Mentions the user. For eg - @PGamerX 
2. \`{usertag}\` - Writes the username along with tag . For eg - PGamerX#7851 
3.\`{memberCount}\` -  Writes the member count 
You have 30 seconds !` )
          .setColor("GREEN")


        prompter
          .message(msg.channel, {
            question: messagechoose,
            userId: msg.author.id,
            max: 1,
            timeout: 30000,
          })
          .then(async (responses) => {
            if (!responses.size) {
              return msg.channel.send(`Time out ! Run the command again now `);
            }
            // Gets the first message in the collection
            const response = responses.first()
            let welcomemsg = response.content
            let final = new Discord.MessageEmbed()
              .setTitle(`Setup Done! Welcome Message is`)
              .setDescription(welcomemsg)
              .addField(`Channel`, `<#${channel}>`)
              .setColor("GREEN")
            response.channel.send(final)
            await welcomeinfo.findOneAndRemove({
              GuildID: msg.guild.id
            })

            let newData = new welcomeinfo({
              GuildID: response.guild.id,
              message: welcomemsg,
              channel: channel,
              status: "yes",
            })
            newData.save()


          })
      }

      else if (args[1] === "delete") {
        await welcomeinfo.findOneAndRemove({
          GuildID: msg.guild.id
        })
        msg.channel.send(`Succesfully removed`)

      }

    }
    if (command === "leave") {
      if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":no_entry_sign: You Don't have permission sir")

      if (args[1] === "channel") {

        const bye = await byeinfo.findOne({
          GuildID: message.guild.id
        })

        if (!bye) {
          let channel = null
          const botMessage = await message.channel.send("Alright It's time to choose the channel ! Kindly mention the channel or provide the channel ID");
          const reply = await MessageCollector.asyncQuestion({
            botMessage,
            user: message.author.id,
          });

          if (reply) {
            let kek = reply.mentions.channels.first() || msg.guild.cache.get(reply.content) || reply.channel
            let bruh = kek.id
            channel = bruh
            reply.channel.send(`Alright ! <#${bruh}> has been set as channel for welcome message. Now use \`${PREFIX}leave message\` command`)

            let newData = new byeinfo({
              GuildID: reply.guild.id,
              channel: bruh,
              status: "yes",
            })
            newData.save()
          }
        } else if (bye) { return message.channel.send(`Hey ! You already have a leave message set ! Firstly you need to remove it using ${PREFIX}leave delete`) }
      }
      else if (args[1] === "message") {
        const bye = await byeinfo.findOne({
          GuildID: msg.guild.id
        })
        let tempchannel = bye.channel
        if (!tempchannel) return message.channel.send(`You need to set up a channel first ! Use the \`${PREFIX}leave channel\` command`)
        let channel = tempchannel
        let messagechoose = new Discord.MessageEmbed()
          .setTitle(`Time to set the Message!`)
          .setDescription(`
Kindly send the message which you would like to set as Leave message . 
  **PlaceHolders** -
1. \`{mention}\` - Mentions the user. For eg - @PGamerX 
2. \`{usertag}\` - Writes the username along with tag . For eg - PGamerX#7851 
3.\`{memberCount}\` -  Writes the member count 
You have 60 seconds !` )
          .setColor("GREEN")


        prompter
          .message(msg.channel, {
            question: messagechoose,
            userId: msg.author.id,
            max: 1,
            timeout: 60000,
          })
          .then(async (responses) => {
            if (!responses.size) {
              return msg.channel.send(`Time out ! Run the command again now `);
            }
            // Gets the first message in the collection
            const response = responses.first()
            let welcomemsg = response.content
            let final = new Discord.MessageEmbed()
              .setTitle(`Setup Done! Leave Message Message is`)
              .setDescription(welcomemsg)
              .addField(`Channel`, `<#${channel}>`)
              .setColor("GREEN")
            response.channel.send(final)
            await byeinfo.findOneAndRemove({
              GuildID: msg.guild.id
            })

            let newData = new byeinfo({
              GuildID: response.guild.id,
              message: welcomemsg,
              channel: channel,
              status: "yes",
            })
            newData.save()


          })
      }

      else if (args[1] === "delete") {
        await byeinfo.findOneAndRemove({
          GuildID: msg.guild.id
        })
        msg.channel.send(`Succesfully removed`)

      }

    }


    if (command == "play" || command === "skip" || command === "stop" || command === "pause" || command === "resume" || command === "loop" || command === "music" || command === "shuffle" || command === "seek" || command === "lyrics" || command === "queue" || command === "nightcore" || command === "bassboost" || command === "echo" || command === "vaporwave" || command === "3d" || command === "flanger" || command === "gate" || command === "haas" || command === "karaoke" || command === "reverse" || command === "volume" || command === "autoplay") {
      const sorry = new Discord.MessageEmbed()
        .setTitle(`:warning: Important Announcement`)
        .setDescription(`Hello there, Black Sheep is a multifunctional Bot as we all know , so it's obvious that it does so many tasks together. Recently it has grown at a higher speed than usual due to more people downloading discord and using it. That is why This Bot cannot provide lag-free music because of high ram usage.
So Music will be removed from the bot 

But ! We have developed a **brand new music only bot** with over **20+ filters** and **30+ music commands**. It will provide you **lag-free music** as it's a **fully dedicated** music only bot
If you were using Black Sheep for music only , then it's important that you **replace it with Muser**
It was a really tough decision but I think it's the best for all of us
[Muser's top.gg page](https://top.gg/bot/763418289689985035) | [Muser's Website](https://muser.pgamerx.com)`)
        .setColor("RED")
      msg.channel.send(sorry)
    }

    if (command === "rank" || command === "leaderboard" || command === "enablevel" || command === "disablelevel") {
      msg.channel.send(`Economy and Leveling has been removed from bot due to bad response and feedback `)
    }

if(command === "alexa"){
  if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`You don't have permission to run this command`)
  if(args[1] === "setup"){
    if(alexaboi) return message.channel.send(`There is already a channel set for this server! Delete it first using alex remove command`)

  let ch = msg.mentions.channels.first()
    if(!ch) return msg.channel.send(`No channel mentioned`)
    let channel = ch.id

    let newData = new alexainfo({
      GuildID: msg.guild.id,
      channel: channel
    })
    newData.save()

msg.channel.send(`Alright! ${ch} will be used for Alexa AI`)

  }
  else if(args[1] === "remove"){

    await userinfo.findOneAndRemove({
      GuildID: msg.guild.id
    })

message.channel.send(`Alright, Alexa disabled in this server`)

}
}


if (command === "nsfw-setup") {
  if(!beta.includes(msg.author.id))  return message.channel.send(`You aren't a beta tester!`)
  if (!msg.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`You don't have permission to run the command`)
  let embed = new Discord.MessageEmbed()
      .setTitle("Incorrect Usage")
      .setDescription("Correct usage is `nsfw-setup enable {Category}` Or `nsfw-setup disable {Category}` The Categories Are - ")
      .addField(`Neutral`, `Delets Neutral Images`)
      .addField(`Porn`, `Delets Porn Images`)
      .addField(`Hentai`, `Delets Hentai Images`)
      .addField(`Drawing`, `Delets Drawings`)
      .addField(`Sexy`, `Delets Sexy Images`)
      .setColor("RED")
  if (!args[1]) return message.channel.send(embed)
  if (args[1] === "enable") {
      if (!options.includes(args[2])) {
          let embed = new Discord.MessageEmbed()
              .setTitle("Incorrect Category")
              .setDescription(" The Only Valid Categories Are - ")
              .addField(`Neutral`, `Delets Neutral Images`)
              .addField(`Porn`, `Delets Porn Images`)
              .addField(`Hentai`, `Delets Hentai Images`)
              .addField(`Drawing`, `Delets Drawings`)
              .addField(`Sexy`, `Delets Sexy Images`)
              .setColor("RED")
          return message.channel.send(embed)
      }
      if (!args[2]) {
          let embed = new Discord.MessageEmbed()
              .setTitle("Incorrect Usage")
              .setDescription("Correct usage is `nsfw-setup enable {Category}` Or `nsfw-setup disable {Category}` The Categories Are - ")
              .addField(`Neutral`, `Delets Neutral Images`)
              .addField(`Porn`, `Delets Porn Images`)
              .addField(`Hentai`, `Delets Hentai Images`)
              .addField(`Drawing`, `Delets Drawings`)
              .addField(`Sexy`, `Delets Sexy Images`)
              .setColor("RED")
          return msg.channel.send(embed)
      }

      let option = args[2]
      if(!info){
          let newData = new setup({
              GuildID: msg.guild.id,
              probability: 100,
              types: []
          })
          newData.save()
      }
      let probability = info.probability
      if (!probability) probability = 100

      let okbro = info.types
      if (!okbro) okbro = []

      await okbro.push(option)
      if(!okbro.includes("Sexy")){
         await okbro.push("Sexy")
      }

      okbro = okbro.filter(function(item, pos) {
          return okbro.indexOf(item) == pos; 
      })

      await setup.findOneAndRemove({
          GuildID: msg.guild.id
      })

      let newData = new setup({
          GuildID: msg.guild.id,
          probability: probability,
          types: okbro
      })
      newData.save()
      message.channel.send(`Images which fall under ${args[2]} category will be now deleted`)
      if(!channel){
          message.channel.send("Also Please create a channel called `attachment-logs` so I can send Attachment logs there")
      }
  }else if(args[1] === "disable"){

      if (!options.includes(args[2])) {
          let embed = new Discord.MessageEmbed()
              .setTitle("Incorrect Category")
              .setDescription(" The Only Valid Categories Are - ")
              .addField(`Neutral`, `Delets Neutral Images`)
              .addField(`Porn`, `Delets Porn Images`)
              .addField(`Hentai`, `Delets Hentai Images`)
              .addField(`Drawing`, `Delets Drawings`)
              .addField(`Sexy`, `Delets Sexy Images`)
              .setColor("RED")
          return message.channel.send(embed)
      }
      if (!args[2]) {
          let embed = new Discord.MessageEmbed()
              .setTitle("Incorrect Usage")
              .setDescription("Correct usage is `nsfw-setup enable {Category}` Or `nsfw-setup disable {Category}` The Categories Are - ")
              .addField(`Neutral`, `Delets Neutral Images`)
              .addField(`Porn`, `Delets Porn Images`)
              .addField(`Hentai`, `Delets Hentai Images`)
              .addField(`Drawing`, `Delets Drawings`)
              .addField(`Sexy`, `Delets Sexy Images`)
              .setColor("RED")
          return msg.channel.send(embed)
      }
 
      let option = args[2]
      if(!info){
          let newData = new setup({
              GuildID: msg.guild.id,
              probability: 100,
              types: []
          })
          newData.save()
      }
      let probability = info.probability
      if (!probability) probability = 100

      let okbro = info.types


      
      const index = okbro.indexOf(option);
      if (index > -1) {
        await okbro.splice(index, 1);

        okbro = okbro.filter(function(item, pos) {
          return okbro.indexOf(item) == pos; 
      })

       
      }

      await setup.findOneAndRemove({
          GuildID: msg.guild.id
      })

      let newData = new setup({
          GuildID: msg.guild.id,
          probability: probability,
          types: okbro
      })
      newData.save()
        message.channel.send(`${option} category has now been disabled`)
                 
 
  }else if(args[1] === "threshold"){
    let embed = new Discord.MessageEmbed()
    .setTitle(`Incorrect Usage`)
    .setDescription(`You can only use Following options`)
    .addField(`nsfw-setup threshold low` , " Delets if Bot Is Very Very Very sure" )
    .addField(`nsfw-setup threshold normal` , " Delets if Bot Is Very Very sure" )
    .addField(`nsfw-setup threshold High [**Recommended**]` , " Delets if Bot Is Very sure" )
    .addField(`nsfw-setup threshold Strict [**Semi-Recommended**]` , " Delets if Bot Is a little bit sure" )
      let array = ["low" , "normal" , "high" , "strict"]
      if(!args[2]){ return message.channel.send(embed)      }
      let option = args[2].toLowerCase()
      if(!array.includes(option)) {
      let embed = new Discord.MessageEmbed()
      .setTitle(`Incorrect Usage`)
      .setDescription(`You can only use Following options`)
      .addField(`nsfw-setup threshold low` , " Delets if Bot Is Very Very Very sure" )
      .addField(`nsfw-setup threshold normal` , " Delets if Bot Is Very Very sure" )
      .addField(`nsfw-setup threshold High [**Recommended**]` , " Delets if Bot Is Very sure" )
      .addField(`nsfw-setup threshold Strict [**Semi-Recommended**]` , " Delets if Bot Is a little bit sure" )
      return message.channel.send(embed)
      }

      if(option === "low"){
          number = 3
      }              else  if(option === "normal"){
          number = 2
      }              else  if(option === "high"){
          number = 0.5
      }              else  if(option === "strict"){
          number = 0.3
      }

      let okbro = info.types
      if(!okbro) return message.channel.send("You have not selected any category! You need to do it first using `nsfw-setup enable`")
      if(!okbro.includes("Sexy")){
         await okbro.push("Sexy")
      }

      okbro = okbro.filter(function(item, pos) {
          return okbro.indexOf(item) == pos; 
      })
      await setup.findOneAndRemove({
          GuildID: msg.guild.id
      })

      let newData = new setup({
          GuildID: msg.guild.id,
          probability: number,
          types: okbro
      })
      newData.save()

      message.channel.send(`Threshold has been set to ${option}`)
  }


}




  } catch (err) {
    catchErr(err, msg)
  }
})
})
client.login(bot_token);














