const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const moment = require('moment-timezone');
const dotenv = require('dotenv');

dotenv.config();

const voicekickCommand = require('./command/voicekick')
const scheduledDisconnects = new Map();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'kickme') {
    const member = interaction.member;

    if (member.voice.channel) {
      await member.voice.disconnect();
      await interaction.reply(`remove ${member.displayName} from ${member.voice.channel.name}`)
    } else {
      await interaction.reply("You not in voice channel!");
    }
  }

  if (interaction.commandName === 'voicekick') {
   await voicekickCommand.execute(interaction,scheduledDisconnects);
  }

});

client.login(process.env.DISCORD_TOKEN);