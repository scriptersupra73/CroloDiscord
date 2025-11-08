const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  const channelId = '1436529752725786686';
  const channel = member.guild.channels.cache.get(channelId);

  if (!channel || !channel.permissionsFor(member.guild.members.me).has('SendMessages')) return;

  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`Welcome ${member.displayName} to Crolo MM #1 MM service`)
    .setImage('https://i.imgur.com/4tjImNm.png')
    .setColor(0x2f3136); // dark gray

  channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.TOKEN);
