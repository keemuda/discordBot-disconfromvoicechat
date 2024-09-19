const moment = require('moment-timezone');

module.exports = {
    async execute(interaction, scheduledDisconnects) {
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

        if (scheduledDisconnects.has(interaction.member.id)) {
            clearTimeout(scheduledDisconnects.get(interaction.member.id));
            await interaction.reply(`Previous disconnect time canceled. New time scheduled at ${timeString}.`);
        } else {
            await interaction.reply(`Scheduled to disconnect ${interaction.member.displayName} at ${timeString}.`);
        }

        const timeoutID = setTimeout(async () => {
            const voiceChannel = interaction.member.voice.channel;
            if (voiceChannel) {
                await interaction.member.voice.disconnect();
                await interaction.channel.send(`Disconnected ${interaction.member.displayName} from the voice channel.`);
            } else {
                await interaction.channel.send(`${interaction.member.displayName}, you are no longer in the voice channel.`);
            }
            scheduledDisconnects.delete(interaction.member.id);
        }, waitTime);

        scheduledDisconnects.set(interaction.member.id, timeoutID)
    }
}
