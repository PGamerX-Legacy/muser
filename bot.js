const fs = require("fs");
const db = require("quick.db");
const express = require("express");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const Discord = require("discord.js");
const userinfo = require("./models/user.js");
const { Client, Collection, Intents, DiscordAPIError } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const { AutoPoster } = require("topgg-autoposter");
const Topgg = require("@top-gg/sdk");
const ap = AutoPoster(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2MzQxODI4OTY4OTk4NTAzNSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA3Mzg4MjkwfQ._Afp-QSByh9LTyMtM7uvDShVNZR4DcXsdk7EUZxQADc",
  client
);
const app = express();
const webhook = new Topgg.Webhook("bruhboomer");

let timeouts = new Map();

app.listen(2000);
app.post(
  "/dblwebhook",
  webhook.listener(async (vote) => {
    const userdetail = await userinfo.findOne({
      UserID: vote.user,
    });

    if (!userdetail) {
      let newData = new userinfo({
        UserID: vote.user,
        voter: "yes",
      });
      newData.save();
    } else if (userdetail) {
      await userinfo.findOneAndRemove({
        UserID: vote.user,
      });
      let newData = new userinfo({
        voter: "yes",
        UserID: vote.user,
      });
      newData.save();
    }
    client.users.fetch(vote.user).then(async (user) => {
      const thanks2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Thanks For Voting! <:love:736194392305434704>")
        .setDescription(
          `Thanks for voting <:love:736194392305434704>:. You can now access "FILTER" commands in the bot for next 1 week, More perks soon! `
        );
      user.send({ embeds: [thanks2] });
    });

    client.channels.fetch("783581253001150494").then(async (channel) => {
      let user_info = await client.users.fetch(vote.user);
      let embed = new Discord.MessageEmbed()
        .setTitle(`New Voter <:love:736194392305434704>`)
        .setDescription(
          `${user_info.username}#${user_info.discriminator} just voted for [Muser](https://top.gg/bot/763418289689985035). You can vote too at [Top.GG](https://top.gg/bot/763418289689985035/vote)`
        )
        .setColor("RED")
        .setFooter(`Created by PGamerX`);
      channel.send({ embeds: [embed] });
      //channel.send({ embeds: [embed] });
    });
  })
);

ap.on("posted", () => {
  console.log("Posted stats to Top.gg!");
});

client.scommands = new Collection();
const commandFiles = fs
  .readdirSync("./scommands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./scommands/${file}`);
  client.scommands.set(command.data.name, command);
}

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const distube = new DisTube(client, {
  searchSongs: 10,
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnStop: true,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});
client.distube = distube;
client.premium_distube = client.distube;

client.on("voiceStateUpdate", async (oldState, newState) => {
  const queue = await client.distube.getQueue(oldState);
  if (!queue) return;
  const channel = await queue.textChannel;
  const premium = await db.get(`PREMIUM_${oldState.guild.id}`);
  if (premium == "yes") return;
  if (
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    newState.channel
  )
    return;

  if (oldState.channel.members.size > 1) {
    if (timeouts.get(oldState.guild.id)) {
      clearTimeout(timeouts.get(oldState.guild.id));
      timeouts.delete(oldState.guild.id);
    }
  } else {
    if (!timeouts.get(oldState.guild.id)) {
      // check if there is already a timeout
      timeouts.set(
        oldState.guild.id,
        setTimeout(async () => {
          const embed = new Discord.MessageEmbed()
            .setTitle(`Channel empty`)
            .setDescription(
              `If you have premium, then I won't leave the VC, but if you don't then I will because noone is there in the VC. [Check out Premium](https://muser.pgamerx.com/premium)`
            )
            .setColor("RED");
          await channel.send({ embeds: [embed] });
          await queue.stop();
          timeouts.delete(oldState.guild.id);
        }, 120000)
      );
    }
  }
});

/*
client.on('voiceStateUpdate',  async (oldState, newState) => {
  if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;
   const premium_status = await db.get(`PREMIUM_${oldState.guild.id}`)
   if(premium_status == "yes") return console.log(`Premium guild boii`)
    if (!oldState.channel.members.size - 1) 
    console.log("Not premium, leaving")
    setTimeout(() => { 
      if (!oldState.channel.members.size - 1) 
         oldState.disconnect(); 
         console.log("leaving")
     }, 120000); 
});
*/
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://muser:muser@cluster0.shgav.mongodb.net/prefix?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

