// noinspection DuplicatedCode,JSCheckFunctionSignatures
// noinspection JSUnusedAssignment

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                         Importing packages and credentials | | | | | | | | | |
| | | | | | | |
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
require("dotenv").config();

const token = process.env.BOTOKEN;
const logdnakey = process.env.LOGDNAKEY;
const topGGAuth = process.env.TOPGG_AUTH;
const cronitorID = process.env.CRONITORID;
const topGGToken = process.env.TOPGG_TOKEN;
/////////////////////////////////////////////////////////
const logdna = require("logdna");
const options = {
  app: "muser",
  level: "debug",
};
const logger = logdna.createLogger(logdnakey, options);
logger.log("Hello world!", "info");
const cronitor = require("cronitor")(cronitorID);
const monitor = new cronitor.Monitor("Muser");
const userinfo = require("./models/user.js");
/////////////////////////////////////////////////////////
const fs = require("fs");
const db = require("quick.db");
const Discord = require("discord.js");
const { Client, Collection, Intents, DiscordAPIError } = require("discord.js");
const { SoundCloudPlugin } = require("@distube/soundcloud");
/////////////////////////////////////////////////////////
let timeouts = new Map();

logger.info("All packages imported. Credentials set.");
console.log("All packages imported. Credentials set.");

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
| | | | | | | | | |  All the ugly constants related to DJS | | | | | | | | | | |
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
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
/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        The code
that makes voting work
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

/*/////////////////////////////////////////////////////////////
| | | | | | | | | | Custom Functions | | | | | | | | | | | |
*/ /////////////////////////////////////////////////////////////

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        This is
(supposed to be) the command parser
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
client.scommands = new Collection();
const commandFiles = fs
  .readdirSync("./scommands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./scommands/${file}`);
  client.scommands.set(command.data.name, command);
}
/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                DisTube stuff
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
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
// noinspection JSUnresolvedVariable
client.on("voiceStateUpdate", async (oldState, newState) => {
  const queue = await client.distube.getQueue(oldState);
  if (!queue) return;
  const channel = await queue.textChannel;
  const premium = await db.get(`PREMIUM_${oldState.guild.id}`);
  if (premium === "yes") return;
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
              `If you have premium, then I won't leave the VC, but if you don't then I will because no one is there in the VC. [Check out Premium for just 2.99$](https://muser.pgamerx.com/premium)`
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
  if (oldState.channelID !==  oldState.guild.me.voice.channelID ||
newState.channel) return; const premium_status = await
db.get(`PREMIUM_${oldState.guild.id}`) if(premium_status == "yes") return
console.log(`Premium guild boii`) if (!oldState.channel.members.size - 1)
    console.log("Not premium, leaving")
    setTimeout(() => {
      if (!oldState.channel.members.size - 1)
         oldState.disconnect();
         console.log("leaving")
     }, 120000);
});
////LMAO CODE VERSIONING BE LIKE
// ^ Peipr adding comments be like ~PG
*/
const mongoose = require("mongoose");
const dbURI = process.env.DBURI;

// noinspection JSCheckFunctionSignatures
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("owo did it work");
  });

// noinspection JSCheckFunctionSignatures

/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                        Startup function
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
client.once("ready", () => {
  client.shard.fetchClientValues("guilds.cache.size").then((results) => {
    client.shard
      .broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      )
      .then((results2) => {
        // logger.info("New bot instance: complete");
        monitor.ping({ message: `New instance`, state: "complete" });
        client.user.setPresence({
          activities: [
            {
              name: `with ${results2.reduce(
                (acc, memberCount) => acc + memberCount,
                0
              )} users | /help`,
            },
          ],
          status: "online",
        });
        setInterval(() => {
          client.user.setPresence({
            activities: [
              {
                name: `music in ${results.reduce(
                  (acc, guildCount) => acc + guildCount,
                  0
                )} servers | /help`,
              },
            ],
            status: "online",
          });
        }, 1800000);
      });
  });
});
/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        When the
bot discovers a new message
/////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(".eval")) {
    const owners_id = [
      "587663056046391302" /*PGamerX*/,
      "707512325740953690" /*Luckie*/,
      "460511909435932672" /*Peipr*/,
    ];
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

      // noinspection JSUnresolvedFunction
      message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
      // noinspection JSUnresolvedFunction
      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      // noinspection JSUnresolvedFunction
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
  if (message.author.bot) return;
  if (
    message.mentions.has(client.user) &&
    message.mentions.everyone === false
  ) {
    const embed = new Discord.MessageEmbed().setTitle(
      `Only usable through Slash commands`
    ).setDescription(`
Hey there, I have just been completely renovated to be compatible with slash commands.

> Cannot see my slash commands? or getting \`Invalid interaction\`?
Please ask a server administrator to re-invite me using [This Link](https://discord.com/oauth2/authorize?client_id=763418289689985035&scope=+applications.commands+bot&permissions=37084480) so I can get permission to create slash commands in this server.
`);
    message.reply({ embeds: [embed] });
  }
});

// const status = (queue) => `Volume: \`${queue.volume}%\` | Filter:
// \`${queue.filters || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode
// == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ?
// "On" : "Off"}\``;
// noinspection JSUnresolvedVariable
client.distube
  .on("playSong", (queue, song) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Playing: ${song.name} - ${song.formattedDuration}`)
      .setDescription(
        `
Filter : ${queue.filter || "Off"}
Loop :  ${
          queue.repeatMode
            ? queue.repeatMode === 2
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
            ? queue.repeatMode === 2
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
            ? queue.repeatMode === 2
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
            ? queue.repeatMode === 2
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
    // noinspection JSUnresolvedVariable
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
        `If you have premium, then I won't leave the VC, but if you don't then I will because no one is there in the VC. [Check out Premium](https://muser.pgamerx.com/premium)`
      )
      .setColor("RED");

    queue.textChannel.send({ embeds: [embed] });
  });

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    try {
      // noinspection JSUnresolvedVariable
      monitor.ping({
        message: `Interaction name: ${interaction.commandName}  \n Requested by: ${interaction.member} \n Requested in guild: ${interaction.guildId}`,
        state: "run",
        series: interaction.id,
      });
      // noinspection JSUnresolvedVariable
      await client.scommands.get(interaction.commandName).execute(interaction);
      let intr = JSON.stringify(interaction);
      // noinspection JSUnresolvedVariable
      monitor.ping({
        message: `Interaction successful: ${interaction.commandName}  \n Requested by: ${interaction.member} \n Raw JSON: ${intr}`,
        state: "complete",
        series: interaction.id,
      });
    } catch (error) {
      console.error(error);
      let intr = JSON.stringify(interaction);
      // noinspection JSUnresolvedVariable
      monitor.ping({
        message: `Interaction ${interaction.commandName} failed \n Error: ${error} \n Raw JSON: ${intr}`,
        state: "fail",
        series: interaction.id,
      });
      // noinspection JSUnresolvedVariable
      logger.error(
        `Interaction ${interaction.commandName} failed \n Error: ${error} \n Raw JSON: ${intr}`
      );
    }
  }
});

client.login(token);
