// Adaptive ICS Generator for Event Schedules
// Automatically adapts to any event configuration and data structure

const fs = require('fs');
const path = require('path');

class AdaptiveICSGenerator {
    constructor(scheduleData, configPath = 'config.json') {
        this.scheduleData = scheduleData;
        this.config = this.loadConfig(configPath);
        this.detectedTracks = new Set();
        this.detectedTypes = new Set();
        this.init();
    }

    loadConfig(configPath) {
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.warn(`⚠️  Could not load config from ${configPath}, using defaults`);
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            event: {
                name: "Event Schedule",
                description: "Event schedule with activity types",
                timezone: "Europe/Belgrade",
                organizer: "Event Team"
            },
            tracks: {
                auto_detect: true,
                default_emoji: "📅",
                mappings: {}
            },
            activity_types: {
                auto_detect: true,
                keyword_mappings: {}
            },
            data_types: {
                activities: { enabled: true, default_emoji: "📅" },
                meals: { enabled: true, default_emoji: "🍽️" },
                stations: { enabled: true, default_emoji: "🏪" },
                quests: { enabled: true, default_emoji: "🗺️" }
            },
            export_options: {
                create_combined_calendar: true,
                create_separate_calendars: true,
                create_track_calendars: true,
                include_private_events: false
            }
        };
    }

    init() {
        this.analyzeData();
        this.setupEventTypeMapping();
    }

    analyzeData() {
        // Analyze all data types to detect tracks and types
        const dataTypes = ['activities', 'meals', 'stations', 'quests'];
        
        dataTypes.forEach(type => {
            const items = this.scheduleData[type] || [];
            items.forEach(item => {
                if (item.track) {
                    this.detectedTracks.add(item.track);
                }
                if (item.type) {
                    this.detectedTypes.add(item.type);
                }
            });
        });

        console.log(`📊 Detected ${this.detectedTracks.size} tracks: ${Array.from(this.detectedTracks).join(', ')}`);
        console.log(`📊 Detected ${this.detectedTypes.size} types: ${Array.from(this.detectedTypes).join(', ')}`);
    }

    setupEventTypeMapping() {
        // Auto-detect and setup track mappings
        if (this.config.tracks.auto_detect) {
            this.detectedTracks.forEach(track => {
                if (!this.config.tracks.mappings[track]) {
                    this.config.tracks.mappings[track] = {
                        emoji: this.extractEmojiFromTrack(track) || this.config.tracks.default_emoji,
                        color: this.generateTrackColor(track),
                        description: track
                    };
                }
            });
        }
    }

    extractEmojiFromTrack(track) {
        // Extract emoji from track name (e.g., "🧠 Geek Zone" -> "🧠")
        const emojiMatch = track.match(/^(\p{Emoji})/u);
        return emojiMatch ? emojiMatch[1] : null;
    }

    generateTrackColor(track) {
        // Generate a consistent color for track based on hash
        const hash = this.hashString(track);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    formatDateTimeForICS(dateString, timeString) {
        if (!dateString || !timeString) {
            return null;
        }
        
        const date = new Date(dateString);
        const [hours, minutes] = timeString.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}T${hour}${min}00`;
    }

    formatDateForICS(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    getActivityEmoji(item, dataType) {
        const title = (item.title || '').toLowerCase();
        const track = item.track || '';
        
        // Check activity type keywords first
        if (this.config.activity_types.auto_detect) {
            for (const [keyword, emoji] of Object.entries(this.config.activity_types.keyword_mappings)) {
                if (title.includes(keyword.toLowerCase())) {
                    return emoji;
                }
            }
        }
        
        // Check track-based emoji
        if (track && this.config.tracks.mappings[track]) {
            return this.config.tracks.mappings[track].emoji;
        }
        
        // Fall back to data type default
        return this.config.data_types[dataType]?.default_emoji || this.config.tracks.default_emoji;
    }

    getLocationName(placeId) {
        const place = this.scheduleData.places?.find(p => p.id === placeId);
        return place ? place.title : (placeId || 'TBD');
    }

    escapeICSText(text) {
        if (!text) return '';
        const maxLength = this.config.export_options.max_description_length || 1000;
        const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        
        return truncated
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '');
    }

    buildEventDescription(item, dataType) {
        let description = '';
        
        if (item.track) {
            description += `Трек: ${item.track}\\n\\n`;
        }
        
        if (item.description) {
            description += `${item.description}\\n\\n`;
        }
        
        if (this.config.export_options.include_author_info && item.author) {
            description += `Автор: ${item.author}\\n`;
        }
        
        if (this.config.export_options.include_author_info && item.authorUrl) {
            description += `Профиль: ${item.authorUrl}\\n`;
        }
        
        if (item.timeStart && item.timeEnd) {
            description += `\\nВремя: ${item.timeStart} - ${item.timeEnd}`;
        }
        
        if (item.dayName) {
            description += `\\nДень: ${item.dayName}`;
        }
        
        if (dataType !== 'activities') {
            description += `\\nТип: ${dataType}`;
        }
        
        return description;
    }

    generateEvent(item, index, dataType) {
        const emoji = this.getActivityEmoji(item, dataType);
        const title = this.config.ui.display.show_emojis_in_titles ? 
            `${emoji} ${item.title}` : item.title;
        
        let startTime, endTime;
        
        if (this.config.data_types[dataType]?.create_all_day_events || !item.date || !item.timeStart) {
            // Create all-day events for stations and quests, or items without time
            const eventDate = item.date || this.config.event.dates.start;
            startTime = this.formatDateForICS(eventDate);
            endTime = this.formatDateForICS(item.date || this.config.event.dates.end);
        } else {
            // Regular timed events
            startTime = this.formatDateTimeForICS(item.date, item.timeStart);
            endTime = this.formatDateTimeForICS(item.date, item.timeEnd);
        }
        
        // Skip events without valid times
        if (!startTime || !endTime) {
            console.warn(`⚠️  Skipping event "${item.title}" - invalid date/time`);
            return null;
        }
        
        const location = this.config.export_options.include_location_info ? 
            this.getLocationName(item.placeId) : '';
        
        const description = this.config.export_options.include_description ? 
            this.buildEventDescription(item, dataType) : '';
        
        const uid = `${this.slugify(this.config.event.name)}-${dataType}-${item.date || 'allday'}-${index}@${this.slugify(this.config.event.organizer)}`;
        
        const isAllDay = this.config.data_types[dataType]?.create_all_day_events || !item.timeStart;
        
        const eventLines = [
            'BEGIN:VEVENT',
            isAllDay ? `DTSTART;VALUE=DATE:${startTime}` : `DTSTART:${startTime}`,
            isAllDay ? `DTEND;VALUE=DATE:${endTime}` : `DTEND:${endTime}`,
            `SUMMARY:${this.escapeICSText(title)}`,
            `DESCRIPTION:${this.escapeICSText(description)}`,
            `LOCATION:${this.escapeICSText(location)}`,
            `UID:${uid}`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
            item.author ? `ORGANIZER:CN=${this.escapeICSText(item.author)}` : '',
            item.track ? `CATEGORIES:${this.escapeICSText(item.track)}` : `CATEGORIES:${dataType}`,
            (item.private && !this.config.export_options.include_private_events) ? 
                'CLASS:PRIVATE' : 'CLASS:PUBLIC',
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            'END:VEVENT'
        ].filter(line => line);
        
        return eventLines.join('\r\n');
    }

    generateCalendarHeader(calendarName, description = null) {
        const header = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            `PRODID:-//${this.config.event.organizer}//Event Schedule//EN`,
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${calendarName}`,
            `X-WR-CALDESC:${description || this.config.event.description}`,
            this.config.export_options.include_timezone_info ? 
                `X-WR-TIMEZONE:${this.config.event.timezone}` : '',
            'CALSCALE:GREGORIAN'
        ].filter(line => line);

        if (this.config.export_options.include_timezone_info) {
            header.push(
                'BEGIN:VTIMEZONE',
                `TZID:${this.config.event.timezone}`,
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
            );
        }

        return header.join('\r\n');
    }

    generateICS(items, dataType, calendarName, description = null) {
        const header = this.generateCalendarHeader(calendarName, description);
        const events = items.map((item, index) => this.generateEvent(item, index, dataType))
                           .filter(event => event !== null);
        const footer = 'END:VCALENDAR';
        
        return [header, ...events, footer].join('\r\n');
    }

    generateCombinedCalendar() {
        const allItems = [];
        const dataTypes = ['activities', 'meals', 'stations', 'quests'];
        
        dataTypes.forEach(type => {
            if (this.config.data_types[type]?.enabled) {
                const items = this.scheduleData[type] || [];
                items.forEach(item => {
                    if (!item.private || this.config.export_options.include_private_events) {
                        allItems.push({ ...item, _dataType: type });
                    }
                });
            }
        });
        
        const calendarName = `${this.config.event.name} 📅`;
        return this.generateICS(allItems, 'combined', calendarName);
    }

    generateTrackCalendar(track) {
        const allItems = [];
        const dataTypes = ['activities', 'meals', 'stations', 'quests'];
        
        dataTypes.forEach(type => {
            if (this.config.data_types[type]?.enabled) {
                const items = (this.scheduleData[type] || []).filter(item => 
                    item.track === track && 
                    (!item.private || this.config.export_options.include_private_events)
                );
                items.forEach(item => {
                    allItems.push({ ...item, _dataType: type });
                });
            }
        });
        
        const trackEmoji = this.config.tracks.mappings[track]?.emoji || this.config.tracks.default_emoji;
        const calendarName = `${trackEmoji} ${track} - ${this.config.event.name}`;
        const description = `Мероприятия трека "${track}" - ${this.config.event.name}`;
        
        return this.generateICS(allItems, 'track', calendarName, description);
    }

    generateTypeCalendar(dataType) {
        const items = (this.scheduleData[dataType] || []).filter(item => 
            !item.private || this.config.export_options.include_private_events
        );
        
        const typeEmoji = this.config.data_types[dataType]?.default_emoji || this.config.tracks.default_emoji;
        const suffix = this.config.data_types[dataType]?.calendar_name_suffix || '';
        const calendarName = `${typeEmoji} ${this.config.event.name}${suffix}`;
        const description = `${dataType} - ${this.config.event.name}`;
        
        return this.generateICS(items, dataType, calendarName, description);
    }

    generateAllFiles() {
        const outputDir = 'ics_files';
        const eventSlug = this.slugify(this.config.event.name);
        
        // Create output directory
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        const generatedFiles = [];
        
        // Generate combined calendar
        if (this.config.export_options.create_combined_calendar) {
            const combinedICS = this.generateCombinedCalendar();
            const filename = `${eventSlug}-complete.ics`;
            fs.writeFileSync(path.join(outputDir, filename), combinedICS);
            generatedFiles.push({ name: filename, type: 'combined', description: 'Complete schedule' });
            console.log(`✅ Generated: ${filename}`);
        }
        
        // Generate track-specific calendars
        if (this.config.export_options.create_track_calendars && this.detectedTracks.size > 0) {
            this.detectedTracks.forEach(track => {
                const trackICS = this.generateTrackCalendar(track);
                const trackSlug = this.slugify(track);
                const filename = `${eventSlug}-track-${trackSlug}.ics`;
                fs.writeFileSync(path.join(outputDir, filename), trackICS);
                generatedFiles.push({ name: filename, type: 'track', description: track });
                console.log(`✅ Generated: ${filename}`);
            });
        }
        
        // Generate type-specific calendars
        if (this.config.export_options.create_separate_calendars) {
            const dataTypes = ['activities', 'meals', 'stations', 'quests'];
            dataTypes.forEach(type => {
                if (this.config.data_types[type]?.enabled && this.scheduleData[type]?.length > 0) {
                    const typeICS = this.generateTypeCalendar(type);
                    const filename = `${eventSlug}-${type}.ics`;
                    fs.writeFileSync(path.join(outputDir, filename), typeICS);
                    generatedFiles.push({ name: filename, type: 'dataType', description: type });
                    console.log(`✅ Generated: ${filename}`);
                }
            });
        }
        
        // Generate summary
        console.log(`\n🎉 Generated ${generatedFiles.length} ICS files in ${outputDir}/ directory`);
        console.log('\nFiles generated:');
        generatedFiles.forEach(file => {
            const emoji = file.type === 'combined' ? '📅' : 
                         file.type === 'track' ? (this.config.tracks.mappings[file.description]?.emoji || '📋') :
                         this.config.data_types[file.description]?.default_emoji || '📄';
            console.log(`${emoji} ${file.name} - ${file.description}`);
        });
        
        return generatedFiles;
    }

    // Export configuration for web interface
    exportWebConfig() {
        return {
            tracks: Array.from(this.detectedTracks).map(track => ({
                name: track,
                emoji: this.config.tracks.mappings[track]?.emoji || this.config.tracks.default_emoji,
                color: this.config.tracks.mappings[track]?.color,
                description: this.config.tracks.mappings[track]?.description || track
            })),
            dataTypes: Object.keys(this.config.data_types).filter(type => 
                this.config.data_types[type]?.enabled && this.scheduleData[type]?.length > 0
            ),
            ui: this.config.ui,
            localization: this.config.localization
        };
    }
}

// Main execution
function main() {
    try {
        console.log('🚀 Starting Adaptive ICS Generator...');
        
        // Read schedule data
        const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
        
        // Create generator and generate files
        const generator = new AdaptiveICSGenerator(scheduleData);
        const files = generator.generateAllFiles();
        
        // Export web configuration
        const webConfig = generator.exportWebConfig();
        fs.writeFileSync('web_config.json', JSON.stringify(webConfig, null, 2));
        console.log('✅ Generated: web_config.json');
        
        console.log('\n📱 Import these ICS files into your calendar app to get:');
        console.log('  • Auto-detected emoji coding by activity type');
        console.log('  • Comprehensive event information');
        console.log('  • Timezone-aware scheduling');
        console.log('  • Flexible track and type organization');
        
        console.log('\n🔧 To customize for your event:');
        console.log('  • Edit config.json for event details, tracks, and preferences');
        console.log('  • Update schedule.json with your event data');
        console.log('  • Run this script again to regenerate files');
        
    } catch (error) {
        console.error('❌ Error generating ICS files:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = AdaptiveICSGenerator;