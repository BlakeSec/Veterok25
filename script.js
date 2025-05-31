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
        'воскресенье', 'понедельник', 'вторник', 'среда', 
        'четверг', 'пятница', 'суббота'
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
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        const timeMarker = document.createElement('div');
        timeMarker.className = 'time-marker';

        // Check if this hour falls within any meal's time range
        const currentTimeMinutes = timeToMinutes(timeString);
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

    // Add activities to track columns
    activities.forEach(activity => {
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
        card.appendChild(time);

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
            card.appendChild(trackBadge);
        }


        // Add click event to open modal
        card.addEventListener('click', () => {
            openActivityModal(activity);
        });

        if (activity.type === 'general') {
            // For general events (spanning all tracks)
            card.classList.add('general-event');
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
    });
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

    // Group activities by time blocks
    const timeBlocks = {};

    activities.forEach(activity => {
        const startTime = activity.timeStart;
        if (!timeBlocks[startTime]) {
            timeBlocks[startTime] = [];
        }
        timeBlocks[startTime].push(activity);
    });

    // Create time blocks for every hour in the time range
    for (let time = timeRange.start; time <= timeRange.end; time += 60) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Get activities for this hour
        const timeActivities = timeBlocks[timeString] || [];

        // Check if this hour falls within any meal's time range
        const currentTimeMinutes = time;
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
                    mobileActivity.appendChild(time);

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
                        mobileActivity.appendChild(trackBadge);
                    }

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

// Close modal
function closeModal() {
    document.getElementById('activityModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Convert time string (HH:MM) to minutes
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Get time range for a set of activities
function getTimeRange(activities) {
    // Fixed time range from 7:00 to 00:00 (midnight)
    const start = 7 * 60; // 7:00 in minutes
    const end = 24 * 60; // 00:00 (midnight) in minutes

    return { start, end };
}

// Generate unique ID for activity
function getActivityId(activity) {
    return `${activity.date}_${activity.timeStart}_${activity.title}`;
}

// Toggle favorite status for an activity
function toggleFavorite(activityId) {
    const index = favorites.indexOf(activityId);

    if (index === -1) {
        favorites.push(activityId);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    displaySchedule();
}

// Load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}
