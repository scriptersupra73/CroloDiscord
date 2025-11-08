// index.js
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
  const channel = member.guild.systemChannel || member.guild.channels.cache.find(
    ch => ch.type === 0 && ch.permissionsFor(member.guild.members.me).has('SendMessages')
  );

  if (!channel) return;

  const welcomeEmbed = new EmbedBuilder()
    .setTitle('Welcome to the #1 MM crolo!')
    .setImage('https://i.imgur.com/4tjImNm.png')
    .setColor(0x2f3136); // dark gray, tweak as needed

  channel.send({ content: `<@${member.id}>`, embeds: [welcomeEmbed] });
});

client.login(process.env.TOKEN);
