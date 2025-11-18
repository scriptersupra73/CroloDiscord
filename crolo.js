require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name === 'general');
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`Welcome ${member.user.username} to /moonshine`)
    .setDescription(`Have a nice stay!\nYou're member #${member.guild.memberCount}`)
    .setImage('https://i.imgur.com/awucUfs.png')
    .setColor(0x9370DB);

  channel.send({ embeds: [embed] });
});

console.log('Token:', process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);
