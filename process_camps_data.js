// Process camps data from Google Sheets and update schedule.json
const fs = require('fs');

// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
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

// Function to clean text from quotes and normalize
function cleanText(text) {
    if (!text) return '';
    return text.replace(/^"|"$/g, '').trim();
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
    return emojiMatch ? emojiMatch[1] : null;
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
        console.log('🚀 Processing camps data from Google Sheets...');
        
        // Read CSV data
        const csvData = fs.readFileSync('camps_data.csv', 'utf8');
        const campsArray = parseCSV(csvData);
        
        console.log(`📊 Found ${campsArray.length} camps in CSV data`);
        
        // Read current schedule.json
        const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
        
        // Process camps into stations and places
        const newStations = [];
        const newPlaces = [];
        const existingPlaceIds = new Set((scheduleData.places || []).map(p => p.id));
        
        campsArray.forEach(camp => {
            const campName = cleanText(camp['Camp']);
            const lead = cleanText(camp['Лид']);
            const description = cleanText(camp['Описание']);
            const schedule = cleanText(camp['Расписание']);
            const hasDescription = cleanText(camp['Есть описание']) === 'Да';
            
            // Skip empty or organizational entries
            if (!campName || campName === 'Организаторы' || campName === 'Стройка' || campName === '') {
                return;
            }
            
            console.log(`📍 Processing camp: ${campName}`);
            
            const campId = generateId(campName);
            const emoji = extractEmoji(campName) || '🏕️';
            const color = generateColor(campName);
            
            // Create station entry
            const station = {
                title: campName,
                description: hasDescription && description ? description : `${campName} - место для отдыха и активностей`,
                placeId: campId
            };
            
            if (lead) {
                station.author = lead.replace('@', '');
            }
            
            if (schedule) {
                station.schedule = schedule;
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
            stations: newStations.map(s => ({
                title: s.title,
                author: s.author,
                placeId: s.placeId,
                hasSchedule: !!s.schedule
            }))
        };
        
        fs.writeFileSync('camps_processing_summary.json', JSON.stringify(summary, null, 2));
        console.log('✅ Generated processing summary');
        
        // Show some stats
        console.log('\n📊 Processing Summary:');
        console.log(`📍 Total stations: ${newStations.length}`);
        console.log(`🏢 New places added: ${newPlaces.length}`);
        console.log(`👤 Stations with authors: ${newStations.filter(s => s.author).length}`);
        console.log(`📅 Stations with schedules: ${newStations.filter(s => s.schedule).length}`);
        
        console.log('\n🎯 Top 5 stations:');
        newStations.slice(0, 5).forEach((station, i) => {
            console.log(`${i + 1}. ${station.title}${station.author ? ` (${station.author})` : ''}`);
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
    } else {
        console.error('\n💥 Processing failed:', result.error);
        process.exit(1);
    }
}

module.exports = { processCampsData, parseCSV, cleanText, generateId };