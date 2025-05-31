// Global variables
let scheduleData = [];
let mealsData = [];
let currentDay = '';
let favorites = [];

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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
    loadFavorites();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Favorites toggle
    document.getElementById('favoritesToggle').addEventListener('change', displaySchedule);

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // Toggle favorite
    document.getElementById('toggleFavorite').addEventListener('click', () => {
        const activityId = document.getElementById('toggleFavorite').dataset.activityId;
        if (activityId) toggleFavorite(activityId);
    });

    // Window click to close modal
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('activityModal')) closeModal();
    });

    // Resize handler with debounce
    window.addEventListener('resize', debounce(() => {
        displaySchedule();
    }, 250));
}

// Load schedule data from JSON file
async function loadSchedule() {
    try {
        const response = await fetch('schedule.json');
        const data = await response.json();
        scheduleData = data.activities;
        mealsData = data.meals || [];

        // Get unique days from schedule
        const days = [...new Set(scheduleData.map(activity => activity.date))].sort();

        // Create day tabs
        createDayTabs(days);

        // Set default day (today or first day)
        setDefaultDay(days);

    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('tracksContainer').innerHTML = '<p class="error-message">Ошибка загрузки расписания. Пожалуйста, попробуйте позже.</p>';
    }
}

// Create tabs for each day
function createDayTabs(days) {
    const dayTabsContainer = document.getElementById('dayTabs');
    dayTabsContainer.innerHTML = '';

    days.forEach(day => {
        const date = new Date(day);
        const weekdayName = getWeekdayName(date);

        const tab = document.createElement('div');
        tab.className = 'day-tab';
        tab.dataset.date = day;
        tab.textContent = `${formatDate(day)} (${weekdayName})`;

        tab.addEventListener('click', () => {
            selectDay(day);
        });

        dayTabsContainer.appendChild(tab);
    });
}

// Get weekday name in Russian
function getWeekdayName(date) {
    const weekdayNames = [
        'вс', 'пн', 'вт', 'ср', 
        'чт', 'пт', 'сб'
    ];
    return weekdayNames[date.getDay()];
}

// Format date as "DD Month"
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');

    // Array of month names in Russian
    const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
}

// Set default day (today or first available day)
function setDefaultDay(days) {
    const today = new Date().toISOString().split('T')[0];
    let defaultDay = days.find(day => day >= today) || days[0];
    selectDay(defaultDay);
}

// Select a day and display its schedule
function selectDay(day) {
    currentDay = day;

    // Update active tab
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.date === day);
    });

    // Display schedule for selected day
    displaySchedule();
}