client.once("ready", () => {
  client.user.setPresence({
    activities: [
      {
        name: `in ${client.guilds.cache.size} servers | Rip Groovy and Rythm o7`,
      },
    ],
    status: "online",
  });
  setInterval(() => {
    client.user.setPresence({
      activities: [
        {
          name: `in ${client.guilds.cache.size} servers | Rip Groovy and Rythm o7`,
        },
      ],
      status: "online",
    });
  }, 1800000);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(".eval")) {
    const owners_id = ["587663056046391302"];
    if (!owners_id.includes(message.author.id)) return;
    const args2 = message.content.split(" ").slice(1);

    const clean = (text) => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };

    try {
      const code = args2.join(" ");
      let evaled = eval(code);

      message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
  if (message.author.bot) return;
  if (message.mentions.has(client.user) && message.mentions.everyone == false) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Only usable through Slash commands`)
      .setDescription(
        `
Hey there, I have just been completely renovated to be compaitable with slash commands.

> Cannot see my slash commands? or getting \`Invalid interaction\`?
Please ask the Admin Team/Manager team or Owner of this server to re-invite me using [This Link](https://discord.com/oauth2/authorize?client_id=763418289689985035&scope=+applications.commands+bot&permissions=37084480) so I can get permission to create slash commands in this server.
`
      );
    message.reply({ embeds: [embed] });
  }
});

// const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube
  .on("playSong", (queue, song) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Playing : ${song.name} - ${song.formattedDuration}`)
      .setDescription(
        `
Filter : ${queue.filter || "Off"}
Loop :  ${
          queue.repeatMode
            ? queue.repeatMode == 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`
      )
      .addField(
        `Requested by`,
        `${song.member.user.username}#${song.member.user.discriminator}`
      )
      .setColor("RED")
      .setThumbnail(song.thumbnail);
    queue.textChannel.send({ embeds: [embed] });
  })
  .on("addSong", (queue, song) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Added : ${song.name} - ${song.formattedDuration}`)
      .setDescription(
        `
Filter : ${queue.filter || "Off"}
Loop :  ${
          queue.repeatMode
            ? queue.repeatMode == 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`
      )
      .addField(
        `Requested by`,
        `${song.member.user.username}#${song.member.user.discriminator}`
      )
      .setColor("RED")
      .setThumbnail(song.thumbnail);
    queue.textChannel.send({ embeds: [embed] });
  })

  .on("playList", (queue, playlist, song) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(
        `Playlist Playing: ${playlist.name} - ${playlist.songs.length} songs`
      )
      .setDescription(
        `
Filter : ${queue.filter || "Off"}
Loop :  ${
          queue.repeatMode
            ? queue.repeatMode == 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`
      )
      .addField(
        `Requested by`,
        `${song.member.user.username}#${song.member.user.discriminator}`
      )
      .setColor("RED")
      .setThumbnail(song.thumbnail);
    queue.textChannel.send({ embeds: [embed] });
  })
  .on("addList", (queue, playlist) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(
        `Playlist Added : ${playlist.name} - ${playlist.songs.length} songs`
      )
      .setDescription(
        `
Filter : ${queue.filter || "Off"}
Loop :  ${
          queue.repeatMode
            ? queue.repeatMode == 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }
Autoplay : ${queue.autoplay ? "On" : "Off"}
Volume : ${queue.volume}`
      )
      .addField(
        `Requested by`,
        `${playlist.member.user.username}#${playlist.member.user.discriminator}`
      )
      .setColor("RED")
      .setThumbnail(playlist.thumbnail);
    queue.textChannel.send({ embeds: [embed] });
  })
  // DisTubeOptions.searchSongs = true
  .on("searchResult", (result) => {
    let i = 0;
    queue.textChannel.send(
      `**Choose an option from below**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
    );
  })
  // DisTubeOptions.searchSongs = true
  .on("searchCancel", (message) => queue.textChannel.send(`Searching canceled`))
  .on("error", (channel, error) =>
    channel.send(` An error encountered: ${error}`)
  )
  .on("empty", (queue) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Channel empty`)
      .setDescription(
        `If you have premium, then I won't leave the VC, but if you don't then I will because noone is there in the VC. [Check out Premium](https://muser.pgamerx.com/premium)`
      )
      .setColor("RED");

    queue.textChannel.send({ embeds: [embed] });
  });

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    try {
      await client.scommands.get(interaction.commandName).execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(token);
