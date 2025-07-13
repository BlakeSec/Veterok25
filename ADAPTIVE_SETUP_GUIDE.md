# 🎯 Adaptive ICS Calendar System - Setup Guide

## Overview

This system automatically adapts to any event configuration, auto-detects tracks and activity types, and generates comprehensive ICS calendar files with emoji colorization. It's designed to be easily customizable for different events, conferences, camps, or gatherings.

## 🚀 Quick Start

### 1. Install & Run
```bash
# No dependencies needed - pure JavaScript/Node.js
git clone <repository>
cd event-schedule-system

# Generate ICS files
node adaptive_ics_generator.js

# Start web server
python -m http.server 8000
```

### 2. Open in Browser
Navigate to `http://localhost:8000` to view the schedule with adaptive features.

## 📁 File Structure

```
event-schedule-system/
├── adaptive_ics_generator.js    # Main ICS generator
├── adaptive_script.js           # Web interface script
├── config.json                  # Event configuration
├── schedule.json                # Your event data
├── web_config.json              # Auto-generated web config
├── index.html                   # Web interface
├── styles.css                   # Styling
├── ics_files/                   # Generated ICS files
│   ├── event-complete.ics       # Complete schedule
│   ├── event-activities.ics     # Activities only
│   ├── event-meals.ics          # Meals only
│   └── event-track-*.ics        # Track-specific files
└── README.md                    # Documentation
```

## 🔧 Configuration Setup

### 1. Basic Event Configuration (`config.json`)

```json
{
  "event": {
    "name": "Your Event Name 2025",
    "description": "Event description with emoji support",
    "timezone": "Europe/Belgrade",
    "dates": {
      "start": "2025-06-05",
      "end": "2025-06-08"
    },
    "website": "https://yourevent.com",
    "organizer": "Your Organization"
  }
}
```

### 2. Track Configuration

The system **auto-detects** tracks from your data, but you can customize them:

```json
{
  "tracks": {
    "auto_detect": true,
    "default_emoji": "📅",
    "mappings": {
      "🧠 Tech Track": {
        "emoji": "🤓",
        "color": "#4169E1", 
        "description": "Technical sessions"
      },
      "🎨 Creative Track": {
        "emoji": "🎨",
        "color": "#228B22",
        "description": "Creative workshops"
      }
    }
  }
}
```

### 3. Activity Type Detection

Automatically detects activity types by keywords:

```json
{
  "activity_types": {
    "auto_detect": true,
    "keyword_mappings": {
      "welcome": "👋",
      "workshop": "🛠️",
      "keynote": "📢",
      "networking": "🤝",
      "party": "🎉",
      "quiz": "🧠",
      "food": "🍽️"
    }
  }
}
```

## 📊 Data Structure

### Required Format (`schedule.json`)

```json
{
  "activities": [
    {
      "date": "2025-06-05",
      "dayName": "Thursday",
      "timeStart": "09:00",
      "timeEnd": "10:30",
      "title": "Welcome Session",
      "description": "Event kickoff...",
      "author": "Speaker Name",
      "authorUrl": "https://...",
      "track": "🌟 General",
      "placeId": "main_hall",
      "type": "general",
      "private": false
    }
  ],
  "meals": [
    {
      "date": "2025-06-05",
      "timeStart": "12:00",
      "timeEnd": "13:00",
      "title": "Lunch"
    }
  ],
  "stations": [
    {
      "title": "Registration Desk",
      "description": "Check-in location",
      "placeId": "lobby"
    }
  ],
  "quests": [
    {
      "title": "Networking Challenge",
      "description": "Meet 10 new people",
      "author": "Event Team"
    }
  ],
  "places": [
    {
      "id": "main_hall",
      "title": "Main Hall",
      "description": "Primary venue space",
      "color": "#FF6B6B"
    }
  ]
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `date` | Yes* | Event date (YYYY-MM-DD) |
| `timeStart` | Yes* | Start time (HH:MM) |
| `timeEnd` | Yes* | End time (HH:MM) |
| `title` | Yes | Event title |
| `description` | No | Detailed description |
| `author` | No | Speaker/organizer name |
| `authorUrl` | No | Speaker profile link |
| `track` | No | Track/category name |
| `placeId` | No | Location reference |
| `type` | No | Event type classification |
| `private` | No | Private event flag |

*Required for timed events. Stations and quests can be all-day.

## 🎨 Emoji Customization

### Automatic Emoji Detection

The system automatically assigns emojis based on:

1. **Keywords in titles** (highest priority)
2. **Track names** (medium priority)
3. **Data type** (fallback)

### Custom Emoji Rules

Add your own keyword mappings:

```json
{
  "activity_types": {
    "keyword_mappings": {
      "meeting": "📋",
      "presentation": "📊",
      "demo": "🖥️",
      "coffee": "☕",
      "dinner": "🍽️",
      "awards": "🏆",
      "closing": "👋"
    }
  }
}
```

## 📥 Export Options

### Available Export Types

1. **Complete Calendar** - All events combined
2. **Track-Specific** - Events filtered by track
3. **Data Type Specific** - Activities, meals, stations, quests
4. **Favorites** - User-selected events
5. **Search Results** - Filtered events

### Export Configuration

```json
{
  "export_options": {
    "create_combined_calendar": true,
    "create_separate_calendars": true,
    "create_track_calendars": true,
    "create_type_calendars": true,
    "include_private_events": false,
    "include_timezone_info": true,
    "include_location_info": true,
    "include_author_info": true,
    "max_description_length": 1000
  }
}
```

## 🌍 Localization

### Language Support

```json
{
  "localization": {
    "language": "en",
    "strings": {
      "export_full": "📥 Download Full Schedule (ICS)",
      "export_favorites": "❤️ Download Favorites (ICS)",
      "export_track": "Download Track",
      "no_favorites": "No favorites selected for export!",
      "no_search_results": "No results found",
      "search_results": "Search Results",
      "calendar_export": "📅 Calendar Export",
      "by_tracks": "By Tracks:",
      "by_types": "By Types:"
    }
  }
}
```

### Adding New Languages

1. Create language-specific strings in `config.json`
2. Update `localization.language` field
3. Regenerate with `node adaptive_ics_generator.js`

## 🎛️ UI Customization

### Search Configuration

```json
{
  "ui": {
    "search": {
      "enabled": true,
      "debounce_delay": 300,
      "placeholder": "🔍 Search events..."
    },
    "export_buttons": {
      "show_full_export": true,
      "show_favorites_export": true,
      "show_track_exports": true,
      "show_type_exports": true,
      "show_search_export": true
    },
    "display": {
      "show_emojis_in_titles": true,
      "show_track_colors": true,
      "responsive_design": true
    }
  }
}
```

## 🔄 Workflow for New Events

### 1. Prepare Your Data

```bash
# Start with your event data
cp your_event_data.json schedule.json
```

### 2. Configure Event Details

```bash
# Edit basic event info
nano config.json
```

### 3. Generate Files

```bash
# Run the generator
node adaptive_ics_generator.js

