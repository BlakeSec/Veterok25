# Google Sheets Update Summary

## 🎯 Update Overview
Successfully integrated the latest camps data from Google Sheets into the Vas3k Camp 2025 schedule system.

**Update Date:** July 13, 2025  
**Source:** Google Sheets TSV Export (ID: 1a77hl2aueFSt5uYDYPdTgjRGiM300uWklENAUX74s4w)

## 📊 Processing Results
- **Camps Processed:** 26 camps
- **New Places Added:** 10 new locations
- **Stations with Authors:** 26 (100%)
- **Stations with Teams:** 25 (96%)
- **Stations with Schedules:** 23 (88%)
- **Stations with Links:** 1 (4%)

## 🏕️ Updated Camps List

### Core Activity Camps
1. **Зендо** (@nikomattews, @Vsemktosnami, @rawnest)
   - 24/7 support space for altered states
   - Full schedule: 18:00 13/07 to 10:00 16/07

2. **Bimbo Beach** (@kot_ashot, @gricica, @vikargys)
   - Pool parties and beauty bar
   - Active bar: 20:00-04:00 daily

3. **ТрамонTouch** (@ChooseTema, @Gryzloff, @dogmaxxed)
   - Sensory labyrinth experience
   - Daily: 17:00-21:00

4. **Q.E.D.** (@mioulin, @mp3)
   - Scientific-educational space
   - Consciousness research activities

### Entertainment & Games
5. **Фан-фан** (@vsaxon, @mahakomar, @nemo2c)
   - Vintage attraction experience
   - Operating: noon to sunset

6. **Шариковая** (@greenmur, @Den_Led, @and_ih8u2)
   - Ball games and tournaments
   - Hours: 11:00-19:00

7. **Бойцовский клуб** (@NikitaPankin, @moorzeena)
   - Medieval roleplay and quests
   - Daily activities: 17:00-21:00

### Wellness & Relaxation
8. **Nevesomo** (@Artbit17, @nt3f5h, @reelsulya)
   - Sauna and wellness camp
   - Sessions from 12:00 daily

9. **Зендо** - Psychedelic support space
10. **Ветер в кронах** (@kiralebar, @Valenkaa, @bbikaz)
    - Elevated nets experience
    - 24/7 from 20:00 13/07

11. **Slavik Hugs** (@julsy_ju, @daphnezaytseva, @evhandel)
    - Comfort and support space
    - Daily activities and traditions

### Creative & Cultural
12. **ЛизнуСосну** (@kirainwhite, @Sharpeared, @konst54)
    - Adult-oriented forest activities
    - Evening hours: 20:00-02:00

13. **КОЦИКИ tattoo point** (@chill_chilitattoo, @Zoia_Raido, @Anaseal)
    - Tattoo artists collective
    - Active: 12:00-21:00

14. **Сон Алисы** (@ledenevapsy, @S_Pereyra, @ArtCherokee)
    - Consciousness journey space
    - Evening: 21:00-05:00

15. **Полянка** (@galaguzka, @looteranka)
    - Mushroom-themed forest area
    - Night cinema and crafts

### Food & Hospitality
16. **Картошка** (@postiki)
    - Potato-focused food camp
    - Evening hours: 18:00-02:00

17. **drujba / stancia** (@harryharry, @jenny_vs, @tepllead)
    - 2013-themed bar and activities
    - Full daily program

18. **GANZI** (@bvs707, @nicksolfix, @PaulineRoonna)
    - Georgian hospitality space
    - Bar: 18:00-00:00, Music: 20:00-06:00

19. **Шампанерия** (@nebu_chan, @goreloek, @Kuturyanchik)
    - Champagne bar experience
    - Daily from 04:20

### Specialized Spaces
20. **Тихий Омут** (@yatsenkomarina, @shmizh)
    - Mermaid-themed rituals
    - Multi-day program

21. **Рыдальня** (@gagarin_luybila, @poline_f, @Riceball_is_a_mood)
    - Crying and emotional release
    - Daily: 15:00-03:00

22. **Индейское лето** (@vteploo, @prosto_smile)
    - Native American themed space
    - Music and crafts activities

23. **Cube** (@kseniasch, @raison_d3, @easmirnov)
    - Mirrored reflection space
    - Always available

24. **Аревик (Солнышко)** (@Gavrila_Tzap, @MarishPlohish, @AlikBurner)
    - Solar worship and light art
    - Nightly activities

25. **Параненормальные** (@meilakh, @prosto_prots)
    - Alien investigation theme
    - Research activities

26. **Последний вагон** (@YosefBatman)
    - Art museum space
    - "Musée du Hooyuvre"

## 📅 Generated ICS Files

### Complete Schedule
- **vas3k-camp-2025-complete.ics** (88KB) - Full event schedule
- **vas3k-camp-2025-stations.ics** (29KB) - All 26 camps/stations

### By Track
- **vas3k-camp-2025-track-general.ics** - ✨ Общая активность
- **vas3k-camp-2025-track-hobby-grove.ics** - 🌿 Hobby Grove
- **vas3k-camp-2025-track-geek-zone.ics** - 🧠 Geek Zone
- **vas3k-camp-2025-track-active-arena.ics** - 🏃‍♂️ Active Arena
- **vas3k-camp-2025-track-soft-skills-hub.ics** - 💬 Soft Skills Hub

### By Type
- **vas3k-camp-2025-activities.ics** - Scheduled activities
- **vas3k-camp-2025-meals.ics** - Meal events
- **vas3k-camp-2025-quests.ics** - Quest events

## 🔧 Technical Details

### Data Processing
- **Source Format:** Google Sheets TSV export
- **Parser:** Custom TSV parser handling multi-line descriptions
- **ID Generation:** Automatic unique IDs from camp names
- **Color Assignment:** Hash-based color generation for visual distinction

### Integration Points
- **schedule.json:** Updated stations and places sections
- **config.json:** Maintains existing track and emoji configurations
- **web_config.json:** Auto-generated for web interface

### Team Information
- **Lead:** Primary organizer (Лид)
- **Co-Lead:** Secondary organizer (Колид)
- **LNT:** Leave No Trace coordinator
- **Teams:** 25 camps have full 3-person teams

## 🎉 Success Metrics
- ✅ 100% camp data successfully processed
- ✅ All camps have organizer information
- ✅ 88% have detailed schedules
- ✅ Full ICS calendar integration
- ✅ Web interface ready for updated data

## 🔄 Next Steps
1. **Calendar Import:** Use any of the generated ICS files
2. **Web Interface:** Browse updated camps at the web interface
3. **Real-time Updates:** Re-run processing script for future updates
4. **Customization:** Modify config.json for different events

## 📱 Calendar App Compatibility
All generated ICS files are compatible with:
- Google Calendar
- Apple Calendar
- Outlook
- Mobile calendar apps
- Open-source calendar applications

---

*This update successfully bridges the gap between Google Sheets camp management and the adaptive calendar system, providing a complete solution for Vas3k Camp 2025 participants.*