// Display schedule for current day
function displaySchedule() {
    // Filter activities for current day
    let activities = scheduleData.filter(activity => activity.date === currentDay);

    // Filter meals for current day
    let meals = mealsData.filter(meal => meal.date === currentDay);

    // Apply favorites filter if enabled
    if (document.getElementById('favoritesToggle').checked) {
        activities = activities.filter(activity => favorites.includes(getActivityId(activity)));
    }

    // Get time range for the day (considering both activities and meals)
    const allEvents = [...activities, ...meals];
    const timeRange = getTimeRange(allEvents);

    // Clear previous content
    const tracksContainer = document.getElementById('tracksContainer');
    tracksContainer.innerHTML = '';

    // Create time column
    const timeColumn = document.querySelector('.time-column');
    timeColumn.innerHTML = '';

    // Create time markers
    for (let time = timeRange.start; time <= timeRange.end; time += 60) {
        let hour = Math.floor(time / 60);
        const minute = time % 60;

        // Format time string for display
        let timeString;
        if (hour === 24) {
            timeString = `00:00`;
        } else if (hour > 24) {
            // For hours past midnight (e.g., 1 AM becomes 01:00)
            timeString = `${(hour - 24).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        } else {
            timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }

        const timeMarker = document.createElement('div');
        timeMarker.className = 'time-marker';
        timeMarker.dataset.timeMinutes = time; // Store original time in minutes for correct positioning

        // Check if this hour falls within any meal's time range
        const currentTimeMinutes = time; // Use the original time in minutes
        const mealAtThisHour = meals.find(meal => {
            const mealStartMinutes = timeToMinutes(meal.timeStart);
            const mealEndMinutes = timeToMinutes(meal.timeEnd);
            return currentTimeMinutes >= mealStartMinutes && currentTimeMinutes < mealEndMinutes;
        });

        if (mealAtThisHour) {
            // Add special class for styling
            timeMarker.classList.add('time-marker-with-meal');

            // Create hour label
            const hourLabel = document.createElement('div');
            hourLabel.className = 'hour-label';
            hourLabel.textContent = timeString;

            // Create meal label
            const mealLabel = document.createElement('div');
            mealLabel.className = 'meal-label';

            // Add emoji based on meal type
            let mealEmoji = '';
            if (mealAtThisHour.title === 'Завтрак') {
                mealEmoji = '🍳 ';
            } else if (mealAtThisHour.title === 'Обед') {
                mealEmoji = '🍲 ';
            } else if (mealAtThisHour.title === 'Ужин') {
                mealEmoji = '🍽️ ';
            }

            mealLabel.textContent = mealEmoji + mealAtThisHour.title;

            // Add both to the time marker
            timeMarker.appendChild(hourLabel);
            timeMarker.appendChild(mealLabel);
        } else {
            // Just show the hour
            timeMarker.textContent = timeString;
        }

        timeColumn.appendChild(timeMarker);
    }

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        displayMobileSchedule(activities, timeRange);
    } else {
        displayDesktopSchedule(activities, timeRange);
    }
}

// Display schedule in desktop view (columns for tracks)
function displayDesktopSchedule(activities, timeRange) {
    const tracksContainer = document.getElementById('tracksContainer');

    // Define tracks
    const tracksList = [
        { id: '🧠 Geek Zone', name: '🧠 Geek Zone', class: 'geek-track' },
        { id: '🏃‍♂️ Active Arena', name: '🏃‍♂️ Active Arena', class: 'active-track' },
        { id: '💬 Soft Skills Hub', name: '💬 Soft Skills Hub', class: 'soft-skills' },
        { id: '🌿 Hobby Grove', name: '🌿 Hobby Grove', class: 'hobby-track' }
    ];

    // Create track columns
    tracksList.forEach(track => {
        const trackColumn = document.createElement('div');
        trackColumn.className = 'track-column';
        trackColumn.dataset.track = track.id;

        const trackHeader = document.createElement('div');
        trackHeader.className = 'track-header';
        trackHeader.textContent = track.name;

        trackColumn.appendChild(trackHeader);
        tracksContainer.appendChild(trackColumn);
    });

    // Group activities by track and date for detecting overlaps
    const trackDateGroups = {};

    activities.forEach(activity => {
        if (activity.type === 'general' || activity.track === 'Все треки') {
            return; // Skip general events for grouping
        }

        const key = `${activity.date}_${activity.track}`;
        if (!trackDateGroups[key]) {
            trackDateGroups[key] = [];
        }
        trackDateGroups[key].push(activity);
    });

    // Find overlapping activities within each track/date group
    const groupedActivities = {};

    Object.entries(trackDateGroups).forEach(([key, trackActivities]) => {
        // Sort activities by start time
        trackActivities.sort((a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart));

        // Check each pair of activities for overlap
        for (let i = 0; i < trackActivities.length; i++) {
            for (let j = i + 1; j < trackActivities.length; j++) {
                const activity1 = trackActivities[i];
                const activity2 = trackActivities[j];

                const start1 = timeToMinutes(activity1.timeStart);
                const end1 = timeToMinutes(activity1.timeEnd);
                const start2 = timeToMinutes(activity2.timeStart);
                const end2 = timeToMinutes(activity2.timeEnd);

                // Check if activities overlap in time
                if (start1 < end2 && start2 < end1) {
                    // Create a key for this pair of overlapping activities
                    const overlapKey = `${key}_${activity1.timeStart}_${activity1.timeEnd}_${activity2.timeStart}_${activity2.timeEnd}`;
                    groupedActivities[overlapKey] = [activity1, activity2];

                    // Mark these activities as processed
                    activity1.processed = true;
                    activity2.processed = true;
                }
            }
        }

        // Add non-overlapping activities
        trackActivities.forEach(activity => {
            if (!activity.processed) {
                const singleKey = `${key}_${activity.timeStart}_${activity.timeEnd}`;
                groupedActivities[singleKey] = [activity];
            }
        });
    });

    // Process regular activities (non-overlapping or merged)
    const processedActivities = new Set(); // Track which activities have been processed

    // First, add general events
    activities.forEach(activity => {
        if (activity.type === 'general' || activity.track === 'Все треки') {
            createActivityCard(activity, timeRange, tracksContainer);
            processedActivities.add(getActivityId(activity));
        }
    });

    // Then process grouped activities (potentially overlapping)
    Object.values(groupedActivities).forEach(group => {
        if (group.length === 1) {
            // Single activity, no overlap
            const activity = group[0];
            createActivityCard(activity, timeRange, tracksContainer);
            processedActivities.add(getActivityId(activity));
        } else if (group.length === 2) {
            // Two overlapping activities - create a merged card on desktop
            createMergedActivityCard(group, timeRange, tracksContainer);
            group.forEach(activity => {
                processedActivities.add(getActivityId(activity));
            });
        } else {
            // More than two overlapping activities - handle individually for now
            // This could be extended to handle more than two activities if needed
            group.forEach(activity => {
                createActivityCard(activity, timeRange, tracksContainer);
                processedActivities.add(getActivityId(activity));
            });
        }
    });

    // Process any remaining activities that weren't grouped
    activities.forEach(activity => {
        if (!processedActivities.has(getActivityId(activity)) && 
            activity.type !== 'general' && 
            activity.track !== 'Все треки') {
            createActivityCard(activity, timeRange, tracksContainer);
        }
    });
}

// Create a regular activity card
function createActivityCard(activity, timeRange, tracksContainer) {
    const startMinutes = timeToMinutes(activity.timeStart);
    const endMinutes = timeToMinutes(activity.timeEnd);
    const duration = endMinutes - startMinutes;

    const top = ((startMinutes - timeRange.start) / 60) * 80; // 80px per 60 minutes
    const height = (duration / 60) * 80;

    const card = document.createElement('div');
    card.className = 'activity-card';
    card.style.top = `${top}px`;
    card.style.minHeight = `${height}px`;
    card.style.height = 'auto'; // Allow dynamic height based on content

    // Add class for short activities (1 hour or less)
    if (duration <= 60) {
        card.classList.add('short-activity');
    }

    // Add track-specific class
    if (activity.track === '🧠 Geek Zone') {
        card.classList.add('geek-track');
    } else if (activity.track === '🏃‍♂️ Active Arena') {
        card.classList.add('active-track');
    } else if (activity.track === '💬 Soft Skills Hub') {
        card.classList.add('soft-skills');
    } else if (activity.track === '🌿 Hobby Grove') {
        card.classList.add('hobby-track');
    } else if (activity.track === 'Все треки') {
        card.classList.add('all-tracks');
    }

    // Add special class for general events
    if (activity.type === 'general') {
        card.classList.add('general-event');

        // For 1-hour general activities, set a specific height without !important
        if (duration <= 60) {
            card.style.height = `${height}px`;
            card.style.minHeight = `${height}px`;
            card.style.maxHeight = `${height}px`;
        } else {
            card.style.height = `${height}px`;
        }

        // Add private class for private activities
        if (activity.private === true) {
            card.classList.add('private-event');
        }
    }

    // Add favorite class if needed
    if (favorites.includes(getActivityId(activity))) {
        card.classList.add('favorite');
    }

    const title = document.createElement('div');
    title.className = 'activity-title';
    title.textContent = activity.title;

    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = `${activity.timeStart} - ${activity.timeEnd}`;

    card.appendChild(title);

    // Create a container for time and track badge
    const metaContainer = document.createElement('div');
    metaContainer.className = 'activity-meta-container';

    // Add time to the container
    metaContainer.appendChild(time);

    // Only add track badge for regular activities (not general events)
    if (!activity.type || activity.type !== 'general') {
        const trackBadge = document.createElement('div');
        trackBadge.className = 'track-badge';
        if (activity.track === '🧠 Geek Zone') {
            trackBadge.classList.add('geek-track');
        } else if (activity.track === '🏃‍♂️ Active Arena') {
            trackBadge.classList.add('active-track');
        } else if (activity.track === '💬 Soft Skills Hub') {
            trackBadge.classList.add('soft-skills');
        } else if (activity.track === '🌿 Hobby Grove') {
            trackBadge.classList.add('hobby-track');
        } else if (activity.track === 'Все треки') {
            trackBadge.classList.add('all-tracks');
        }
        trackBadge.textContent = activity.track;
        metaContainer.appendChild(trackBadge);
    }

    // Add the container to the card
    card.appendChild(metaContainer);

    // Add click event to open modal
    card.addEventListener('click', () => {
        openActivityModal(activity);
    });

    if (activity.type === 'general') {
        // For general events (spanning all tracks)
        tracksContainer.appendChild(card);
    } else if (activity.track === 'Все треки') {
        // For activities spanning all tracks (legacy support)
        card.classList.add('all-tracks');
        tracksContainer.appendChild(card);
    } else {
        // For track-specific activities
        const trackColumn = tracksContainer.querySelector(`.track-column[data-track="${activity.track}"]`);
        if (trackColumn) {
            trackColumn.appendChild(card);
        }
    }
}

// Create a merged card for two overlapping activities
function createMergedActivityCard(activities, timeRange, tracksContainer) {
    if (activities.length !== 2) return;

    const activity1 = activities[0];
    const activity2 = activities[1];

    // Use the earliest start time and latest end time for the merged card
    const startMinutes1 = timeToMinutes(activity1.timeStart);
    const endMinutes1 = timeToMinutes(activity1.timeEnd);
    const startMinutes2 = timeToMinutes(activity2.timeStart);
    const endMinutes2 = timeToMinutes(activity2.timeEnd);

    const startMinutes = Math.min(startMinutes1, startMinutes2);
    const endMinutes = Math.max(endMinutes1, endMinutes2);
    const duration = endMinutes - startMinutes;

    // Convert start and end minutes back to time strings for display
    const startHour = Math.floor(startMinutes / 60);
    const startMinute = startMinutes % 60;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    // Format time strings with special handling for midnight and times past midnight
    let startTimeString;
    if (startHour === 24) {
        startTimeString = `00:00`;
    } else if (startHour > 24) {
        startTimeString = `${(startHour - 24).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    } else {
        startTimeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    }

    let endTimeString;
    if (endHour === 24) {
        endTimeString = `00:00`;
    } else if (endHour > 24) {
        endTimeString = `${(endHour - 24).toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    } else {
        endTimeString = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }

    const top = ((startMinutes - timeRange.start) / 60) * 80; // 80px per 60 minutes
    const height = (duration / 60) * 80;

    const card = document.createElement('div');
    card.className = 'activity-card merged-activity-card';
    card.style.top = `${top}px`;
    card.style.minHeight = `${height}px`;
    card.style.height = 'auto'; // Allow dynamic height based on content

    // Add track-specific class
    if (activity1.track === '🧠 Geek Zone') {
        card.classList.add('geek-track');
    } else if (activity1.track === '🏃‍♂️ Active Arena') {
        card.classList.add('active-track');
    } else if (activity1.track === '💬 Soft Skills Hub') {
        card.classList.add('soft-skills');
    } else if (activity1.track === '🌿 Hobby Grove') {
        card.classList.add('hobby-track');
    }

    // Add favorite class if both activities are favorites
    if (favorites.includes(getActivityId(activity1)) && favorites.includes(getActivityId(activity2))) {
        card.classList.add('favorite');
    }

    // Create container for first activity
    const activity1Container = document.createElement('div');
    activity1Container.className = 'merged-activity-item';

    const title1 = document.createElement('div');
    title1.className = 'activity-title';
    title1.innerHTML = `1️⃣ ${activity1.title}`;

    activity1Container.appendChild(title1);

    // Create container for second activity
    const activity2Container = document.createElement('div');
    activity2Container.className = 'merged-activity-item';

    const title2 = document.createElement('div');
    title2.className = 'activity-title';
    title2.innerHTML = `2️⃣ ${activity2.title}`;

    activity2Container.appendChild(title2);

    // Add a separator between activities
    const separator = document.createElement('div');
    separator.className = 'merged-activity-separator';

    // Create a container for time and track badge (at the bottom of the card)
    const metaContainer = document.createElement('div');
    metaContainer.className = 'activity-meta-container';

    // Add combined time to the container
    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = `${startTimeString} - ${endTimeString}`;
    metaContainer.appendChild(time);

    // Add track badge
    const trackBadge = document.createElement('div');
    trackBadge.className = 'track-badge';
    if (activity1.track === '🧠 Geek Zone') {
        trackBadge.classList.add('geek-track');
    } else if (activity1.track === '🏃‍♂️ Active Arena') {
        trackBadge.classList.add('active-track');
    } else if (activity1.track === '💬 Soft Skills Hub') {
        trackBadge.classList.add('soft-skills');
    } else if (activity1.track === '🌿 Hobby Grove') {
        trackBadge.classList.add('hobby-track');
    }
    trackBadge.textContent = activity1.track;
    metaContainer.appendChild(trackBadge);

    // Create a wrapper for meta container to add horizontal padding
    const metaWrapper = document.createElement('div');
    metaWrapper.className = 'merged-activity-meta-wrapper';
    metaWrapper.appendChild(metaContainer);

    // Add all elements to the card
    card.appendChild(activity1Container);
    card.appendChild(separator);
    card.appendChild(activity2Container);
    card.appendChild(metaWrapper);

    // Add click event to open merged modal
    card.addEventListener('click', () => {
        openMergedActivityModal(activity1, activity2);
    });

    // Add the card to the appropriate track column
    const trackColumn = tracksContainer.querySelector(`.track-column[data-track="${activity1.track}"]`);
    if (trackColumn) {
        trackColumn.appendChild(card);
    }
}

// Display schedule in mobile view (vertical timeline)
function displayMobileSchedule(activities, timeRange) {
    const tracksContainer = document.getElementById('tracksContainer');

    const mobileTimeline = document.createElement('div');
    mobileTimeline.className = 'mobile-timeline';

    // Sort activities by start time
    activities.sort((a, b) => {
        const timeA = timeToMinutes(a.timeStart);
        const timeB = timeToMinutes(b.timeStart);
        return timeA - timeB;
    });

    // Group activities by time blocks (rounded down to the nearest hour)
    const timeBlocks = {};

    activities.forEach(activity => {
        const startTime = activity.timeStart;
        // Extract the hour part (e.g., "11" from "11:30")
        const hourPart = startTime.split(':')[0] + ':00';

        if (!timeBlocks[hourPart]) {
            timeBlocks[hourPart] = [];
        }
        timeBlocks[hourPart].push(activity);
    });

    // Create time blocks for every hour in the time range
    for (let time = timeRange.start; time <= timeRange.end; time += 60) {
        let hour = Math.floor(time / 60);
        const minute = time % 60;

        // Format time string for display
        let timeString;
        if (hour === 24) {
            timeString = `00:00`;
        } else if (hour > 24) {
            // For hours past midnight (e.g., 1 AM becomes 01:00)
            timeString = `${(hour - 24).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        } else {
            timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }

        // Get activities for this hour
        const timeActivities = timeBlocks[timeString] || [];

        // Check if this hour falls within any meal's time range
        const currentTimeMinutes = time; // Use the original time in minutes
        const mealAtThisHour = mealsData.filter(meal => meal.date === currentDay).find(meal => {
            const mealStartMinutes = timeToMinutes(meal.timeStart);
            const mealEndMinutes = timeToMinutes(meal.timeEnd);
            return currentTimeMinutes >= mealStartMinutes && currentTimeMinutes < mealEndMinutes;
        });

        // Only create time block if there are activities or a meal at this hour
        if (timeActivities.length > 0 || mealAtThisHour) {
            const timeBlock = document.createElement('div');
            timeBlock.className = 'time-block';

            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';

            // Create time label with meal badge if needed
            if (mealAtThisHour) {
                // Create time text
                const timeText = document.createElement('span');
                timeText.textContent = timeString;
                timeLabel.appendChild(timeText);

                // Create meal badge
                const mealBadge = document.createElement('span');
                mealBadge.className = 'meal-badge';

                // Add emoji based on meal type
                let mealEmoji = '';
                if (mealAtThisHour.title === 'Завтрак') {
                    mealEmoji = '🍳 ';
                } else if (mealAtThisHour.title === 'Обед') {
                    mealEmoji = '🥗 ';
                } else if (mealAtThisHour.title === 'Ужин') {
                    mealEmoji = '🍽 ';
                }

                mealBadge.textContent = mealEmoji + mealAtThisHour.title;
                timeLabel.appendChild(mealBadge);
            } else {
                // Just show the time
                timeLabel.textContent = timeString;
            }

            timeBlock.appendChild(timeLabel);

            const activitiesContainer = document.createElement('div');
            activitiesContainer.className = 'mobile-activities';

            // Add activities if there are any for this hour
            if (timeActivities.length > 0) {
                // Sort activities within this time block by their actual start time
                timeActivities.sort((a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart));

                timeActivities.forEach(activity => {
                    const mobileActivity = document.createElement('div');
                    mobileActivity.className = 'mobile-activity';

                    // Calculate duration for mobile view
                    const startMinutes = timeToMinutes(activity.timeStart);
                    const endMinutes = timeToMinutes(activity.timeEnd);
                    const duration = endMinutes - startMinutes;

                    // Add class for short activities (1 hour or less)
                    if (duration <= 60) {
                        mobileActivity.classList.add('short-activity');
                    }

                    // Add track-specific class
                    if (activity.track === '🧠 Geek Zone') {
                        mobileActivity.classList.add('geek-track');
                    } else if (activity.track === '🏃‍♂️ Active Arena') {
                        mobileActivity.classList.add('active-track');
                    } else if (activity.track === '💬 Soft Skills Hub') {
                        mobileActivity.classList.add('soft-skills');
                    } else if (activity.track === '🌿 Hobby Grove') {
                        mobileActivity.classList.add('hobby-track');
                    } else if (activity.track === 'Все треки') {
                        mobileActivity.classList.add('all-tracks');
                    }

                    // Add special class for general events
                    if (activity.type === 'general') {
                        mobileActivity.classList.add('general-event');

                        // Add private class for private activities
                        if (activity.private === true) {
                            mobileActivity.classList.add('private-event');
                        }
                    }

                    // Add favorite class if needed
                    if (favorites.includes(getActivityId(activity))) {
                        mobileActivity.classList.add('favorite');
                    }

                    const title = document.createElement('div');
                    title.className = 'activity-title';
                    title.textContent = activity.title;

                    const time = document.createElement('div');
                    time.className = 'activity-time';
                    time.textContent = `${activity.timeStart} - ${activity.timeEnd}`;

                    mobileActivity.appendChild(title);

                    // Create a container for time and track badge
                    const metaContainer = document.createElement('div');
                    metaContainer.className = 'activity-meta-container';

                    // Add time to the container
                    metaContainer.appendChild(time);

                    // Only add track badge for regular activities (not general events)
                    if (!activity.type || activity.type !== 'general') {
                        const trackBadge = document.createElement('div');
                        trackBadge.className = 'track-badge';
                        if (activity.track === '🧠 Geek Zone') {
                            trackBadge.classList.add('geek-track');
                        } else if (activity.track === '🏃‍♂️ Active Arena') {
                            trackBadge.classList.add('active-track');
                        } else if (activity.track === '💬 Soft Skills Hub') {
                            trackBadge.classList.add('soft-skills');
                        } else if (activity.track === '🌿 Hobby Grove') {
                            trackBadge.classList.add('hobby-track');
                        } else if (activity.track === 'Все треки') {
                            trackBadge.classList.add('all-tracks');
                        }
                        trackBadge.textContent = activity.track;
                        metaContainer.appendChild(trackBadge);
                    }

                    // Add the container to the mobile activity
                    mobileActivity.appendChild(metaContainer);

                    // Add click event to open modal
                    mobileActivity.addEventListener('click', () => {
                        openActivityModal(activity);
                    });

                    activitiesContainer.appendChild(mobileActivity);
                });
            }

            timeBlock.appendChild(activitiesContainer);
            mobileTimeline.appendChild(timeBlock);
        }
    }

    tracksContainer.appendChild(mobileTimeline);
}

// Open modal with activity details
function openActivityModal(activity) {
    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTime = document.getElementById('modalTime');
    const modalTrack = document.getElementById('modalTrack');
    const modalDescription = document.getElementById('modalDescription');
    const toggleFavoriteBtn = document.getElementById('toggleFavorite');

    modalTitle.textContent = activity.title;
    modalTime.textContent = `${activity.timeStart} - ${activity.timeEnd}`;
    modalTrack.textContent = activity.track;

    // Add track-specific class to the track badge
    modalTrack.className = 'track-badge'; // Reset classes
    if (activity.track === '🧠 Geek Zone') {
        modalTrack.classList.add('geek-track');
    } else if (activity.track === '🏃‍♂️ Active Arena') {
        modalTrack.classList.add('active-track');
    } else if (activity.track === '💬 Soft Skills Hub') {
        modalTrack.classList.add('soft-skills');
    } else if (activity.track === '🌿 Hobby Grove') {
        modalTrack.classList.add('hobby-track');
    } else if (activity.track === 'Все треки') {
        modalTrack.classList.add('all-tracks');
    }

    modalDescription.textContent = activity.description;

    const activityId = getActivityId(activity);
    const isFavorite = favorites.includes(activityId);

    toggleFavoriteBtn.classList.toggle('active', isFavorite);
    toggleFavoriteBtn.querySelector('.favorite-text').textContent = 
        isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';

    toggleFavoriteBtn.dataset.activityId = activityId;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open modal with merged activity details
function openMergedActivityModal(activity1, activity2) {
    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTime = document.getElementById('modalTime');
    const modalTrack = document.getElementById('modalTrack');
    const modalDescription = document.getElementById('modalDescription');
    const modalFooter = document.querySelector('.modal-footer');

    // Set title with both activities
    modalTitle.innerHTML = `1️⃣ ${activity1.title}<br>2️⃣ ${activity2.title}`;

    // Calculate combined time range
    const startMinutes1 = timeToMinutes(activity1.timeStart);
    const endMinutes1 = timeToMinutes(activity1.timeEnd);
    const startMinutes2 = timeToMinutes(activity2.timeStart);
    const endMinutes2 = timeToMinutes(activity2.timeEnd);

    const startMinutes = Math.min(startMinutes1, startMinutes2);
    const endMinutes = Math.max(endMinutes1, endMinutes2);

    // Convert start and end minutes back to time strings for display
    const startHour = Math.floor(startMinutes / 60);
    const startMinute = startMinutes % 60;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    // Format time strings with special handling for midnight and times past midnight
    let startTimeString;
    if (startHour === 24) {
        startTimeString = `00:00`;
    } else if (startHour > 24) {
        startTimeString = `${(startHour - 24).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    } else {
        startTimeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    }

    let endTimeString;
    if (endHour === 24) {
        endTimeString = `00:00`;
    } else if (endHour > 24) {
        endTimeString = `${(endHour - 24).toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    } else {
        endTimeString = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }

    // Set single time range
    modalTime.textContent = `${startTimeString} - ${endTimeString}`;

    // Set track (should be the same for both activities)
    modalTrack.textContent = activity1.track;

    // Add track-specific class to the track badge
    modalTrack.className = 'track-badge'; // Reset classes
    if (activity1.track === '🧠 Geek Zone') {
        modalTrack.classList.add('geek-track');
    } else if (activity1.track === '🏃‍♂️ Active Arena') {
        modalTrack.classList.add('active-track');
    } else if (activity1.track === '💬 Soft Skills Hub') {
        modalTrack.classList.add('soft-skills');
    } else if (activity1.track === '🌿 Hobby Grove') {
        modalTrack.classList.add('hobby-track');
    }

    // Create favorite button for first activity
    const createFavoriteButton = (activity, number) => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        if (favorites.includes(getActivityId(activity))) {
            favoriteBtn.classList.add('active');
        }

        const starIcon = document.createElement('span');
        starIcon.className = 'star-icon';
        starIcon.textContent = '★';

        const favoriteText = document.createElement('span');
        favoriteText.className = 'favorite-text';
        favoriteText.textContent = favorites.includes(getActivityId(activity)) ? 
            'Удалить из избранного' : 'Добавить в избранное';

        favoriteBtn.appendChild(starIcon);
        favoriteBtn.appendChild(document.createTextNode(` ${number} `));
        favoriteBtn.appendChild(favoriteText);

        favoriteBtn.dataset.activityId = getActivityId(activity);
        favoriteBtn.addEventListener('click', () => {
            toggleSingleFavorite(getActivityId(activity));
            localStorage.setItem('favorites', JSON.stringify(favorites));

            // Update button state
            favoriteBtn.classList.toggle('active');
            favoriteText.textContent = favorites.includes(getActivityId(activity)) ? 
                'Удалить из избранного' : 'Добавить в избранное';
        });

        return favoriteBtn;
    };

    // Set descriptions for both activities
    let combinedDescription = '';

    if (activity1.description) {
        combinedDescription += `<div class="merged-activity-description">
            <h4>1️⃣ ${activity1.title}</h4>
            <p>${activity1.description}</p>
            <div class="activity-favorite-container"></div>
        </div>`;
    }

    if (activity2.description) {
        if (combinedDescription) {
            combinedDescription += '<hr class="merged-description-separator">';
        }

        combinedDescription += `<div class="merged-activity-description">
            <h4>2️⃣ ${activity2.title}</h4>
            <p>${activity2.description}</p>
            <div class="activity-favorite-container"></div>
        </div>`;
    }

    modalDescription.innerHTML = combinedDescription || 'Нет описания';

    // Now insert the favorite buttons into their containers
    if (activity1.description) {
        const favoriteBtn1 = createFavoriteButton(activity1, '1️⃣');
        const container1 = modalDescription.querySelector('.merged-activity-description:first-child .activity-favorite-container');
        if (container1) container1.appendChild(favoriteBtn1);
    }

    if (activity2.description) {
        const favoriteBtn2 = createFavoriteButton(activity2, '2️⃣');
        const container2 = modalDescription.querySelector('.merged-activity-description:last-child .activity-favorite-container');
        if (container2) container2.appendChild(favoriteBtn2);
    }

    // Clear existing footer content - we don't need buttons here anymore
    modalFooter.innerHTML = '';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('activityModal').style.display = 'none';
    document.body.style.overflow = '';

    // Restore the modal footer to its original state
    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter.innerHTML === '') {
        modalFooter.innerHTML = `
            <button id="toggleFavorite" class="favorite-btn">
                <span class="star-icon">★</span>
                <span class="favorite-text">Добавить в избранное</span>
            </button>
        `;

        // Re-attach event listener to the toggle favorite button
        document.getElementById('toggleFavorite').addEventListener('click', () => {
            const activityId = document.getElementById('toggleFavorite').dataset.activityId;
            if (activityId) toggleFavorite(activityId);
        });
    }
}

// Convert time string (HH:MM) to minutes
function timeToMinutes(timeString) {
    // Remove any non-time characters (like meal indicators)
    const cleanTimeString = timeString.replace(/[^0-9:]/g, '');
    const [hours, minutes] = cleanTimeString.split(':').map(Number);

    // If the time is 00:00 or 01:00, treat it as after midnight
    // This assumes activities don't span more than 24 hours
    // But only if it's an end time for an activity that starts late
    // For start times or activities that start early, use regular hours
    if (hours < 2) {
        // Check if this is likely an end time after midnight
        // We'll assume it's after midnight if we're processing an end time
        // This is a heuristic and might need adjustment based on actual data patterns
        return (hours + 24) * 60 + minutes;
    }

    return hours * 60 + minutes;
}

// Get time range for a set of activities
function getTimeRange(activities) {
    // Fixed time range from 7:00 to 01:00 (1 AM)
    const start = 7 * 60; // 7:00 in minutes
    const end = 25 * 60; // 01:00 (1 AM) in minutes

    return { start, end };
}

// Generate unique ID for activity
function getActivityId(activity) {
    return `${activity.date}_${activity.timeStart}_${activity.title}`;
}

// Toggle favorite status for an activity
function toggleFavorite(activityId) {
    // Check if this is a merged activity
    if (activityId.startsWith('merged_')) {
        // Extract individual activity IDs
        const [_, id1, id2] = activityId.split('_');

        // Toggle both activities
        toggleSingleFavorite(id1);
        toggleSingleFavorite(id2);
    } else {
        // Regular single activity
        toggleSingleFavorite(activityId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    displaySchedule();
}

// Helper function to toggle a single activity's favorite status
function toggleSingleFavorite(activityId) {
    const index = favorites.indexOf(activityId);

    if (index === -1) {
        favorites.push(activityId);
    } else {
        favorites.splice(index, 1);
    }
}

// Load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}
