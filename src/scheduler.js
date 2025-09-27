require('dotenv').config();
const PlayerService = require('./services/PlayerService');
const GoogleCalendarService = require('./services/GoogleCalendarService');
const DiscordService = require('./services/DiscordService');

class Scheduler {
    constructor() {
        this.playerService = new PlayerService();
        this.calendarService = new GoogleCalendarService();
        this.discordService = new DiscordService(this.playerService);
    }

    async sendWeeklySchedule() {
        const events = await this.calendarService.getWeekEvents();
        await this.discordService.sendWeeklySchedule(events);
    }

    async checkNewEvents() {
        const events = await this.calendarService.getWeekEvents();
        const newEvents = this.calendarService.getRecentEvents(events);
        await this.discordService.sendNewEvents(events, newEvents);
    }

    async run() {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 = 日曜日, 1 = 月曜日

            if (dayOfWeek === 1) {
                // 月曜日: 今週の予定を通知
                console.log('月曜日: 今週の予定を通知します');
                await this.sendWeeklySchedule();
            } else {
                // 火曜〜日曜: 予定確認
                console.log('火曜〜日曜: 予定確認を実行します');
                await this.checkNewEvents();
            }
        } catch (error) {
            console.error('Scheduler execution failed:', error);
            throw error;
        }
    }
}

// メイン実行
const scheduler = new Scheduler();

const mode = process.argv[2]; // コマンドライン引数

if (mode === 'weekly') {
    scheduler.sendWeeklySchedule().catch(error => {
        console.error('Application failed:', error);
        process.exit(1);
    });
} else if (mode === 'new') {
    scheduler.checkNewEvents().catch(error => {
        console.error('Application failed:', error);
        process.exit(1);
    });
} else {
    console.error('Usage: node src/scheduler.js [weekly|new]');
    process.exit(1);
} 