# Check output
ls ics_files/
```

### 4. Test Web Interface

```bash
# Start server
python -m http.server 8000

# Open browser
open http://localhost:8000
```

### 5. Customize Further

- Edit `config.json` for tracks/emojis
- Modify `adaptive_script.js` for UI changes
- Update `styles.css` for styling
- Regenerate with `node adaptive_ics_generator.js`

## 📱 Calendar App Compatibility

### Tested Platforms

- ✅ **Google Calendar** - Full support
- ✅ **Apple Calendar** - Full support  
- ✅ **Outlook** - Full support
- ✅ **Thunderbird** - Full support
- ✅ **Mobile Apps** - iOS/Android calendar apps

### Import Instructions

1. **Google Calendar**: 
   - Settings → Import & Export → Import → Upload ICS file
   
2. **Apple Calendar**: 
   - File → Import → Select ICS file
   
3. **Outlook**: 
   - File → Open & Export → Import/Export → Import ICS file

## 🎯 Use Cases

### Conference/Event Management
- Multi-track conferences
- Workshop schedules
- Networking events
- Academic conferences

### Corporate Events
- Team building activities
- Training sessions
- Company retreats
- Product launches

### Community Events
- Meetups and gatherings
- Festival schedules
- Educational workshops
- Social activities

### Personal Planning
- Wedding schedules
- Vacation itineraries
- Project timelines
- Family events

## 🚨 Troubleshooting

### Common Issues

1. **No events generated**
   - Check `schedule.json` format
   - Verify date/time fields
   - Check console for errors

2. **Missing emojis**
   - Update `keyword_mappings` in `config.json`
   - Check track emoji assignments
   - Verify Unicode support

3. **Import errors**
   - Validate ICS file format
   - Check timezone settings
   - Verify calendar app compatibility

### Debug Mode

```bash
# Enable verbose logging
DEBUG=true node adaptive_ics_generator.js
```

## 📊 Advanced Features

### Custom Track Colors

```json
{
  "tracks": {
    "mappings": {
      "🧠 Tech Track": {
        "color": "#4169E1",
        "emoji": "🤓"
      }
    }
  }
}
```

### All-Day Events

```json
{
  "data_types": {
    "stations": {
      "create_all_day_events": true
    },
    "quests": {
      "create_all_day_events": true
    }
  }
}
```

### Private Events

```json
{
  "export_options": {
    "include_private_events": false
  }
}
```

## 🔮 Future Enhancements

- [ ] Real-time calendar sync
- [ ] Push notifications
- [ ] Mobile app integration
- [ ] Social sharing features
- [ ] Analytics dashboard
- [ ] Multi-language auto-detection
- [ ] AI-powered event suggestions

## 📞 Support

### Quick Help

1. **Check the console** for error messages
2. **Validate your JSON** data structure
3. **Review configuration** settings
4. **Test with minimal data** first

### Community Resources

- GitHub Issues for bug reports
- Documentation updates welcome
- Feature requests encouraged
- Pull requests accepted

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to create your adaptive event calendar system? Start with the Quick Start section and customize as needed!** 🚀