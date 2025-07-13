// Adaptive Schedule Viewer - Works with any event configuration
// Auto-loads configuration from web_config.json

// Global variables
let scheduleData = [];
let webConfig = {};
let currentDay = '';
let currentTab = 'days';
let favorites = [];

// Load configuration and initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load web configuration
        const configResponse = await fetch('web_config.json');
        webConfig = await configResponse.json();
        
        // Load schedule data
        await loadSchedule();
        
        console.log('✅ Loaded adaptive configuration:', webConfig);
    } catch (error) {
        console.error('❌ Error loading configuration:', error);
        // Fallback to default configuration
        webConfig = getDefaultConfig();
        await loadSchedule();
    }
});

// Default configuration fallback
function getDefaultConfig() {
    return {
        tracks: [],
        dataTypes: ['activities'],
        ui: {
            search: { enabled: true, debounce_delay: 300, placeholder: "🔍 Search..." },
            export_buttons: { show_full_export: true, show_favorites_export: true },
            display: { show_emojis_in_titles: true }
        },
        localization: {
            language: 'en',
            strings: {
                export_full: "📥 Download Full Schedule (ICS)",
                export_favorites: "❤️ Download Favorites (ICS)",
                export_track: "Download Track",
                calendar_export: "📅 Calendar Export",
                by_tracks: "By Tracks:",
                by_types: "By Types:"
            }
        }
    };
}

// Adaptive ICS Generator for web interface
class WebICSGenerator {
    constructor(scheduleData, webConfig) {
        this.scheduleData = scheduleData;
        this.config = webConfig;
    }

    formatDateTimeForICS(dateString, timeString) {
        if (!dateString || !timeString) return null;
        
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

    getActivityEmoji(item, dataType = 'activities') {
        const title = (item.title || '').toLowerCase();
        const track = item.track || '';
        
        // Check for specific activity types
        const keywordMappings = {
            'welcome': '👋', 'добро пожаловать': '👋', 'приветствие': '👋',
            'quiz': '🧠', 'квиз': '🧠', 'викторина': '🧠',
            'workshop': '🛠️', 'воркшоп': '🛠️', 'мастер-класс': '🛠️',
            'keynote': '📢', 'открытие': '📢', 'закрытие': '📢',
            'networking': '🤝', 'нетворкинг': '🤝', 'знакомство': '🤝',
            'party': '🎉', 'вечеринка': '🎉', 'праздник': '🎉',
            'dj': '🎵', 'диджей': '🎵', 'музыка': '🎵',
            'sport': '⚽', 'спорт': '⚽', 'игра': '⚽',
            'food': '🍽️', 'еда': '🍽️',
            'завтрак': '🍳', 'обед': '🍽️', 'ужин': '🍽️',
            'quest': '🗺️', 'квест': '🗺️',
            'station': '🏪', 'станция': '🏪',
            'build': '🚧', 'строительство': '🚧', 'подготовка': '🚧'
        };
        
        for (const [keyword, emoji] of Object.entries(keywordMappings)) {
            if (title.includes(keyword)) {
                return emoji;
            }
        }
        
        // Check track-based emoji
        const trackConfig = this.config.tracks.find(t => t.name === track);
        if (trackConfig) {
            return trackConfig.emoji;
        }
        
        // Fall back to data type defaults
        const dataTypeEmojis = {
            activities: '📅',
            meals: '🍽️',
            stations: '🏪',
            quests: '🗺️'
        };
        
        return dataTypeEmojis[dataType] || '📅';
    }

    escapeICSText(text) {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '');
    }

    generateEvent(item, index, dataType = 'activities') {
        const emoji = this.getActivityEmoji(item, dataType);
        const title = this.config.ui.display.show_emojis_in_titles ? 
            `${emoji} ${item.title}` : item.title;
        
        let startTime, endTime;
        const isAllDay = dataType === 'stations' || dataType === 'quests' || !item.timeStart;
        
        if (isAllDay) {
            const eventDate = item.date || '2025-06-05';
            startTime = this.formatDateForICS(eventDate);
            endTime = this.formatDateForICS(item.date || '2025-06-08');
        } else {
            startTime = this.formatDateTimeForICS(item.date, item.timeStart);
            endTime = this.formatDateTimeForICS(item.date, item.timeEnd);
        }
        
        if (!startTime || !endTime) return null;
        
        const location = this.getLocationName(item.placeId);
        const description = this.buildEventDescription(item, dataType);
        const uid = `vas3k-camp-2025-${dataType}-${item.date || 'allday'}-${index}@vas3k.camp`;
        
        return [
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
            'STATUS:CONFIRMED',
            'END:VEVENT'
        ].filter(line => line).join('\r\n');
    }

    getLocationName(placeId) {
        const place = this.scheduleData.places?.find(p => p.id === placeId);
        return place ? place.title : (placeId || 'TBD');
    }

