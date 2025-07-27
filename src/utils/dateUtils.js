const config = require('../config');

class DateUtils {
    static getWeekRange() {
        const now = new Date();
        const startOfWeek = new Date(now);
        // 起動した日の週の月曜日を取得
        const dayOfWeek = now.getDay(); // 0=日曜日, 1=月曜日, ..., 6=土曜日
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 月曜日までの日数
        startOfWeek.setDate(now.getDate() - daysToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // 日曜日
        endOfWeek.setHours(23, 59, 59, 999);

        return { startOfWeek, endOfWeek };
    }

    static formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekday = config.app.weekdays[date.getDay()];

        return `${month}/${day}(${weekday})`;
    }

    static formatTime(date) {
        return date.toLocaleTimeString(config.app.locale, config.app.timeFormat);
    }

    static getTwentyFourHoursAgo() {
        const date = new Date();
        date.setHours(date.getHours() - 24);
        return date;
    }

    static isRecentEvent(event, minDate, maxDate) {
        const created = new Date(event.created || event.start.dateTime || event.start.date);
        return created >= minDate && created < maxDate;
    }
}

module.exports = DateUtils; 