import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
  if(interaction.commandName === 'kickme'){
    const member = interaction.member;

    if(member.voice.channel){
      await member.voice.disconnect();
      await interaction.reply(`remove ${member.displayName} from ${member.voice.channel.name}`)
    }else{
      await interaction.reply("You not in voice channel!");
    }
  }
});

client.login(TOKEN);