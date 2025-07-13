// Process camps data from Google Sheets TSV and update schedule.json
const fs = require('fs');

// Function to parse TSV data
function parseTSV(tsvText) {
    const lines = tsvText.split('\n');
    const headers = lines[0].split('\t');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split('\t');
        
        if (values.length >= headers.length) {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header.trim()] = values[index] || '';
            });
            data.push(rowData);
        }
    }
    
    return data;
}

// Function to clean text and normalize
function cleanText(text) {
    if (!text) return '';
    return text.trim();
}

// Function to generate unique ID from camp name
function generateId(campName) {
    return campName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// Function to extract emoji from text
function extractEmoji(text) {
    const emojiMatch = text.match(/(\p{Emoji})/u);
    return emojiMatch ? emojiMatch[1] : '🏕️';
}

// Function to generate color based on camp name
function generateColor(campName) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE',
        '#AED6F1', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB'
    ];
    
    let hash = 0;
    for (let i = 0; i < campName.length; i++) {
        hash = campName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
}

// Main processing function
function processCampsData() {
    try {
        console.log('🚀 Processing camps data from Google Sheets TSV...');
        
        // Read TSV data
        const tsvData = fs.readFileSync('camps_data.tsv', 'utf8');
        const campsArray = parseTSV(tsvData);
        
        console.log(`📊 Found ${campsArray.length} camps in TSV data`);
        
        // Read current schedule.json
        const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
        
        // Process camps into stations and places
        const newStations = [];
        const newPlaces = [];
        const existingPlaceIds = new Set((scheduleData.places || []).map(p => p.id));
        
        campsArray.forEach(camp => {
            const campName = cleanText(camp['Camp']);
            const lead = cleanText(camp['Лид']);
            const coLead = cleanText(camp['Колид']);
            const lnt = cleanText(camp['LNT']);
            const hasDescription = cleanText(camp['Есть описание']) === 'Да';
            const description = cleanText(camp['Описание']);
            const schedule = cleanText(camp['Расписание']);
            const link = cleanText(camp['Ссылка']);
            
            // Skip empty or organizational entries
            if (!campName || 
                campName === 'Организаторы' || 
                campName === 'Стройка' || 
                campName === '' ||
                campName.length < 2) {
                return;
            }
            
            console.log(`📍 Processing camp: ${campName}`);
            
            const campId = generateId(campName);
            const emoji = extractEmoji(campName);
            const color = generateColor(campName);
            
            // Create station entry
            const station = {
                title: campName,
                description: hasDescription && description ? 
                    description.substring(0, 500) + (description.length > 500 ? '...' : '') : 
                    `${campName} - лагерь участников`,
                placeId: campId
            };
            
            // Add team information
            const teamMembers = [lead, coLead, lnt].filter(member => 
                member && member.startsWith('@')
            ).map(member => member.replace('@', ''));
            
            if (teamMembers.length > 0) {
                station.author = teamMembers[0];
                if (teamMembers.length > 1) {
                    station.team = teamMembers;
                }
            }
            
            if (schedule) {
                station.schedule = schedule;
            }
            
            if (link) {
                station.link = link;
            }
            
            newStations.push(station);
            
            // Create place entry if it doesn't exist
            if (!existingPlaceIds.has(campId)) {
                const place = {
                    id: campId,
                    title: campName,
                    description: hasDescription && description ? 
                        description.substring(0, 200) + (description.length > 200 ? '...' : '') :
                        `${campName} - лагерь участников`,
                    color: color
                };
                
                newPlaces.push(place);
                existingPlaceIds.add(campId);
            }
        });
        
        console.log(`✅ Processed ${newStations.length} stations and ${newPlaces.length} new places`);
        
        // Update schedule.json
        scheduleData.stations = newStations;
        scheduleData.places = [...(scheduleData.places || []), ...newPlaces];
        
        // Write updated schedule.json
        fs.writeFileSync('schedule.json', JSON.stringify(scheduleData, null, 2));
        console.log('✅ Updated schedule.json with new camps data');
        
        // Write summary file
        const summary = {
            processing_date: new Date().toISOString(),
            camps_processed: newStations.length,
            new_places_added: newPlaces.length,
            source: 'Google Sheets TSV',
            stations: newStations.map(s => ({
                title: s.title,
                author: s.author,
                teamSize: s.team ? s.team.length : (s.author ? 1 : 0),
                placeId: s.placeId,
                hasSchedule: !!s.schedule,
                hasDescription: s.description.length > 50,
                hasLink: !!s.link
            }))
        };
        
        fs.writeFileSync('camps_processing_summary.json', JSON.stringify(summary, null, 2));
        console.log('✅ Generated processing summary');
        
        // Show some stats
        console.log('\n📊 Processing Summary:');
        console.log(`📍 Total stations: ${newStations.length}`);
        console.log(`🏢 New places added: ${newPlaces.length}`);
        console.log(`👤 Stations with authors: ${newStations.filter(s => s.author).length}`);
        console.log(`👥 Stations with teams: ${newStations.filter(s => s.team).length}`);
        console.log(`📅 Stations with schedules: ${newStations.filter(s => s.schedule).length}`);
        console.log(`🔗 Stations with links: ${newStations.filter(s => s.link).length}`);
        
        console.log('\n🎯 Updated camps:');
        newStations.forEach((station, i) => {
            const teamInfo = station.team ? 
                ` (team of ${station.team.length})` : 
                (station.author ? ` (${station.author})` : '');
            console.log(`${i + 1}. ${station.title}${teamInfo}`);
        });
        
        return {
            success: true,
            stationsCount: newStations.length,
            placesCount: newPlaces.length
        };
        
    } catch (error) {
        console.error('❌ Error processing camps data:', error.message);
        return { success: false, error: error.message };
    }
}

// Run if executed directly
if (require.main === module) {
    const result = processCampsData();
    
    if (result.success) {
        console.log('\n🎉 Camps data processing completed successfully!');
        console.log('\n🔄 Next steps:');
        console.log('1. Run: node adaptive_ics_generator.js');
        console.log('2. Check the updated ICS files');
        console.log('3. Test the web interface');
        console.log('\n📝 To verify updates:');
        console.log('- Check camps_processing_summary.json for details');
        console.log('- Look at schedule.json stations section');
    } else {
        console.error('\n💥 Processing failed:', result.error);
        process.exit(1);
    }
}

module.exports = { processCampsData, parseTSV, cleanText, generateId };