const { ShardingManager } = require('discord.js');
require("dotenv").config();
let token = process.env.BOTOKEN
const manager = new ShardingManager('./bot.js', { token: token, totalShards: 0 });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();