    buildEventDescription(item, dataType) {
        let description = '';
        
        if (item.track) {
            description += `Трек: ${item.track}\\n\\n`;
        }
        
        if (item.description) {
            description += `${item.description}\\n\\n`;
        }
        
        if (item.author) {
            description += `Автор: ${item.author}\\n`;
        }
        
        if (item.authorUrl) {
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

    generateICS(items, dataType, calendarName) {
        const header = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Vas3k Camp//Event Schedule//EN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${calendarName}`,
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
        
        const events = items.map((item, index) => this.generateEvent(item, index, dataType))
                           .filter(event => event !== null);
        
        const footer = 'END:VCALENDAR';
        
        return [header, ...events, footer].join('\r\n');
    }
}

// Enhanced download functionality
function downloadICS(items = null, filename = 'schedule.ics', dataType = 'activities') {
    const generator = new WebICSGenerator(scheduleData, webConfig);
    
    const itemsToExport = items || getAllActivities();
    const calendarName = filename.replace('.ics', '');
    
    const icsContent = generator.generateICS(itemsToExport, dataType, calendarName);
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Get all activities from all data types
function getAllActivities() {
    const allItems = [];
    
    webConfig.dataTypes.forEach(type => {
        const items = scheduleData[type] || [];
        items.forEach(item => {
            allItems.push({ ...item, _dataType: type });
        });
    });
    
    return allItems;
}

// Download favorites
function downloadFavoritesICS() {
    const favoriteActivities = getAllActivities().filter(item => 
        favorites.includes(getActivityId(item))
    );
    
    if (favoriteActivities.length === 0) {
        alert(webConfig.localization.strings.no_favorites);
        return;
    }
    
    downloadICS(favoriteActivities, 'favorites.ics', 'combined');
}

// Download track-specific ICS
function downloadTrackICS(trackName) {
    const trackActivities = getAllActivities().filter(item => 
        item.track === trackName
    );
    
    if (trackActivities.length === 0) {
        alert(`${webConfig.localization.strings.no_track_events} "${trackName}"!`);
        return;
    }
    
    const trackConfig = webConfig.tracks.find(t => t.name === trackName);
    const emoji = trackConfig ? trackConfig.emoji : '📋';
    const filename = `track-${trackName.replace(/[^\w\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.ics`;
    
    downloadICS(trackActivities, filename, 'track');
}

// Download type-specific ICS
function downloadTypeICS(dataType) {
    const typeItems = scheduleData[dataType] || [];
    
    if (typeItems.length === 0) {
        alert(`No ${dataType} to export!`);
        return;
    }
    
    const filename = `${dataType}.ics`;
    downloadICS(typeItems, filename, dataType);
}

// Enhanced search functionality
function searchActivities(query) {
    if (!query.trim()) {
        displaySchedule();
        return;
    }
    
    const searchQuery = query.toLowerCase();
    const allItems = getAllActivities();
    const filteredItems = allItems.filter(item => {
        return (
            item.title?.toLowerCase().includes(searchQuery) ||
            item.description?.toLowerCase().includes(searchQuery) ||
            item.author?.toLowerCase().includes(searchQuery) ||
            item.track?.toLowerCase().includes(searchQuery)
        );
    });
    
    displaySearchResults(filteredItems, query);
}

// Display search results
function displaySearchResults(items, query) {
    const container = document.getElementById('schedule-container');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>🔍 ${webConfig.localization.strings.no_search_results}</h3>
                <p>По запросу "${query}" не найдено мероприятий.</p>
                <button onclick="displaySchedule()" class="btn-primary">
                    ${webConfig.localization.strings.show_all}
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="search-results">
            <h3>🔍 ${webConfig.localization.strings.search_results}: "${query}" (${items.length})</h3>
            <div class="search-actions">
                <button onclick="downloadICS(${JSON.stringify(items)}, 'search-results.ics', 'combined')" 
                        class="btn-secondary">
                    ${webConfig.localization.strings.export_search}
                </button>
                <button onclick="displaySchedule()" class="btn-secondary">
                    ${webConfig.localization.strings.show_all}
                </button>
            </div>
            <div class="search-results-list">
                ${items.map(item => createSearchResultCard(item)).join('')}
            </div>
        </div>
    `;
}

// Create search result card
function createSearchResultCard(item) {
    const generator = new WebICSGenerator(scheduleData, webConfig);
    const emoji = generator.getActivityEmoji(item, item._dataType);
    const isFavorite = favorites.includes(getActivityId(item));
    
    // Enhanced display for stations (camps)
    let stationDetails = '';
    if (item._dataType === 'stations') {
        stationDetails = `
            <div class="station-details">
                ${item.team ? `<div class="station-team">
                    <span class="team-icon">👥</span>
                    <span class="team-info">Команда: ${item.team.join(', ')}</span>
                </div>` : ''}
                ${item.schedule ? `<div class="station-schedule">
                    <span class="schedule-icon">📅</span>
                    <span class="schedule-info">Расписание: ${item.schedule.substring(0, 100)}${item.schedule.length > 100 ? '...' : ''}</span>
                </div>` : ''}
                ${item.link ? `<div class="station-link">
                    <span class="link-icon">🔗</span>
                    <a href="${item.link}" target="_blank" onclick="event.stopPropagation()">Подробнее</a>
                </div>` : ''}
            </div>
        `;
    }
    
    return `
        <div class="search-result-card ${item._dataType === 'stations' ? 'station-card' : ''}" 
             onclick="openActivityModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            <div class="search-result-header">
                <span class="activity-emoji">${emoji}</span>
                <h4>${item.title}</h4>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite('${getActivityId(item)}')"
                        title="${isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="search-result-meta">
                <span class="date">${item.dayName || 'All Days'}, ${item.date || 'Camp Period'}</span>
                ${item.timeStart && item.timeEnd ? `<span class="time">${item.timeStart} - ${item.timeEnd}</span>` : ''}
                ${item.track ? `<span class="track">${item.track}</span>` : ''}
                <span class="type">${item._dataType === 'stations' ? 'Лагерь' : item._dataType}</span>
            </div>
            ${item.author ? `<div class="author">👤 ${item.author}</div>` : ''}
            ${item.description ? `<div class="description">${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''}</div>` : ''}
            ${stationDetails}
        </div>
    `;
}

// Create export controls dynamically
function createExportControls() {
    const exportSection = document.querySelector('.export-controls');
    if (!exportSection) return;
    
    const strings = webConfig.localization.strings;
    const buttons = webConfig.ui.export_buttons;
    
    let html = `
        <div class="export-section">
            <h3>${strings.calendar_export}</h3>
            <div class="export-buttons">
    `;
    
    if (buttons.show_full_export) {
        html += `
            <button onclick="downloadICS()" class="btn-primary">
                ${strings.export_full}
            </button>
        `;
    }
    
    if (buttons.show_favorites_export) {
        html += `
            <button onclick="downloadFavoritesICS()" class="btn-secondary">
                ${strings.export_favorites}
            </button>
        `;
    }
    
    html += `</div>`;
    
    if (buttons.show_track_exports && webConfig.tracks.length > 0) {
        html += `
            <div class="track-exports">
                <h4>${strings.by_tracks}</h4>
                <div class="track-buttons">
        `;
        
        webConfig.tracks.forEach(track => {
            html += `
                <button onclick="downloadTrackICS('${track.name}')" class="btn-track">
                    ${track.emoji} ${track.name}
                </button>
            `;
        });
        
        html += `</div></div>`;
    }
    
    if (buttons.show_type_exports && webConfig.dataTypes.length > 1) {
        html += `
            <div class="type-exports">
                <h4>${strings.by_types}</h4>
                <div class="type-buttons">
        `;
        
        webConfig.dataTypes.forEach(type => {
            const typeEmojis = {
                activities: '📅',
                meals: '🍽️',
                stations: '🏪',
                quests: '🗺️'
            };
            
            html += `
                <button onclick="downloadTypeICS('${type}')" class="btn-track">
                    ${typeEmojis[type]} ${type}
                </button>
            `;
        });
        
        html += `</div></div>`;
    }
    
    html += `</div>`;
    
    exportSection.innerHTML = html;
}

// Setup search functionality
function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.placeholder = webConfig.ui.search.placeholder;
    
    // Setup debounced search
    searchInput.addEventListener('input', debounce(function() {
        searchActivities(this.value);
    }, webConfig.ui.search.debounce_delay));
}

// ... (include existing functions from script.js for compatibility)

// Function to convert URLs in text to clickable links and handle newlines
function linkifyText(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(t\.me\/[^\s]+)/gi;
    let processedText = text.replace(/\n/g, '<br>');
    return processedText.replace(urlRegex, function(url) {
        let href = url;
        if (url.indexOf('http') !== 0) {
            href = 'https://' + url;
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

// Helper function for debouncing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Initialize the enhanced features
function initializeEnhancedFeatures() {
    setupSearchInput();
    createExportControls();
    loadFavorites();
    
    // Setup favorites toggle
    const favoritesToggle = document.getElementById('favoritesToggle');
    if (favoritesToggle) {
        favoritesToggle.addEventListener('change', function() {
            displaySchedule();
        });
    }
}

// Load schedule data (simplified version)
async function loadSchedule() {
    try {
        const response = await fetch('schedule.json');
        scheduleData = await response.json();
        
        // Initialize enhanced features after data load
        setTimeout(initializeEnhancedFeatures, 100);
        
        console.log('✅ Schedule data loaded');
    } catch (error) {
        console.error('❌ Error loading schedule:', error);
    }
}

// Placeholder functions for compatibility (implement as needed)
function displaySchedule() {
    console.log('Display schedule called');
}

function getActivityId(activity) {
    return `${activity.date}-${activity.timeStart}-${activity.title}`;
}

function toggleFavorite(activityId) {
    const index = favorites.indexOf(activityId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(activityId);
    }
    saveFavorites();
}

function loadFavorites() {
            const saved = localStorage.getItem('veterok-tramontana-favorites');
    if (saved) {
        favorites = JSON.parse(saved);
    }
}

function saveFavorites() {
            localStorage.setItem('veterok-tramontana-favorites', JSON.stringify(favorites));
}

function openActivityModal(activity) {
    console.log('Open modal for:', activity);
}