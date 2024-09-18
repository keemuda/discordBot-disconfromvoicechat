const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const moment = require('moment-timezone');
const dotenv = require('dotenv');

dotenv.config();

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
    const timeString = interaction.options.getString('time');
    const timezone = 'Asia/Bangkok';

    let scheduledTime;
    try {
      scheduledTime = moment.tz(timeString, ['h A', 'h:mm A', 'HH:mm'], timezone);
      if (!scheduledTime.isValid()) {
        await interaction.reply('Please enter a valid time format. Supported formats are: "4 AM", "4:30 PM", "16:00".');
        return;
      }
    } catch (err) {
      await interaction.reply('Please enter a valid time format. Supported formats are: "4 AM", "4:30 PM", "16:00".');
      return;
    }

    const now = moment.tz(timezone);
    if (scheduledTime.isBefore(now)) {
      scheduledTime.add(1, 'day');
    }
    const waitTime = scheduledTime.diff(now)
    await interaction.reply(`Scheduled to disconnect ${interaction.member.displayName} at:${timeString}`);

    setTimeout(async () => {
      const voiceChannel = interaction.member.voice.channel;
      if (voiceChannel) {
        await interaction.member.voice.disconnect();
        await interaction.channel.send(`Disconnected ${interaction.member.displayName} from the voice channel.`);
      } else {
        await interaction.channel.send(`${interaction.member.displayName}, you are no longer in the voice channel.`);
      }
    }, waitTime);

  }

});

client.login(process.env.DISCORD_TOKEN);