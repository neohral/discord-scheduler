const { DateUtils } = require('../src/utils');

describe('DateUtils', () => {
    describe('formatDate', () => {
        test('should format date correctly', () => {
            const date = new Date('2024-01-15'); // 月曜日
            const formatted = DateUtils.formatDate(date);
            expect(formatted).toBe('01/15(月)');
        });

        test('should handle different weekdays', () => {
            const sunday = new Date('2024-01-14'); // 日曜日
            const formatted = DateUtils.formatDate(sunday);
            expect(formatted).toBe('01/14(日)');
        });
    });

    describe('getDayName', () => {
        test('should return correct day name', () => {
            const monday = new Date('2024-01-15'); // 月曜日
            const dayName = DateUtils.getDayName(monday);
            expect(dayName).toBe('月曜日');
        });

        test('should handle Sunday correctly', () => {
            const sunday = new Date('2024-01-14'); // 日曜日
            const dayName = DateUtils.getDayName(sunday);
            expect(dayName).toBe('日曜日');
        });
    });

    describe('getWeekRange', () => {
        test('should return correct week range', () => {
            const { startOfWeek, endOfWeek } = DateUtils.getWeekRange();

            expect(startOfWeek.getDay()).toBe(1); // 月曜日
            expect(endOfWeek.getDay()).toBe(0); // 日曜日

            // 開始時刻が00:00:00であることを確認
            expect(startOfWeek.getHours()).toBe(0);
            expect(startOfWeek.getMinutes()).toBe(0);
            expect(startOfWeek.getSeconds()).toBe(0);

            // 終了時刻が23:59:59であることを確認
            expect(endOfWeek.getHours()).toBe(23);
            expect(endOfWeek.getMinutes()).toBe(59);
            expect(endOfWeek.getSeconds()).toBe(59);
        });
    });
}); 