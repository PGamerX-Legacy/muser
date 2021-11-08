const { ShardingManager } = require('discord.js');
require('dotenv').config()
const manager = new ShardingManager('./bot.js', { token: 'NzYzNDE4Mjg5Njg5OTg1MDM1.X33arw.9uhE1o9JJj55Co79467U1gYwPz0', totalShards: 0 });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();