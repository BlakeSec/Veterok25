# 🎯 Adaptive Event Schedule System

![Vas3k Camp Logo](images/logo-diamond.svg)

An **adaptive, emoji-colorized event schedule system** that automatically detects tracks and activity types, generating comprehensive ICS calendar files for any event. Originally created for Vas3k Camp 2025, but designed to work with any event configuration.

## ✨ Features

### 🤖 **Auto-Adaptive**
- **Auto-detects** tracks from your event data
- **Intelligent emoji assignment** based on keywords and tracks
- **Flexible data structure** - works with activities, meals, stations, quests
- **Google Sheets integration** - direct import from Google Sheets with automatic processing
- **Easy configuration** - just update `config.json` for your event

### 📅 **Calendar Integration**
- **Multi-format export**: Complete, track-specific, favorites, search results
- **ICS compatibility**: Google Calendar, Apple Calendar, Outlook, mobile apps
- **Timezone support**: Proper timezone handling for any location
- **Rich event data**: Descriptions, authors, locations, categories

### 🔍 **Enhanced Interface**
- **Real-time search** with debounced input
- **Interactive day-by-day schedule**
- **Favorites system** with local storage
- **Responsive design** for all devices
- **Emoji-colorized activities** by type and track

### 🎨 **Customization**
- **Configurable emoji mappings** for activity types
- **Track-specific colors** and icons
- **Multilingual support** with localization
- **UI customization** options
- **Export preferences** and filtering

## 🚀 Quick Start

### For This Event (Vas3k Camp 2025)
```bash
# Generate ICS files
npm run generate-ics

# Start web server
npm run dev
# or
python -m http.server 8000

# Open browser
open http://localhost:8000
```

### For Your Own Event
```bash
# 1. Clone the repository
git clone <repository>
cd event-schedule-system

# 2. Update your event data
cp your_event_data.json schedule.json

# 3. Configure your event
nano config.json

# 4. Generate calendar files
node adaptive_ics_generator.js

# 5. Test the web interface
python -m http.server 8000
```

## 📁 Generated Files

The system automatically generates:

- **`vas3k-camp-2025-complete.ics`** - Complete schedule (64KB, 1000+ events)
- **`vas3k-camp-2025-activities.ics`** - Activities only (54KB, 779 events)
- **`vas3k-camp-2025-meals.ics`** - Meal times (3.6KB, 154 events)
- **`vas3k-camp-2025-stations.ics`** - Stations/services (4.5KB, 89 events)
- **`vas3k-camp-2025-quests.ics`** - Ongoing quests (2.2KB, 52 events)
- **Track-specific files** for each detected track
- **`web_config.json`** - Auto-generated web interface config

## 🎯 Use Cases

This system adapts to any event type:

### 🏢 **Conference/Corporate**
- Multi-track conferences
- Training sessions
- Company retreats
- Product launches

### 🎪 **Community Events**
- Meetups and gatherings
- Festival schedules
- Educational workshops
- Social activities

### 🏕️ **Camps/Retreats**
- Activity schedules
- Meal planning
- Station management
- Quest tracking

### 👥 **Personal Events**
- Wedding schedules
- Vacation itineraries
- Family gatherings
- Project timelines

## 🔧 Configuration

### Basic Event Setup (`config.json`)
```json
{
  "event": {
    "name": "Your Event Name 2025",
    "description": "Event description with emoji support",
    "timezone": "Europe/Belgrade",
    "dates": { "start": "2025-06-05", "end": "2025-06-08" }
  },
  "tracks": {
    "auto_detect": true,
    "mappings": {
      "🧠 Tech Track": { "emoji": "🤓", "color": "#4169E1" },
      "🎨 Creative Track": { "emoji": "🎨", "color": "#228B22" }
    }
  }
}
```

### Data Structure (`schedule.json`)
```json
{
  "activities": [
    {
      "date": "2025-06-05",
      "timeStart": "09:00",
      "timeEnd": "10:30",
      "title": "Welcome Session",
      "track": "🌟 General",
      "author": "Speaker Name",
      "description": "Event kickoff..."
    }
  ],
  "meals": [...],
  "stations": [...],
  "quests": [...],
  "places": [...]
}
```

## 📊 Auto-Detection Features

### 🎯 **Track Detection**
- Automatically detects all unique tracks from your data
- Extracts emojis from track names (e.g., "🧠 Geek Zone" → "🧠")
- Generates consistent colors for each track
- Creates track-specific export files

### 🏷️ **Activity Type Detection**
- Keyword-based emoji assignment
- Supports multiple languages
- Fallback to track-based emojis
- Customizable keyword mappings

### 📈 **Smart Categorization**
- Separates activities, meals, stations, quests
- Handles timed vs. all-day events
- Respects private event flags
- Maintains data relationships

## 🌍 Localization

Currently supports:
- **Russian** (primary) - Full localization
- **English** - Base support
- **Extensible** - Easy to add new languages

## 📱 Calendar Compatibility

**Tested & Working:**
- ✅ Google Calendar
- ✅ Apple Calendar (macOS/iOS)
- ✅ Microsoft Outlook
- ✅ Mozilla Thunderbird
- ✅ Mobile calendar apps

## 📖 Documentation

- **[🎯 ADAPTIVE_SETUP_GUIDE.md](ADAPTIVE_SETUP_GUIDE.md)** - Complete setup guide for any event
- **[📅 ICS_FEATURES.md](ICS_FEATURES.md)** - Original ICS implementation details
- **[⚙️ config.json](config.json)** - Event configuration template
- **[🌐 web_config.json](web_config.json)** - Auto-generated web interface config

## 🔄 Development Workflow

1. **Update event data** in `schedule.json`
2. **Configure settings** in `config.json`
3. **Generate files** with `node adaptive_ics_generator.js`
4. **Test interface** with local server
5. **Customize** as needed and regenerate

## 🎨 Customization Examples

### Add Custom Activity Types
```json
{
  "activity_types": {
    "keyword_mappings": {
      "coffee": "☕",
      "awards": "🏆",
      "closing": "👋"
    }
  }
}
```

### Configure Export Options
```json
{
  "export_options": {
    "create_combined_calendar": true,
    "include_private_events": false,
    "max_description_length": 1000
  }
}
```

## 🚀 Advanced Features

- **Favorites export** - Export user-selected events
- **Search results export** - Export filtered search results
- **Private event handling** - Configurable private event inclusion
- **Rich descriptions** - Author info, locations, detailed descriptions
- **Timezone support** - Proper timezone handling for any location
- **Responsive design** - Works on all devices and screen sizes

## 📞 Support

For setup help or customization:
1. Check the **[Adaptive Setup Guide](ADAPTIVE_SETUP_GUIDE.md)**
2. Review the **console output** for error messages
3. Validate your **JSON data structure**
4. Test with **minimal data** first

## 📄 License

This project is open source and available under the MIT License.

---

**🎯 Ready to create your own adaptive event calendar? Start with the [Setup Guide](ADAPTIVE_SETUP_GUIDE.md)!**

## License

© 2025 Vas3k Camp. All rights reserved.