const { REST, Routes } = require('discord.js')
const dotenv = require('dotenv');

dotenv.config();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'voicekick',
    description: 'Disconnect a user from the voice channel at a specified time.',
    options: [
      {
        name: 'time',
        type: 3, //string type
        description: 'The time to disconnect the user (e.g. "4 AM", "16:00")',
        required: true,
      },
    ],
  },

];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async()=>{try {
  console.log('Started refreshing application (/) commands.');
 
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}})();
