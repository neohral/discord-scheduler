require('dotenv').config();

const config = {
    discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL,
        webhookUsername: process.env.DISCORD_WEBHOOK_USERNAME,
        webhookAvatarUrl: process.env.DISCORD_WEBHOOK_AVATAR_URL,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        calendarId: process.env.GOOGLE_CALENDAR_ID,
    },
    app: {
        playerConfigPath: './src/player.yaml',
        locale: 'ja-JP',
        timeFormat: { hour: '2-digit', minute: '2-digit' },
        weekdays: ['日', '月', '火', '水', '木', '金', '土'],
        colors: {
            weekly: 0x0099FF,
            new: 0x00FF00,
        },
        defaultPlayer: {
            name: "カレンダー通知",
            iconList: [
                {
                    parent: 0,
                    url: "https://i.imgur.com/zmiL1xT.jpeg",
                    rarity: "【R】"
                }
            ]
        }
    }
};

// 必須環境変数の検証
const requiredEnvVars = [
    'DISCORD_WEBHOOK_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_CALENDAR_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

module.exports = config; 