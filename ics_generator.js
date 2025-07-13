// ICS Generator for Vas3k Camp 2025 Schedule
// Generates iCalendar files with emoji colorization by activity type

const fs = require('fs');
const path = require('path');

// Track type to emoji mapping for colorization
const TRACK_EMOJIS = {
    '✨ Общая активность': '⭐',
    '🧠 Geek Zone': '🤓',
    '🌿 Hobby Grove': '🎨',
    '🏃‍♂️ Active Arena': '🏃‍♂️',
    '💬 Soft Skills Hub': '💬',
    'default': '📅'
};

// Additional emoji mapping for specific activity types
const ACTIVITY_EMOJIS = {
    'welcome': '👋',
    'quiz': '🧠',
    'workshop': '🛠️',
    'talk': '🎤',
    'networking': '🤝',
    'sport': '⚽',
    'party': '🎉',
    'food': '🍽️',
    'keynote': '📢',
    'default': '📝'
};

class ICSGenerator {
    constructor(scheduleData) {
        this.scheduleData = scheduleData;
        this.places = scheduleData.places || [];
    }

    // Convert date and time to ICS format
    formatDateTimeForICS(dateString, timeString) {
        const date = new Date(dateString);
        const [hours, minutes] = timeString.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        
        // Format as YYYYMMDDTHHMMSS
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}T${hour}${min}00`;
    }

    // Get emoji for activity based on track and title
    getActivityEmoji(activity) {
        const title = activity.title?.toLowerCase() || '';
        const track = activity.track || '';
        
        // Check for specific activity types first
        if (title.includes('welcome') || title.includes('добро пожаловать')) return '👋';
        if (title.includes('quiz') || title.includes('квиз')) return '🧠';
        if (title.includes('workshop') || title.includes('воркшоп')) return '🛠️';
        if (title.includes('keynote') || title.includes('открытие')) return '📢';
        if (title.includes('networking') || title.includes('нетворкинг')) return '🤝';
        if (title.includes('party') || title.includes('вечеринка')) return '🎉';
        if (title.includes('dj') || title.includes('диджей')) return '🎵';
        if (title.includes('sport') || title.includes('спорт')) return '⚽';
        if (title.includes('food') || title.includes('еда')) return '🍽️';
        
        // Fall back to track-based emoji
        return TRACK_EMOJIS[track] || TRACK_EMOJIS.default;
    }

    // Get location name from place ID
    getLocationName(placeId) {
        const place = this.places.find(p => p.id === placeId);
        return place ? place.title : placeId || 'TBD';
    }

    // Escape special characters for ICS format
    escapeICSText(text) {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '');
    }

    // Generate individual event ICS content
    generateEvent(activity, index) {
        const emoji = this.getActivityEmoji(activity);
        const title = `${emoji} ${activity.title}`;
        const startTime = this.formatDateTimeForICS(activity.date, activity.timeStart);
        const endTime = this.formatDateTimeForICS(activity.date, activity.timeEnd);
        const location = this.getLocationName(activity.placeId);
        const description = this.buildEventDescription(activity);
        const uid = `vas3k-camp-${activity.date}-${index}@vas3k.camp`;
        
        return [
            'BEGIN:VEVENT',
            `DTSTART:${startTime}`,
            `DTEND:${endTime}`,
            `SUMMARY:${this.escapeICSText(title)}`,
            `DESCRIPTION:${this.escapeICSText(description)}`,
            `LOCATION:${this.escapeICSText(location)}`,
            `UID:${uid}`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
            activity.author ? `ORGANIZER:CN=${this.escapeICSText(activity.author)}` : '',
            activity.track ? `CATEGORIES:${this.escapeICSText(activity.track)}` : '',
            activity.private ? 'CLASS:PRIVATE' : 'CLASS:PUBLIC',
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            'END:VEVENT'
        ].filter(line => line).join('\r\n');
    }

    // Build detailed event description
    buildEventDescription(activity) {
        let description = '';
        
        if (activity.track) {
            description += `Трек: ${activity.track}\\n\\n`;
        }
        
        if (activity.description) {
            description += `${activity.description}\\n\\n`;
        }
        
        if (activity.author) {
            description += `Автор: ${activity.author}\\n`;
        }
        
        if (activity.authorUrl) {
            description += `Профиль: ${activity.authorUrl}\\n`;
        }
        
        description += `\\nВремя: ${activity.timeStart} - ${activity.timeEnd}`;
        description += `\\nДень: ${activity.dayName}`;
        
        return description;
    }

    // Generate complete ICS file
    generateICS() {
        const activities = this.scheduleData.activities || [];
        const calendarName = 'Vas3k Camp 2025 📅';
        
        const header = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Vas3k Camp//Camp Schedule//EN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${calendarName}`,
            'X-WR-CALDESC:Расписание мероприятий Vas3k Camp 2025 с эмодзи по типам активности',
            'X-WR-TIMEZONE:Europe/Belgrade',
            'CALSCALE:GREGORIAN',
            'BEGIN:VTIMEZONE',
            'TZID:Europe/Belgrade',
            'BEGIN:STANDARD',
            'DTSTART:20241027T030000',
            'TZOFFSETFROM:+0200',
            'TZOFFSETTO:+0100',
            'TZNAME:CET',
            'END:STANDARD',
            'BEGIN:DAYLIGHT',
            'DTSTART:20250330T020000',
            'TZOFFSETFROM:+0100',
            'TZOFFSETTO:+0200',
            'TZNAME:CEST',
            'END:DAYLIGHT',
            'END:VTIMEZONE'
        ].join('\r\n');
        
        const events = activities.map((activity, index) => this.generateEvent(activity, index));
        
        const footer = 'END:VCALENDAR';
        
        return [header, ...events, footer].join('\r\n');
    }

    // Generate track-specific ICS files
    generateTrackICS(track) {
        const activities = this.scheduleData.activities?.filter(a => a.track === track) || [];
        const trackEmoji = TRACK_EMOJIS[track] || TRACK_EMOJIS.default;
        const calendarName = `${trackEmoji} ${track} - Vas3k Camp 2025`;
        
        const header = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Vas3k Camp//Camp Schedule//EN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${calendarName}`,
            `X-WR-CALDESC:Мероприятия трека "${track}" - Vas3k Camp 2025`,
            'X-WR-TIMEZONE:Europe/Belgrade',
            'CALSCALE:GREGORIAN',
            'BEGIN:VTIMEZONE',
            'TZID:Europe/Belgrade',
            'BEGIN:STANDARD',
            'DTSTART:20241027T030000',
            'TZOFFSETFROM:+0200',
            'TZOFFSETTO:+0100',
            'TZNAME:CET',
            'END:STANDARD',
            'BEGIN:DAYLIGHT',
            'DTSTART:20250330T020000',
            'TZOFFSETFROM:+0100',
            'TZOFFSETTO:+0200',
            'TZNAME:CEST',
            'END:DAYLIGHT',
            'END:VTIMEZONE'
        ].join('\r\n');
        
        const events = activities.map((activity, index) => this.generateEvent(activity, index));
        
        const footer = 'END:VCALENDAR';
        
        return [header, ...events, footer].join('\r\n');
    }

    // Get all unique tracks
    getTracks() {
        const activities = this.scheduleData.activities || [];
        const tracks = [...new Set(activities.map(a => a.track).filter(Boolean))];
        return tracks;
    }

    // Generate all ICS files
    generateAllFiles() {
        const outputDir = 'ics_files';
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        // Generate main calendar file
        const mainICS = this.generateICS();
        fs.writeFileSync(path.join(outputDir, 'vas3k-camp-2025-full.ics'), mainICS);
        console.log('✅ Generated: vas3k-camp-2025-full.ics');
        
        // Generate track-specific files
        const tracks = this.getTracks();
        tracks.forEach(track => {
            const trackICS = this.generateTrackICS(track);
            const filename = `vas3k-camp-2025-${track.replace(/[^\w\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.ics`;
            fs.writeFileSync(path.join(outputDir, filename), trackICS);
            console.log(`✅ Generated: ${filename}`);
        });
        
        console.log(`\n🎉 Generated ${tracks.length + 1} ICS files in ${outputDir}/ directory`);
        console.log('\nFiles generated:');
        console.log('📅 vas3k-camp-2025-full.ics - Complete schedule');
        tracks.forEach(track => {
            const emoji = TRACK_EMOJIS[track] || TRACK_EMOJIS.default;
            console.log(`${emoji} ${track}`);
        });
    }
}

// Main execution
function main() {
    try {
        // Read schedule data
        const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
        
        // Create generator and generate files
        const generator = new ICSGenerator(scheduleData);
        generator.generateAllFiles();
        
        console.log('\n📱 Import these ICS files into your calendar app to get:');
        console.log('  • Emoji-coded events by activity type');
        console.log('  • Detailed descriptions with author info');
        console.log('  • Location information');
        console.log('  • Timezone-aware scheduling');
        
    } catch (error) {
        console.error('❌ Error generating ICS files:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = ICSGenerator;