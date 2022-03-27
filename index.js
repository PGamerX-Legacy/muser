require("dotenv").config();
const token = process.env.BOTOKEN;

const Topgg = require("@top-gg/sdk");
const express = require("express");

const app = express();
const webhook = new Topgg.Webhook("MuserIsAnAmazingBot");

const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", { token: token });

const userinfo = require("./models/user.js");

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

// Get the client from the manager

manager.spawn();

app.post(
  "/muserTOPGG",
  webhook.listener((vote) => {
    console.log(vote);
    // vote will be your vote object, e.g
    console.log(
      `${vote.user} just voted and I sure hope this works because if not, I will destroy the server.`
    );

    const newData = new userinfo({
      UserID: "${vote.user}",
      voter: true,
    });
    await newData.save();

    // Trying to eval now
    manager.broadcastEval(
      `
     const user = this.users.fetch("${vote.user}").then(user => {
     user.send("Thank you so much for voting! You can now access the filter command!");
     })
     `,
      { shard: 0 }
    );
    // You can also throw an error to the listener callback in order to resend the webhook after a few seconds
  })
);

app.listen(0911);
