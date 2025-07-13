# ICS Calendar Generation with Emoji Colorization

## Overview
Generated ICS (iCalendar) files from the `schedule.json` data with enhanced emoji colorization based on activity types and content analysis.

## Generated Files

### Main Calendar
- **`vas3k_camp_2025_full.ics`** - Complete calendar with all 56 activities from June 5-8, 2025

### Track-Specific Calendars
- **`vas3k_camp_2025_Общая_активность.ics`** - ✨ General activities (welcome, networking, quiz, etc.)
- **`vas3k_camp_2025_Geek_Zone.ics`** - 🧠 Tech/programming activities (masterclasses, presentations)
- **`vas3k_camp_2025_Hobby_Grove.ics`** - 🌿 Hobby activities (workshops, creative sessions)
- **`vas3k_camp_2025_Active_Arena.ics`** - 🏃‍♂️ Physical activities (sports, yoga, active games)
- **`vas3k_camp_2025_Soft_Skills_Hub.ics`** - 💬 Communication and soft skills activities

## Emoji Enhancement System

### Content-Based Emoji Detection
The system automatically adds relevant emojis based on activity content:

#### Workshop & Learning Activities
- 🛠️ for workshops ("воркшоп", "workshop")
- 🎓 for masterclasses ("мастер-класс", "masterclass")

#### Entertainment & Social
- 🧩 for quizzes ("квиз", "quiz")
- 🎵 for music/DJ activities ("dj", "музыка")
- 🤝 for networking ("нетворкинг", "networking")
- 🎮 for games ("игра", "game")
- 🎉 for opening ceremonies ("открытие", "opening")
- 🎊 for parties ("вечеринка", "party")

#### Food & Dining
- 🍳 for breakfast ("завтрак")
- 🍽️ for meals ("еда", "обед", "ужин")
- ☕ for coffee ("кофе", "coffee")

#### Physical Activities
- 🏃 for sports ("спорт", "sport")
- 🧘 for yoga/meditation ("йога", "медитация")

#### Communication & Presentations
- 💬 for talks ("доклад", "talk")
- 📊 for presentations ("презентация", "presentation")

#### Setup & Organization
- 🚧 for build-up/construction ("стройка", "build")
- 🔧 for setup ("подготовка", "setup")
- 👋 for welcome activities ("welcome", "приветствие")

## Technical Features

### Proper ICS Format
- Full RFC 5545 compliant iCalendar format
- Timezone support for Europe/Belgrade
- Proper text escaping for special characters
- Unique UIDs for each event

### Smart Time Parsing
- Handles emoji-enhanced time fields (e.g., "11:00 🍲")
- Extracts clean time format using regex
- Supports both start and end times

### Enhanced Event Details
Each event includes:
- **Track information** - Shows which activity track it belongs to
- **Author information** - When available, includes presenter/organizer
- **Rich descriptions** - Full activity descriptions with proper formatting
- **Location mapping** - Venue information from placeId
- **Enhanced titles** - Original title with contextual emojis

## Usage Instructions

1. **Import Individual Track Calendars**: Import specific track calendars to your calendar app to follow only certain types of activities
2. **Import Full Calendar**: Import the complete calendar to see all activities
3. **Calendar App Compatibility**: Works with Google Calendar, Apple Calendar, Outlook, and other ICS-compatible applications

## Example Enhanced Titles

Original → Enhanced:
- "🪢 Воркшоп 'Вяжем морские узлы'" → "🛠️ 🪢 Воркшоп 'Вяжем морские узлы'"
- "👋 WELCOME 👋" → "👋 👋 WELCOME 👋"
- "🚧🚧🚧 Vas3k Camp: Build-up 🚧🚧🚧" → "🚧 🚧🚧🚧 Vas3k Camp: Build-up 🚧🚧🚧"

## Statistics
- **Total Activities**: 56 events
- **Date Range**: June 5-8, 2025
- **Unique Tracks**: 5 activity categories
- **Files Generated**: 6 ICS files (1 full + 5 track-specific)
- **Timezone**: Europe/Belgrade with DST support

The calendars are now ready to import into any calendar application!