const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Client, GatewayIntentBits, EmbedBuilder, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Store registered commands for later use
const commands = [];

// Define the embed command
const embedCommand = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create an embed message')
  .addStringOption(option =>
    option.setName('title')
      .setDescription('Title of the embed')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Description of the embed')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('color')
      .setDescription('Color of the embed (hex code)')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('Image URL for the embed')
      .setRequired(false));

commands.push(embedCommand.toJSON());

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    const channelId = '1436529752725786686';
    const channel = member.guild.channels.cache.get(channelId);

    // Check if channel exists and bot has permission to send messages
    if (!channel || !channel.permissionsFor(member.guild.members.me).has('SendMessages')) {
      console.log('Cannot send message to channel or channel does not exist');
      return;
    }

    // Get member count
    const memberCount = member.guild.memberCount;

    const welcomeEmbed = new EmbedBuilder()
      .setTitle(`Welcome ${member.displayName} to Crolo MM #1 MM service`)
      .setDescription(`We're glad to have you here!\n\n**Member #${memberCount}**`)
      .setImage('https://i.imgur.com/4tjImNm.png')
      .setColor(0x2f3136) // dark gray
      .setTimestamp();

    await channel.send({ embeds: [welcomeEmbed] });
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }
});

// Handle the embed command
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'embed') {
    // Check if user has a specific role (you can customize this)
    const friendRoleId = 'ROLE_ID_HERE'; // Replace with actual role ID
    
    // Check if user has the role (if you want to restrict usage)
    // const hasRole = interaction.member.roles.cache.has(friendRoleId);
    // For now, let's allow anyone to use it as you requested
    
    try {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color');
      const image = interaction.options.getString('image');

      const embed = new EmbedBuilder();
      
      if (title) embed.setTitle(title);
      if (description) embed.setDescription(description);
      if (color) {
        // Validate and convert color
        const hexColor = color.startsWith('#') ? color.slice(1) : color;
        if (/^[0-9A-F]{6}$/i.test(hexColor)) {
          embed.setColor(parseInt(hexColor, 16));
        } else {
          // Default color if invalid
          embed.setColor(0x2f3136);
        }
      } else {
        embed.setColor(0x2f3136); // Default color
      }
      
      if (image) {
        // Basic URL validation
        try {
          new URL(image);
          embed.setImage(image);
        } catch (err) {
          // If invalid URL, don't add image
        }
      }
      
      // Add footer with who created the embed
      embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
      embed.setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating embed:', error);
      await interaction.reply({ 
        content: 'There was an error while executing this command!', 
        ephemeral: true 
      });
    }
  }
});

// Handle login errors
client.login(process.env.TOKEN).catch(error => {
  console.error('Failed to login:', error);
});
