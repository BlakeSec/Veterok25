#!/usr/bin/env python3
"""
Script to generate ICS calendar files from schedule.json
with emoji colorization based on activity types and tracks.
"""

import json
import re
from datetime import datetime, timedelta
from pathlib import Path

def get_emoji_for_activity(activity):
    """Get additional emojis based on activity content and type."""
    title = activity.get('title', '').lower()
    description = activity.get('description', '').lower()
    track = activity.get('track', '')
    
    # Additional emojis based on content keywords
    content_emojis = {
        'workshop': '🛠️',
        'воркшоп': '🛠️',
        'masterclass': '🎓',
        'мастер-класс': '🎓',
        'quiz': '🧩',
        'квиз': '🧩',
        'dj': '🎵',
        'music': '🎵',
        'музыка': '🎵',
        'food': '🍽️',
        'еда': '🍽️',
        'завтрак': '🍳',
        'обед': '🍽️',
        'ужин': '🍽️',
        'coffee': '☕',
        'кофе': '☕',
        'presentation': '📊',
        'презентация': '📊',
        'talk': '💬',
        'доклад': '💬',
        'networking': '🤝',
        'нетворкинг': '🤝',
        'game': '🎮',
        'игра': '🎮',
        'спорт': '🏃',
        'sport': '🏃',
        'йога': '🧘',
        'yoga': '🧘',
        'медитация': '🧘',
        'meditation': '🧘',
        'welcome': '👋',
        'приветствие': '👋',
        'opening': '🎉',
        'открытие': '🎉',
        'closing': '🏁',
        'закрытие': '🏁',
        'party': '🎊',
        'вечеринка': '🎊',
        'build': '🚧',
        'стройка': '🚧',
        'setup': '🔧',
        'подготовка': '🔧',
    }
    
    # Find matching emojis in content
    additional_emojis = []
    for keyword, emoji in content_emojis.items():
        if keyword in title or keyword in description:
            additional_emojis.append(emoji)
    
    # Remove duplicates while preserving order
    additional_emojis = list(dict.fromkeys(additional_emojis))
    
    # Limit to 3 additional emojis to avoid clutter
    return additional_emojis[:3]

def format_ics_datetime(date_str, time_str):
    """Convert date and time strings to ICS format."""
    # Extract only the time part (HH:MM) from the time string, ignoring any emojis
    time_clean = re.match(r'(\d{2}:\d{2})', time_str)
    if time_clean:
        time_str = time_clean.group(1)
    dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    return dt.strftime("%Y%m%dT%H%M%S")

def escape_ics_text(text):
    """Escape text for ICS format."""
    if not text:
        return ""
    # Replace newlines and escape special characters
    text = text.replace('\n', '\\n')
    text = text.replace('\r', '\\r')
    text = text.replace(',', '\\,')
    text = text.replace(';', '\\;')
    text = text.replace('\\', '\\\\')
    return text

def generate_ics_content(activities):
    """Generate ICS content from activities."""
    ics_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Vas3k Camp//Schedule//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Vas3k Camp 2025",
        "X-WR-CALDESC:Vas3k Camp 2025 Schedule",
        "X-WR-TIMEZONE:Europe/Belgrade",
        "BEGIN:VTIMEZONE",
        "TZID:Europe/Belgrade",
        "BEGIN:STANDARD",
        "DTSTART:20241027T030000",
        "TZOFFSETFROM:+0200",
        "TZOFFSETTO:+0100",
        "TZNAME:CET",
        "END:STANDARD",
        "BEGIN:DAYLIGHT",
        "DTSTART:20250330T020000",
        "TZOFFSETFROM:+0100",
        "TZOFFSETTO:+0200",
        "TZNAME:CEST",
        "END:DAYLIGHT",
        "END:VTIMEZONE"
    ]
    
    for i, activity in enumerate(activities):
        if not activity.get('date') or not activity.get('timeStart'):
            continue
            
        # Get additional emojis
        additional_emojis = get_emoji_for_activity(activity)
        emoji_prefix = ' '.join(additional_emojis) + ' ' if additional_emojis else ''
        
        # Format title with emojis
        title = activity.get('title', 'Untitled Event')
        enhanced_title = f"{emoji_prefix}{title}"
        
        # Format description
        description_parts = []
        if activity.get('track'):
            description_parts.append(f"Track: {activity['track']}")
        if activity.get('author'):
            description_parts.append(f"Author: {activity['author']}")
        if activity.get('description'):
            description_parts.append(f"Description: {activity['description']}")
        if activity.get('placeId'):
            description_parts.append(f"Location: {activity['placeId']}")
        
        description = '\\n\\n'.join(description_parts)
        
        # Format datetime
        start_dt = format_ics_datetime(activity['date'], activity['timeStart'])
        end_dt = format_ics_datetime(activity['date'], activity.get('timeEnd', activity['timeStart']))
        
        # Generate unique ID
        uid = f"vas3k-camp-{activity['date']}-{activity['timeStart']}-{i}@vas3k.club"
        
        # Create location
        location = activity.get('placeId', '')
        
        # Add event to ICS
        ics_lines.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTART;TZID=Europe/Belgrade:{start_dt}",
            f"DTEND;TZID=Europe/Belgrade:{end_dt}",
            f"SUMMARY:{escape_ics_text(enhanced_title)}",
            f"DESCRIPTION:{escape_ics_text(description)}",
            f"LOCATION:{escape_ics_text(location)}",
            "STATUS:CONFIRMED",
            "TRANSP:OPAQUE",
            "END:VEVENT"
        ])
    
    ics_lines.append("END:VCALENDAR")
    return '\n'.join(ics_lines)

def generate_track_specific_ics(activities, track_filter=None):
    """Generate ICS for specific track or all activities."""
    if track_filter:
        filtered_activities = [a for a in activities if a.get('track') == track_filter]
    else:
        filtered_activities = activities
    
    return generate_ics_content(filtered_activities)

def main():
    # Load schedule data
    with open('schedule.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    activities = data.get('activities', [])
    
    # Create output directory
    output_dir = Path('ics_files')
    output_dir.mkdir(exist_ok=True)
    
    # Generate main calendar with all events
    print("Generating main calendar...")
    main_ics = generate_ics_content(activities)
    with open(output_dir / 'vas3k_camp_2025_full.ics', 'w', encoding='utf-8') as f:
        f.write(main_ics)
    
    # Get unique tracks
    tracks = set()
    for activity in activities:
        if activity.get('track'):
            tracks.add(activity['track'])
    
    # Generate track-specific calendars
    for track in tracks:
        print(f"Generating calendar for track: {track}")
        track_activities = [a for a in activities if a.get('track') == track]
        track_ics = generate_ics_content(track_activities)
        
        # Clean filename
        filename = re.sub(r'[^\w\s-]', '', track).strip()
        filename = re.sub(r'[-\s]+', '_', filename)
        filename = f"vas3k_camp_2025_{filename}.ics"
        
        with open(output_dir / filename, 'w', encoding='utf-8') as f:
            f.write(track_ics)
    
    print(f"\nGenerated {len(tracks) + 1} ICS files in {output_dir}/")
    print("\nFiles created:")
    for ics_file in sorted(output_dir.glob('*.ics')):
        print(f"  - {ics_file.name}")
    
    # Print summary
    print(f"\nSummary:")
    print(f"  Total activities: {len(activities)}")
    print(f"  Unique tracks: {len(tracks)}")
    print(f"  Date range: {min(a['date'] for a in activities if a.get('date'))} to {max(a['date'] for a in activities if a.get('date'))}")

if __name__ == "__main__":
    main()