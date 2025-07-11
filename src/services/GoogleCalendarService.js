const { google } = require('googleapis');
const config = require('../config');
const DateUtils = require('../utils/dateUtils');

class GoogleCalendarService {
    constructor() {
        this.calendar = null;
        this.setupCalendar();
    }

    setupCalendar() {
        const oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            'http://localhost'
        );

        oauth2Client.setCredentials({
            refresh_token: config.google.refreshToken,
        });

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    async getWeekEvents() {
        const { startOfWeek, endOfWeek } = DateUtils.getWeekRange();

        try {
            const response = await this.calendar.events.list({
                calendarId: config.google.calendarId,
                timeMin: startOfWeek.toISOString(),
                timeMax: endOfWeek.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return [];
        }
    }

    getRecentEvents(events, daysAgo = 1) {
        const maxDate = new Date();
        maxDate.setHours(0, 0, 0, 0);
        const minDate = new Date(maxDate);
        minDate.setDate(minDate.getDate() - daysAgo);
        
        return events.filter(event => DateUtils.isRecentEvent(event, minDate, maxDate));
    }
}

module.exports = GoogleCalendarService; 