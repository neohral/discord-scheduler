const { WebhookClient, EmbedBuilder } = require('discord.js');
const config = require('../config');
const DateUtils = require('../utils/dateUtils');

class DiscordService {
    constructor(playerService) {
        this.webhook = new WebhookClient({ url: config.discord.webhookUrl });
        this.playerService = playerService;
    }

    async sendMessage(content) {
        try {
            const randomPlayer = this.playerService.getRandomPlayer();

            await this.webhook.send({
                ...content,
                username: randomPlayer.name,
                avatarURL: randomPlayer.avatar
            });
        } catch (error) {
            console.error('Error sending Discord message:', error);
            throw error;
        }
    }

    createWeeklyScheduleEmbed(eventsByDay) {
        const embed = new EmbedBuilder()
            .setTitle('📅 今週の予定')
            .setColor(config.app.colors.weekly)
            .setTimestamp();

        for (const event of eventsByDay) {
            const startTime = new Date(event.start.dateTime || event.start.date);
            const timeStr = event.start.dateTime ? DateUtils.formatTime(startTime) : '';
            const dateStr = DateUtils.formatDate(startTime);

            embed.addFields({
                name: `**${dateStr} ${timeStr}**`,
                value: `・${event.summary}`,
                inline: false
            });
        }

        return embed;
    }

    createNewEventsEmbed(events, newEvents) {
        const embed = new EmbedBuilder()
            .setTitle('📅 今週の予定(追加)')
            .setColor(config.app.colors.new)
            .setTimestamp();

        for (const event of events) {
            const startTime = new Date(event.start.dateTime || event.start.date);
            const timeStr = event.start.dateTime ? DateUtils.formatTime(startTime) : '';
            const dateStr = DateUtils.formatDate(startTime);

            const name = !newEvents.includes(event) ? `**${dateStr} ${timeStr}** 🆕` : `**${dateStr} ${timeStr}**`

            embed.addFields({
                name: name,
                value: `・${event.summary}`,
                inline: false
            });
        }

        return embed;
    }

    async sendWeeklySchedule(eventsByDay) {
        if (Object.keys(eventsByDay).length === 0) {
            await this.sendMessage('📅 **今週の予定**\n今週の予定はありません。');
            return;
        }

        const embed = this.createWeeklyScheduleEmbed(eventsByDay);
        await this.sendMessage({ embeds: [embed] });
    }

    async sendNewEvents(events, newEvents) {
        if (newEvents.length === 0) {
            console.log('24時間以内に追加された新しい予定はありません');
            return;
        }

        console.log(`${newEvents.length}件の新しい予定を検出しました（24時間以内）`);
        const embed = this.createNewEventsEmbed(events, newEvents);
        await this.sendMessage({ embeds: [embed] });
    }
}

module.exports = DiscordService; 