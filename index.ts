require("dotenv").config();
const bot_token = process.env.BOTOKEN;
const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./bot.js", {
  token: bot_token,
  totalShards: 0,
});
manager.on("shardCreate", (shard: { id: any }) =>
  console.log(`Launched shard ${shard.id}`)
);
manager.spawn();
