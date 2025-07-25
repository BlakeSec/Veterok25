// Localization system
let currentLanguage = 'ru'; // Default language

const translations = {
    ru: {
        // Page title and header
        pageTitle: 'Расписание движух Ветерок / Tramontana\'25',
        logoAlt: 'Кэмп 2025 Лого',
        
        // Navigation and controls
        whatNowBtn: 'Что сейчас?',
        favoritesOnly: 'Только избранное',
        camps: 'Кэмпы',
        
        // Days of the week (short)
        weekdays: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        
        // Months
        months: [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ],
        
        // Meals
        breakfast: 'Завтрак',
        lunch: 'Обед', 
        dinner: 'Ужин',
        
        // General
        allTracks: 'Все треки',
        leads: 'Лиды: ',
        author: 'Автор: ',
        noDescription: 'Нет описания',
        currentTime: 'Текущее время',
        currentEvent: 'Текущее событие',
        noCurrentEvent: 'Сейчас нет активных событий',
        
        // Camps section
        festivalCamps: 'Кэмпы фестиваля',
        allCamps: 'Все кэмпы',
        selectedCampEvents: 'События выбранного кэмпа',
        eventsCount: 'событий',
        moreEvents: 'событий ещё',
        
        // Favorites
        addToFavorites: 'Добавить в избранное',
        removeFromFavorites: 'Удалить из избранного',
        
        // Event editing
        addEvent: 'Добавить событие',
        editEvent: 'Редактировать событие',
        newEvent: 'Добавить новое событие',
        saveEvent: 'Сохранить',
        deleteEvent: 'Удалить',
        cancel: 'Отмена',
        eventTitle: 'Название',
        eventAuthor: 'Автор',
        eventDate: 'Дата',
        eventTimeStart: 'Время начала',
        eventTimeEnd: 'Время окончания',
        eventTrack: 'Кэмп/Трек',
        eventType: 'Тип события',
        eventDescription: 'Описание',
        selectDate: 'Выберите дату',
        selectTime: 'Выберите время',
        selectCamp: 'Выберите кэмп',
        selectType: 'Выберите тип',
        fillRequiredFields: 'Пожалуйста, заполните все обязательные поля',
        confirmDelete: 'Вы уверены, что хотите удалить это событие?',
        eventSaved: 'Событие сохранено успешно!',
        eventDeleted: 'Событие удалено успешно!',
        
        // Error messages and alerts
        loadingError: 'Ошибка загрузки расписания. Пожалуйста, попробуйте позже.',
        whatNowOnlyForDays: 'Функция "Что сейчас?" работает только для расписания по дням',
        todayNotFound: 'Сегодняшняя дата не найдена в расписании',
        scheduleNotLoaded: 'Расписание еще не загружено',
        timeNotFound: 'Не удалось найти подходящее время в расписании',
        
        // Footer
        allRightsReserved: 'Все права защищены',
        
        // Language switcher
        language: 'Язык'
    },
    en: {
        // Page title and header
        pageTitle: 'Veterok / Tramontana\'25 Activities Schedule',
        logoAlt: 'Camp 2025 Logo',
        
        // Navigation and controls
        whatNowBtn: 'What\'s Now?',
        favoritesOnly: 'Favorites Only',
        camps: 'Camps',
        
        // Days of the week (short)
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        
        // Months
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        
        // Meals
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        
        // General
        allTracks: 'All Tracks',
        leads: 'Leads: ',
        author: 'Author: ',
        noDescription: 'No description',
        currentTime: 'Current Time',
        currentEvent: 'Current Event',
        noCurrentEvent: 'No active events right now',
        
        // Camps section
        festivalCamps: 'Festival Camps',
        allCamps: 'All Camps',
        selectedCampEvents: 'Selected Camp Events',
        eventsCount: 'events',
        moreEvents: 'more events',
        
        // Favorites
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        
        // Event editing
        addEvent: 'Add Event',
        editEvent: 'Edit Event',
        newEvent: 'Add New Event',
        saveEvent: 'Save',
        deleteEvent: 'Delete',
        cancel: 'Cancel',
        eventTitle: 'Title',
        eventAuthor: 'Author',
        eventDate: 'Date',
        eventTimeStart: 'Start Time',
        eventTimeEnd: 'End Time',
        eventTrack: 'Camp/Track',
        eventType: 'Event Type',
        eventDescription: 'Description',
        selectDate: 'Select date',
        selectTime: 'Select time',
        selectCamp: 'Select camp',
        selectType: 'Select type',
        fillRequiredFields: 'Please fill in all required fields',
        confirmDelete: 'Are you sure you want to delete this event?',
        eventSaved: 'Event saved successfully!',
        eventDeleted: 'Event deleted successfully!',
        
        // Error messages and alerts
        loadingError: 'Schedule loading error. Please try again later.',
        whatNowOnlyForDays: 'The "What\'s Now?" function only works for daily schedule',
        todayNotFound: 'Today\'s date not found in schedule',
        scheduleNotLoaded: 'Schedule not loaded yet',
        timeNotFound: 'Could not find suitable time in schedule',
        
        // Footer
        allRightsReserved: 'All Rights Reserved',
        
        // Language switcher
        language: 'Language'
    }
};

// Helper function to get localized text
function t(key) {
    return translations[currentLanguage][key] || translations['ru'][key] || key;
}

// Helper function to get localized content from activity/place
function getLocalizedContent(item, field) {
    const localizedField = field + (currentLanguage === 'en' ? 'En' : '');
    return item[localizedField] || item[field] || '';
}

// Initialize language from localStorage or default
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('scheduleLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    updatePageLanguage();
}

// Switch language
function switchLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('scheduleLanguage', lang);
        updatePageLanguage();
        updateEditModalLanguage(); // Update edit modal language
        displaySchedule(); // Refresh the schedule display
    }
}

// Update page language
function updatePageLanguage() {
    // Update document language
    document.documentElement.lang = currentLanguage;
    
    // Update page title
    document.title = t('pageTitle');
    
    // Update header elements
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) siteTitle.textContent = t('pageTitle');
    
    const logoAlt = document.querySelector('.header-logo');
    if (logoAlt) logoAlt.alt = t('logoAlt');
    
    // Update control buttons
    const whatNowBtn = document.querySelector('#scrollToNowBtn .btn-text');
    if (whatNowBtn) whatNowBtn.textContent = t('whatNowBtn');
    
    const favoritesToggle = document.querySelector('.toggle-label');
    if (favoritesToggle) favoritesToggle.textContent = t('favoritesOnly');
    
    const favoriteText = document.querySelector('.favorite-text');
    if (favoriteText) favoriteText.textContent = t('addToFavorites');
    
    // Update footer
    const footer = document.querySelector('footer p');
    if (footer) footer.innerHTML = `&copy; 2025 Veterok / Tramontana'25. ${t('allRightsReserved')}.`;
    
    // Update language selector
    updateLanguageSelector();
}

// Update language selector
function updateLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
    }
}

// Function to convert URLs in text to clickable links and handle newlines
function linkifyText(text) {
    if (!text) return '';

    // Regular expression to match URLs
    // Matches http://, https://, www., and common domains without protocol like t.me
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(t\.me\/[^\s]+)/gi;

    // First replace newlines with <br> tags
    let processedText = text.replace(/\n/g, '<br>');

    // Then process URLs
    return processedText.replace(urlRegex, function(url) {
        // Determine if we need to add https:// prefix
        let href = url;
        if (url.indexOf('http') !== 0) {
            href = 'https://' + url;
        }

        // Create the link with target="_blank" and rel="noopener noreferrer"
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

// Global variables
let scheduleData = [];
let mealsData = [];
let stationsData = [];
let questsData = [];
let placesData = []; // Added for location info
let currentDay = '';
let currentTab = 'days'; // 'days', 'stations', or 'quests'
let favorites = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage(); // Initialize language first
    loadSchedule();
    loadFavorites();
    loadCustomActivities(); // Load custom activities
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Favorites toggle
    document.getElementById('favoritesToggle').addEventListener('change', displaySchedule);

    // Scroll to now button
    document.getElementById('scrollToNowBtn').addEventListener('click', scrollToCurrentTime);

    // Close activity modal
    document.querySelector('#activityModal .close-modal').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });

    // Close location modal
    document.querySelector('#locationModal .close-modal').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeLocationModal();
    });

    // Toggle favorite
    document.getElementById('toggleFavorite').addEventListener('click', () => {
        const activityId = document.getElementById('toggleFavorite').dataset.activityId;
        if (activityId) toggleFavorite(activityId);
    });

    // Window click to close modals
    window.addEventListener('click', (e) => {
        const activityModal = document.getElementById('activityModal');
        const locationModal = document.getElementById('locationModal');

        // Close activity modal if clicking outside
        if (e.target === activityModal) {
            closeModal();
        }

        // Close location modal if clicking outside
        if (e.target === locationModal) {
            closeLocationModal();
        }
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activityModal = document.getElementById('activityModal');
            const locationModal = document.getElementById('locationModal');

            if (activityModal.style.display === 'block') {
                closeModal();
            }
            if (locationModal.style.display === 'block') {
                closeLocationModal();
            }
        }
    });

    // Resize handler with debounce
    window.addEventListener('resize', debounce(() => {
        displaySchedule();
    }, 250));

    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');

        if (tabParam === 'stations') {
            selectTab('stations');
        } else if (tabParam === 'quests') {
            selectTab('quests');
        } else {
            // Get days from schedule (including custom activities)
            const days = [...new Set(getAllActivities().map(activity => activity.date))].sort();
            setDefaultDay(days);
        }
    });

    // Event editing listeners
    document.getElementById('addEventBtn').addEventListener('click', () => {
        openEditEventModal();
    });

    // Close edit event modal
    document.querySelector('#editEventModal .close-modal').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeEditEventModal();
    });

    // Edit event modal buttons
    document.getElementById('saveEventBtn').addEventListener('click', saveEvent);
    document.getElementById('deleteEventBtn').addEventListener('click', deleteEvent);
    document.getElementById('cancelEventBtn').addEventListener('click', closeEditEventModal);

    // Close edit modal when clicking outside
    const editModal = document.getElementById('editEventModal');
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditEventModal();
        }
    });

    // ESC key to close edit modal (additional handler)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const editModal = document.getElementById('editEventModal');
            if (editModal && editModal.style.display === 'block') {
                closeEditEventModal();
            }
        }
    });
}

// Load schedule data from JSON file
async function loadSchedule() {
    try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`schedule.json?v=${timestamp}`);
        const data = await response.json();
        scheduleData = data.activities;
        mealsData = data.meals || [];
        stationsData = data.stations || [];
        questsData = data.quests || [];
        placesData = data.places || [];

        // Get unique days from schedule (including custom activities)
        const days = [...new Set(getAllActivities().map(activity => activity.date))].sort();

        // Create tabs (days, stations, quests)
        createTabs(days);

        // Check URL parameters for tab selection
        checkUrlParams(days);

    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('tracksContainer').innerHTML = `<p class="error-message">${t('loadingError')}</p>`;
    }
}

// Check URL parameters for tab selection
function checkUrlParams(days) {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam === 'stations') {
        selectTab('stations');
    } else {
        // Default to days tab
        setDefaultDay(days);
    }
}

// Create all tabs (days, stations, quests)
function createTabs(days) {
    const dayTabsContainer = document.getElementById('dayTabs');
    dayTabsContainer.innerHTML = '';

    // Create day tabs
    days.forEach(day => {
        const date = new Date(day);
        const weekdayName = getWeekdayName(date);

        const tab = document.createElement('div');
        tab.className = 'day-tab';
        tab.dataset.date = day;
        tab.dataset.tab = 'days';
        tab.textContent = `${formatDate(day)} (${weekdayName})`;

        tab.addEventListener('click', () => {
            selectDay(day);
        });

        dayTabsContainer.appendChild(tab);
    });

    // Create camps tab (formerly stations)
    const stationsTab = document.createElement('div');
    stationsTab.className = 'day-tab';
    stationsTab.dataset.tab = 'stations';
            stationsTab.textContent = t('camps');

    stationsTab.addEventListener('click', () => {
        selectTab('stations');
    });

    dayTabsContainer.appendChild(stationsTab);


}

// Get weekday name in Russian
function getWeekdayName(date) {
    return t('weekdays')[date.getDay()];
}

// Format date as "DD Month"
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = t('months')[date.getMonth()];
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
    currentTab = 'days';

    // Update URL with the selected day
    const url = new URL(window.location);
    url.searchParams.delete('tab');
    history.pushState({}, '', url);

    // Update active tab
    document.querySelectorAll('.day-tab').forEach(tab => {
        if (tab.dataset.tab === 'days') {
            tab.classList.toggle('active', tab.dataset.date === day);
        } else {
            tab.classList.remove('active');
        }
    });

    // Show favorites toggle and scroll to now button
    document.querySelector('.favorites-toggle').style.display = 'flex';
    document.getElementById('scrollToNowBtn').style.display = 'flex';

    // Display schedule for selected day
    displaySchedule();
}

// Select a tab (stations or quests) and display its content
function selectTab(tab) {
    currentTab = tab;

    // Update URL with the selected tab
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    history.pushState({}, '', url);

    // Update active tab
    document.querySelectorAll('.day-tab').forEach(dayTab => {
        if (dayTab.dataset.tab === tab) {
            dayTab.classList.add('active');
        } else {
            dayTab.classList.remove('active');
        }
    });

    // Hide favorites toggle and scroll to now button (not applicable for stations/quests)
    document.querySelector('.favorites-toggle').style.display = 'none';
    document.getElementById('scrollToNowBtn').style.display = 'none';

    // Display content for selected tab
    if (tab === 'stations') {
        displayStations();
    }
}

// Display content based on current tab
function displaySchedule() {
    if (currentTab === 'days') {
        displayDaySchedule();
    } else if (currentTab === 'stations') {
        displayStations();
    }
}

// Display schedule for current day
function displayDaySchedule() {
    // Get hidden activities
    const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '[]');
    
    // Filter activities for current day from both original and custom activities
    let activities = getAllActivities()
        .filter(activity => activity.date === currentDay)
        .filter(activity => {
            // Exclude hidden original activities
            if (!activity.id || !activity.id.startsWith('custom_')) {
                const activityId = getActivityId(activity);
                return !hiddenActivities.includes(activityId);
            }
            return true; // Include all custom activities
        });

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

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    // Only show time column on desktop
    timeColumn.style.display = isMobile ? 'none' : 'block';

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
            if (mealAtThisHour.title === t('breakfast')) {
                mealEmoji = '🍳 ';
            } else if (mealAtThisHour.title === t('lunch')) {
                mealEmoji = '🍲 ';
            } else if (mealAtThisHour.title === t('dinner')) {
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

    // We already checked if we're on mobile above
    if (isMobile) {
        displayMobileSchedule(activities, timeRange);
    } else {
        displayDesktopSchedule(activities, timeRange);
    }
}

// Global variable to track selected camp filter
let selectedCampFilter = null;

// Display camps list (formerly stations)
function displayStations() {
    // Clear previous content
    const tracksContainer = document.getElementById('tracksContainer');
    tracksContainer.innerHTML = '';

    // Hide time column
    const timeColumn = document.querySelector('.time-column');
    timeColumn.style.display = 'none';

    // Create header with controls
    const headerContainer = document.createElement('div');
    headerContainer.className = 'camps-header';
    headerContainer.innerHTML = `
        <h2>${t('festivalCamps')}</h2>
        <div class="camps-controls">
            <button id="showAllCamps" class="camps-filter-btn ${!selectedCampFilter ? 'active' : ''}">
                ${t('allCamps')} (${placesData.length})
            </button>
            <button id="showCampActivities" class="camps-filter-btn ${selectedCampFilter ? 'active' : ''}" style="display: ${selectedCampFilter ? 'inline-block' : 'none'}">
                ${t('selectedCampEvents')}
            </button>
        </div>
    `;

    // Create camps list container
    const campsContainer = document.createElement('div');
    campsContainer.className = 'list-container camps-list';

    if (!selectedCampFilter) {
        // Show all camps
        placesData.forEach(place => {
            const campItem = document.createElement('div');
            campItem.className = 'list-item camp-item';
            campItem.dataset.campId = place.id;

            // Add click handler to filter activities
            campItem.addEventListener('click', () => {
                selectedCampFilter = place.id;
                displayStations(); // Refresh display
            });

            const title = document.createElement('h3');
            title.className = 'list-item-title';
            title.textContent = getLocalizedContent(place, 'name');

            const description = document.createElement('p');
            description.className = 'list-item-description';
            description.innerHTML = linkifyText(getLocalizedContent(place, 'description'));

            // Show leads info if available
            if (place.leads && place.leads.length > 0) {
                const leadsContainer = document.createElement('div');
                leadsContainer.className = 'camp-leads';

                const leadsLabel = document.createElement('span');
                leadsLabel.className = 'leads-label';
                leadsLabel.textContent = t('leads');

                const leadsText = document.createElement('span');
                leadsText.className = 'leads-text';
                leadsText.textContent = place.leads.join(', ');

                leadsContainer.appendChild(leadsLabel);
                leadsContainer.appendChild(leadsText);

                campItem.appendChild(title);
                campItem.appendChild(description);
                campItem.appendChild(leadsContainer);
            } else {
                campItem.appendChild(title);
                campItem.appendChild(description);
            }

            // Add activity count
            const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '[]');
            const activityCount = getAllActivities()
                .filter(activity => activity.placeId === place.id)
                .filter(activity => {
                    // Exclude hidden original activities
                    if (!activity.id || !activity.id.startsWith('custom_')) {
                        const activityId = getActivityId(activity);
                        return !hiddenActivities.includes(activityId);
                    }
                    return true; // Include all custom activities
                }).length;
            if (activityCount > 0) {
                const countBadge = document.createElement('span');
                countBadge.className = 'activity-count-badge';
                countBadge.textContent = `${activityCount} ${t('eventsCount')}`;
                campItem.appendChild(countBadge);
            }

            campsContainer.appendChild(campItem);
        });
    } else {
        // Show activities for selected camp
        const selectedPlace = placesData.find(place => place.id === selectedCampFilter);
        const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '[]');
        const campActivities = getAllActivities()
            .filter(activity => activity.placeId === selectedCampFilter)
            .filter(activity => {
                // Exclude hidden original activities
                if (!activity.id || !activity.id.startsWith('custom_')) {
                    const activityId = getActivityId(activity);
                    return !hiddenActivities.includes(activityId);
                }
                return true; // Include all custom activities
            });

        if (selectedPlace && campActivities.length > 0) {
            // Sort activities by date and time
            campActivities.sort((a, b) => {
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart);
            });

            campActivities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'list-item activity-item';

                // Add click handler to open activity modal
                activityItem.addEventListener('click', () => {
                    openActivityModal(activity);
                });

                const title = document.createElement('h3');
                title.className = 'list-item-title';
                title.textContent = activity.title;

                const timeInfo = document.createElement('div');
                timeInfo.className = 'activity-time-info';
                timeInfo.innerHTML = `
                    <span class="activity-date">${formatDate(activity.date)}</span>
                    <span class="activity-time">${activity.timeStart} - ${activity.timeEnd}</span>
                `;

                const description = document.createElement('p');
                description.className = 'list-item-description';
                description.innerHTML = linkifyText(activity.description);

                // Add author info
                if (activity.author) {
                    const authorInfo = document.createElement('div');
                    authorInfo.className = 'activity-author';
                    authorInfo.textContent = `${t('author')}${activity.author}`;

                    activityItem.appendChild(title);
                    activityItem.appendChild(timeInfo);
                    activityItem.appendChild(description);
                    activityItem.appendChild(authorInfo);
                } else {
                    activityItem.appendChild(title);
                    activityItem.appendChild(timeInfo);
                    activityItem.appendChild(description);
                }

                campsContainer.appendChild(activityItem);
            });
        }
    }

    // Add event listeners for filter buttons
    tracksContainer.appendChild(headerContainer);
    tracksContainer.appendChild(campsContainer);

    // Setup button event listeners after adding to DOM
    const showAllBtn = document.getElementById('showAllCamps');
    const showActivitiesBtn = document.getElementById('showCampActivities');

    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            selectedCampFilter = null;
            displayStations();
        });
    }

    if (showActivitiesBtn) {
        showActivitiesBtn.addEventListener('click', () => {
            displayStations();
        });
    }
}



// Display schedule in desktop view (single column list without track headers)
function displayDesktopSchedule(activities, timeRange) {
    const tracksContainer = document.getElementById('tracksContainer');
    // Clear existing content
    tracksContainer.innerHTML = '';
    
    // Use mobile display for desktop as well to show single column without headers
    displayMobileSchedule(activities, timeRange);
}

// Create a favorite star button for activity cards
function createActivityFavoriteButton(activity) {
    const activityId = getActivityId(activity);
    const isFavorite = favorites.includes(activityId);

    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'activity-favorite-star';
    favoriteBtn.innerHTML = isFavorite ? '★' : '☆';
    favoriteBtn.title = isFavorite ? t('removeFromFavorites') : t('addToFavorites');
    favoriteBtn.dataset.activityId = activityId;

    // Add active class if favorited
    if (isFavorite) {
        favoriteBtn.classList.add('active');
    }

    // Add click handler
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click (opening modal)

        toggleSingleFavorite(activityId);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Update button appearance
        const nowFavorite = favorites.includes(activityId);
        favoriteBtn.innerHTML = nowFavorite ? '★' : '☆';
        favoriteBtn.title = nowFavorite ? t('removeFromFavorites') : t('addToFavorites');
        favoriteBtn.classList.toggle('active', nowFavorite);

        // Update the card appearance and title
        const card = favoriteBtn.closest('.activity-card, .mobile-activity');
        if (card) {
            card.classList.toggle('favorite', nowFavorite);

            // Update title star emoji
            const titleElement = card.querySelector('.activity-title');
            if (titleElement) {
                const baseTitle = activity.title;
                titleElement.textContent = baseTitle + (nowFavorite ? ' ⭐️' : '');
            }
        }

        // If favorites filter is active, refresh display
        if (document.getElementById('favoritesToggle').checked) {
            displaySchedule();
        }
    });

    return favoriteBtn;
}

// Create a location link element
function createLocationLink(placeId) {
    if (!placeId) return null;

    const place = getPlaceById(placeId);
    if (!place) return null;

    const locationContainer = document.createElement('span');
    locationContainer.className = 'location-container';

    // Create emoji element (not underlined)
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'location-emoji';
    emojiSpan.textContent = '📍';

    // Create the actual link (underlined)
    const locationLink = document.createElement('span');
    locationLink.className = 'location-link';
    locationLink.textContent = place.title;
    locationLink.style.color = place.color || '#000';

    // Add click event to the container
    locationContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent activity card click
        openLocationModal(placeId);
    });

    // Append both elements to the container
    locationContainer.appendChild(emojiSpan);
    locationContainer.appendChild(locationLink);

    return locationContainer;
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
    card.style.height = `${height}px`; // Set fixed height proportional to duration
    card.style.minHeight = `${height}px`;

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
    } else if (activity.track === t('allTracks') || activity.track === 'Все треки') {
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
    const localizedTitle = getLocalizedContent(activity, 'title');
    title.textContent = localizedTitle + (favorites.includes(getActivityId(activity)) ? ' ⭐️' : '');

    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = `${activity.timeStart} - ${activity.timeEnd}`;

    card.appendChild(title);

    // Create a container for time and track badge
    const metaContainer = document.createElement('div');
    metaContainer.className = 'activity-meta-container';

    // Hide meta info for activities less than an hour on desktop
    const isMobile = window.innerWidth <= 768;
    const isLessThanHour = duration < 60;
    const shouldHideMetaInfo = !isMobile && isLessThanHour; // Hide meta info for short activities on desktop

    if (!shouldHideMetaInfo) {
        // Add time to the container
        metaContainer.appendChild(time);

        // Add location link if placeId exists
        if (activity.placeId) {
            const locationLink = createLocationLink(activity.placeId);
            if (locationLink) {
                metaContainer.appendChild(locationLink);
            }
        }

        // Only add track badge for regular activities (not general events) on mobile
        if (isMobile && (!activity.type || activity.type !== 'general')) {
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
            } else if (activity.track === t('allTracks')) {
                trackBadge.classList.add('all-tracks');
            }
            trackBadge.textContent = activity.track;
            metaContainer.appendChild(trackBadge);
        }
    }

    // Add the container to the card
    card.appendChild(metaContainer);

    // Add favorite star button
    const favoriteButton = createActivityFavoriteButton(activity);
    card.appendChild(favoriteButton);

    // Add edit button
    const editButton = document.createElement('button');
    editButton.className = 'edit-event-icon';
    editButton.innerHTML = '✏️';
    editButton.title = t('editEvent');
    editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditEventModal(activity);
    });
    card.appendChild(editButton);

    // Add click event to open modal
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking on favorite or edit button
        if (e.target.classList.contains('activity-favorite-star') || 
            e.target.classList.contains('edit-event-icon')) {
            return;
        }
        openActivityModal(activity);
    });

    if (activity.type === 'general') {
        // For general events (spanning all tracks)
        tracksContainer.appendChild(card);
    } else if (activity.track === t('allTracks') || activity.track === 'Все треки') {
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
    card.style.height = `${height}px`; // Set fixed height proportional to duration
    card.style.minHeight = `${height}px`;

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
    title1.innerHTML = `1️⃣ ${activity1.title}${favorites.includes(getActivityId(activity1)) ? ' ⭐️' : ''}`;

    activity1Container.appendChild(title1);

    // Create container for second activity
    const activity2Container = document.createElement('div');
    activity2Container.className = 'merged-activity-item';

    const title2 = document.createElement('div');
    title2.className = 'activity-title';
    title2.innerHTML = `2️⃣ ${activity2.title}${favorites.includes(getActivityId(activity2)) ? ' ⭐️' : ''}`;

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

    // Hide meta info for activities less than an hour on desktop
    const isMobile = window.innerWidth <= 768;
    const isLessThanHour = duration < 60;
    const shouldHideMetaInfo = !isMobile && isLessThanHour; // Hide meta info for short activities on desktop

    // Create a wrapper for meta container to add horizontal padding
    const metaWrapper = document.createElement('div');
    metaWrapper.className = 'merged-activity-meta-wrapper';

    // Only add meta container if we shouldn't hide it
    if (!shouldHideMetaInfo) {
        metaWrapper.appendChild(metaContainer);
    }

    // Add all elements to the card
    card.appendChild(activity1Container);
    card.appendChild(separator);
    card.appendChild(activity2Container);
    card.appendChild(metaWrapper);

    // Add favorite buttons for both activities
    const favoriteButton1 = createActivityFavoriteButton(activity1);
    favoriteButton1.style.top = '6px';
    favoriteButton1.style.right = '40px'; // Position to the left of the second button
    card.appendChild(favoriteButton1);

    const favoriteButton2 = createActivityFavoriteButton(activity2);
    favoriteButton2.style.top = '6px';
    favoriteButton2.style.right = '6px';
    card.appendChild(favoriteButton2);

    // Add click event to open merged modal
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking on favorite buttons
        if (e.target.classList.contains('activity-favorite-star')) {
            return;
        }
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
                if (mealAtThisHour.title === t('breakfast')) {
                    mealEmoji = '🍳 ';
                } else if (mealAtThisHour.title === t('lunch')) {
                    mealEmoji = '🥗 ';
                } else if (mealAtThisHour.title === t('dinner')) {
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
                    } else if (activity.track === t('allTracks')) {
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
                    const localizedTitle = getLocalizedContent(activity, 'title');
                    title.textContent = localizedTitle + (favorites.includes(getActivityId(activity)) ? ' ⭐️' : '');

                    const time = document.createElement('div');
                    time.className = 'activity-time';
                    time.textContent = `${activity.timeStart} - ${activity.timeEnd}`;

                    mobileActivity.appendChild(title);

                    // Create a container for time and track badge
                    const metaContainer = document.createElement('div');
                    metaContainer.className = 'activity-meta-container';

                    // Add time to the container
                    metaContainer.appendChild(time);

                    // Add location link if placeId exists
                    if (activity.placeId) {
                        const locationLink = createLocationLink(activity.placeId);
                        if (locationLink) {
                            metaContainer.appendChild(locationLink);
                        }
                    }

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
                        } else if (activity.track === t('allTracks')) {
                            trackBadge.classList.add('all-tracks');
                        }
                        trackBadge.textContent = getLocalizedContent(activity, 'track');
                        metaContainer.appendChild(trackBadge);
                    }

                    // Add the container to the mobile activity
                    mobileActivity.appendChild(metaContainer);

                    // Add favorite star button
                    const favoriteButton = createActivityFavoriteButton(activity);
                    mobileActivity.appendChild(favoriteButton);

                    // Add edit button
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-event-icon';
                    editButton.innerHTML = '✏️';
                    editButton.title = t('editEvent');
                    editButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openEditEventModal(activity);
                    });
                    mobileActivity.appendChild(editButton);

                    // Add click event to open modal
                    mobileActivity.addEventListener('click', (e) => {
                        // Don't open modal if clicking on favorite or edit button
                        if (e.target.classList.contains('activity-favorite-star') || 
                            e.target.classList.contains('edit-event-icon')) {
                            return;
                        }
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

    const localizedTitle = getLocalizedContent(activity, 'title');
    modalTitle.textContent = localizedTitle + (favorites.includes(getActivityId(activity)) ? ' ⭐️' : '');
    modalTime.textContent = `${activity.timeStart} - ${activity.timeEnd}`;

    // Add author information if available
    if (activity.author) {
        // Create author element if it doesn't exist
        let modalAuthor = document.getElementById('modalAuthor');
        if (!modalAuthor) {
            modalAuthor = document.createElement('span');
            modalAuthor.id = 'modalAuthor';
            modalAuthor.className = 'activity-author';

            // Insert after modalTitle
            modalTitle.parentNode.insertBefore(modalAuthor, modalTitle.nextSibling);
        }

        // Set author content - as link if authorUrl exists, otherwise as text
        if (activity.authorUrl && activity.authorUrl !== "") {
            modalAuthor.innerHTML = `<a href="${activity.authorUrl}" target="_blank" rel="noopener noreferrer">${activity.author}</a>`;
        } else {
            modalAuthor.textContent = activity.author;
        }

        // Make sure it's visible
        modalAuthor.style.display = 'block';
    } else {
        // Hide author element if it exists
        const modalAuthor = document.getElementById('modalAuthor');
        if (modalAuthor) {
            modalAuthor.style.display = 'none';
        }
    }

    // Create a container for time and location
    const timeLocationContainer = document.createElement('div');
    timeLocationContainer.className = 'time-location-container';

    // Move modalTime into the container
    const modalMeta = document.querySelector('.modal-meta');
    modalMeta.innerHTML = ''; // Clear the modal-meta
    timeLocationContainer.appendChild(modalTime);

    // Add location information if available
    if (activity.placeId) {
        const locationLink = createLocationLink(activity.placeId);
        if (locationLink) {
            const modalLocation = document.createElement('div');
            modalLocation.id = 'modalLocation';
            modalLocation.className = 'modal-location';
            modalLocation.appendChild(locationLink);
            timeLocationContainer.appendChild(modalLocation);
        }
    }

    // Add the time-location container and track badge to the modal-meta
    modalMeta.appendChild(timeLocationContainer);
    modalMeta.appendChild(modalTrack);

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
    } else if (activity.track === t('allTracks') || activity.track === 'Все треки') {
        modalTrack.classList.add('all-tracks');
    }

    const localizedDescription = getLocalizedContent(activity, 'description');
    modalDescription.innerHTML = linkifyText(localizedDescription);

    const activityId = getActivityId(activity);
    const isFavorite = favorites.includes(activityId);

    toggleFavoriteBtn.classList.toggle('active', isFavorite);
    toggleFavoriteBtn.querySelector('.favorite-text').textContent =
        isFavorite ? t('removeFromFavorites') : t('addToFavorites');

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
    modalTitle.innerHTML = `1️⃣ ${activity1.title}${favorites.includes(getActivityId(activity1)) ? ' ⭐️' : ''}<br>2️⃣ ${activity2.title}${favorites.includes(getActivityId(activity2)) ? ' ⭐️' : ''}`;

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

    // Handle author information
    // Hide any existing author element first
    const existingModalAuthor = document.getElementById('modalAuthor');
    if (existingModalAuthor) {
        existingModalAuthor.style.display = 'none';
    }

    // Create a container for time and location
    const timeLocationContainer = document.createElement('div');
    timeLocationContainer.className = 'time-location-container';

    // Move modalTime into the container
    const modalMeta = document.querySelector('.modal-meta');
    modalMeta.innerHTML = ''; // Clear the modal-meta
    timeLocationContainer.appendChild(modalTime);

    // Add location information if either activity has a placeId
    if (activity1.placeId || activity2.placeId) {
        const modalLocation = document.createElement('div');
        modalLocation.id = 'modalLocation';
        modalLocation.className = 'modal-location';

        // Add location links for both activities if they have placeIds
        if (activity1.placeId) {
            const locationLink1 = createLocationLink(activity1.placeId);
            if (locationLink1) {
                // Add a label to indicate which activity this location belongs to
                const label = document.createElement('span');
                label.textContent = '1️⃣ ';
                label.style.marginRight = '4px';

                modalLocation.appendChild(label);
                modalLocation.appendChild(locationLink1);

                // Add a separator if both activities have placeIds
                if (activity2.placeId) {
                    const separator = document.createElement('span');
                    separator.textContent = ' | ';
                    separator.style.margin = '0 8px';
                    modalLocation.appendChild(separator);
                }
            }
        }

        if (activity2.placeId) {
            const locationLink2 = createLocationLink(activity2.placeId);
            if (locationLink2) {
                // Add a label to indicate which activity this location belongs to
                const label = document.createElement('span');
                label.textContent = '2️⃣ ';
                label.style.marginRight = '4px';

                modalLocation.appendChild(label);
                modalLocation.appendChild(locationLink2);
            }
        }

        timeLocationContainer.appendChild(modalLocation);
    }

    // Add the time-location container and track badge to the modal-meta
    modalMeta.appendChild(timeLocationContainer);
    modalMeta.appendChild(modalTrack);

    // We don't show author in the meta section for merged activities
    // Authors will be shown in each activity's description section

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
            t('removeFromFavorites') : t('addToFavorites');

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
                t('removeFromFavorites') : t('addToFavorites');

            // Update modal title with star emoji
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                // Update the merged activity modal title
                modalTitle.innerHTML = `1️⃣ ${activity1.title}${favorites.includes(getActivityId(activity1)) ? ' ⭐️' : ''}<br>2️⃣ ${activity2.title}${favorites.includes(getActivityId(activity2)) ? ' ⭐️' : ''}`;
            }

            // Update activity description headers with star emoji
            if (activity === activity1) {
                const header = modalDescription.querySelector('.merged-activity-description:first-child h4');
                if (header) {
                    header.innerHTML = `1️⃣ ${activity1.title}${favorites.includes(getActivityId(activity1)) ? ' ⭐️' : ''}`;
                }
            } else if (activity === activity2) {
                const header = modalDescription.querySelector('.merged-activity-description:last-child h4');
                if (header) {
                    header.innerHTML = `2️⃣ ${activity2.title}${favorites.includes(getActivityId(activity2)) ? ' ⭐️' : ''}`;
                }
            }
        });

        return favoriteBtn;
    };

    // Set descriptions for both activities
    let combinedDescription = '';

    if (activity1.description) {
        // Create author HTML for activity1 if available
        let authorHtml1 = '';
        if (activity1.author) {
            if (activity1.authorUrl && activity1.authorUrl !== "") {
                authorHtml1 = `<div class="activity-author"><a href="${activity1.authorUrl}" target="_blank" rel="noopener noreferrer">${activity1.author}</a></div>`;
            } else {
                authorHtml1 = `<div class="activity-author">${activity1.author}</div>`;
            }
        }

        // We no longer need location HTML here as it's now in the modal-meta section
        let locationHtml1 = '';

        combinedDescription += `<div class="merged-activity-description">
            <h4>1️⃣ ${activity1.title}${favorites.includes(getActivityId(activity1)) ? ' ⭐️' : ''}</h4>
            ${authorHtml1}
            ${locationHtml1}
            <p>${linkifyText(activity1.description)}</p>
            <div class="activity-favorite-container"></div>
        </div>`;
    }

    if (activity2.description) {
        if (combinedDescription) {
            combinedDescription += '<hr class="merged-description-separator">';
        }

        // Create author HTML for activity2 if available
        let authorHtml2 = '';
        if (activity2.author) {
            if (activity2.authorUrl && activity2.authorUrl !== "") {
                authorHtml2 = `<div class="activity-author"><a href="${activity2.authorUrl}" target="_blank" rel="noopener noreferrer">${activity2.author}</a></div>`;
            } else {
                authorHtml2 = `<div class="activity-author">${activity2.author}</div>`;
            }
        }

        // We no longer need location HTML here as it's now in the modal-meta section
        let locationHtml2 = '';

        combinedDescription += `<div class="merged-activity-description">
            <h4>2️⃣ ${activity2.title}${favorites.includes(getActivityId(activity2)) ? ' ⭐️' : ''}</h4>
            ${authorHtml2}
            ${locationHtml2}
            <p>${linkifyText(activity2.description)}</p>
            <div class="activity-favorite-container"></div>
        </div>`;
    }

    modalDescription.innerHTML = combinedDescription || t('noDescription');

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

// Close activity modal
function closeModal() {
    document.getElementById('activityModal').style.display = 'none';
    document.body.style.overflow = '';

    // Restore the modal footer to its original state
    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter.innerHTML === '') {
        modalFooter.innerHTML = `
            <button id="toggleFavorite" class="favorite-btn">
                <span class="star-icon">★</span>
                <span class="favorite-text">${t('addToFavorites')}</span>
            </button>
        `;

        // Re-attach event listener to the toggle favorite button
        document.getElementById('toggleFavorite').addEventListener('click', () => {
            const activityId = document.getElementById('toggleFavorite').dataset.activityId;
            if (activityId) toggleFavorite(activityId);
        });
    }
}

// Close location modal
function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Get place by ID
function getPlaceById(placeId) {
    return placesData.find(place => place.id === placeId);
}

// Open location modal
function openLocationModal(placeId) {
    const place = getPlaceById(placeId);
    if (!place) return;

    const modal = document.getElementById('locationModal');
    const modalTitle = document.getElementById('locationModalTitle');
    const modalDescription = document.getElementById('locationModalDescription');
    const modalPhoto = document.getElementById('locationModalPhoto');

    modalTitle.textContent = "📍 " + place.title;
    const localizedDescription = getLocalizedContent(place, 'description');
    modalDescription.textContent = localizedDescription || t('noDescription');

    // Set photo source
    modalPhoto.src = `photos/${placeId}.jpg`;

    // Handle image loading error
    modalPhoto.onerror = function() {
        this.style.display = 'none';
    };

    // Reset image display if it was previously hidden
    modalPhoto.style.display = 'block';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Convert time string (HH:MM) to minutes
function timeToMinutes(timeString) {
    // Remove any non-time characters (like meal indicators)
    const cleanTimeString = timeString.replace(/[^0-9:]/g, '');
    const [hours, minutes] = cleanTimeString.split(':').map(Number);

    // If the time is 00:00 to 03:00, treat it as after midnight
    // This assumes activities don't span more than 24 hours
    // But only if it's an end time for an activity that starts late
    // For start times or activities that start early, use regular hours
    if (hours < 4) {
        // Check if this is likely an end time after midnight
        // We'll assume it's after midnight if we're processing an end time
        // This is a heuristic and might need adjustment based on actual data patterns
        return (hours + 24) * 60 + minutes;
    }

    return hours * 60 + minutes;
}

// Get time range for a set of activities
function getTimeRange(activities) {
    // Fixed time range from 7:00 to 03:00 (3 AM)
    const start = 7 * 60; // 7:00 in minutes
    const end = 27 * 60; // 03:00 (3 AM) in minutes

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

        // Update the modal title for regular activity
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            // Find the activity object from the activityId
            const activityParts = activityId.split('_');
            const date = activityParts[0];
            const timeStart = activityParts[1];
            const title = activityParts.slice(2).join('_'); // In case title contains underscores

            const activity = scheduleData.find(a =>
                a.date === date &&
                a.timeStart === timeStart &&
                a.title === title
            );

            if (activity) {
                modalTitle.textContent = activity.title + (favorites.includes(activityId) ? ' ⭐️' : '');
            }
        }
    }

    // Update the button text after toggling
    const toggleFavoriteBtn = document.getElementById('toggleFavorite');
    const isFavorite = favorites.includes(activityId);
    toggleFavoriteBtn.classList.toggle('active', isFavorite);
    toggleFavoriteBtn.querySelector('.favorite-text').textContent =
        isFavorite ? t('removeFromFavorites') : t('addToFavorites');

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

// Scroll to current time in the schedule
function scrollToCurrentTime() {
    // Only works for the days tab
    if (currentTab !== 'days') {
        alert(t('whatNowOnlyForDays'));
        return;
    }

    // Check if current day is today
    const today = new Date().toISOString().split('T')[0];
    if (currentDay !== today) {
        // Switch to today if it exists in the schedule (including custom activities)
        const days = [...new Set(getAllActivities().map(activity => activity.date))].sort();
        if (days.includes(today)) {
            selectDay(today);
            // Wait for the schedule to render, then scroll
            setTimeout(() => scrollToCurrentTimeActual(), 100);
        } else {
            alert(t('todayNotFound'));
        }
        return;
    }

    scrollToCurrentTimeActual();
}

// Actually perform the scroll to current time
function scrollToCurrentTimeActual() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find all time markers
    const timeMarkers = document.querySelectorAll('.time-marker');

    if (timeMarkers.length === 0) {
        alert(t('scheduleNotLoaded'));
        return;
    }

    // Find the closest time marker to current time
    let closestMarker = null;
    let closestDifference = Infinity;

    timeMarkers.forEach(marker => {
        const markerTimeMinutes = parseInt(marker.dataset.timeMinutes);
        const difference = Math.abs(markerTimeMinutes - currentTimeInMinutes);

        if (difference < closestDifference) {
            closestDifference = difference;
            closestMarker = marker;
        }
    });

    if (closestMarker) {
        // Find current events
        // const currentEvents = findCurrentEvents(currentTimeInMinutes); // Commented out as not needed anymore
        
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // For mobile, scroll to the time block in the mobile timeline
            const mobileTimeBlocks = document.querySelectorAll('.time-block');
            const targetTimeMinutes = parseInt(closestMarker.dataset.timeMinutes);

            // Find corresponding mobile time block
            let targetMobileBlock = null;
            mobileTimeBlocks.forEach(block => {
                const timeLabel = block.querySelector('.time-label');
                if (timeLabel) {
                    const blockTimeText = timeLabel.textContent;
                    const blockTimeMinutes = timeToMinutes(blockTimeText);
                    if (Math.abs(blockTimeMinutes - targetTimeMinutes) < 30) { // Within 30 minutes
                        targetMobileBlock = block;
                    }
                }
            });

            if (targetMobileBlock) {
                targetMobileBlock.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            // For desktop, scroll to the time marker
            closestMarker.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Show a brief visual indicator with current event description
        // showTimeIndicator(currentEvents); // Disabled per user request - just scroll without popup
    } else {
        alert(t('timeNotFound'));
    }
}

// Find current events happening now
function findCurrentEvents(currentTimeInMinutes) {
    if (!scheduleData) return [];
    
    const today = new Date().toISOString().split('T')[0];
    const currentEvents = [];
    const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '[]');
    
    getAllActivities().forEach(activity => {
        // Exclude hidden original activities
        if (!activity.id || !activity.id.startsWith('custom_')) {
            const activityId = getActivityId(activity);
            if (hiddenActivities.includes(activityId)) return;
        }
        if (activity.date !== today) return;
        
        const startMinutes = timeToMinutes(activity.timeStart);
        const endMinutes = timeToMinutes(activity.timeEnd);
        
        // Handle events that cross midnight
        const actualEndMinutes = endMinutes < startMinutes ? endMinutes + 24 * 60 : endMinutes;
        const actualCurrentMinutes = currentTimeInMinutes < startMinutes && endMinutes < startMinutes 
            ? currentTimeInMinutes + 24 * 60 
            : currentTimeInMinutes;
        
        if (actualCurrentMinutes >= startMinutes && actualCurrentMinutes <= actualEndMinutes) {
            currentEvents.push(activity);
        }
    });
    
    return currentEvents;
}

// Show a brief visual indicator that we've scrolled to current time
function showTimeIndicator(currentEvents = []) {
    // Create a temporary indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-accent-blue);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        max-width: 90vw;
        text-align: center;
        line-height: 1.4;
    `;
    
    let content = `<div style="margin-bottom: 8px; font-size: 14px; opacity: 0.9;">${t('currentTime')}</div>`;
    
    if (currentEvents.length > 0) {
        content += `<div style="margin-bottom: 12px; font-size: 18px; font-weight: 700;">${t('currentEvent')}</div>`;
        
        currentEvents.slice(0, 3).forEach((event, index) => {
            const title = getLocalizedContent(event, 'title');
            const track = getLocalizedContent(event, 'track');
            const description = getLocalizedContent(event, 'description');
            
            content += `
                <div style="margin-bottom: ${index < currentEvents.length - 1 ? '12px' : '0'}; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">${track}</div>
                    ${description ? `<div style="font-size: 13px; opacity: 0.9; line-height: 1.3;">${description}</div>` : ''}
                </div>
            `;
        });
        
        if (currentEvents.length > 3) {
            content += `<div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">+${currentEvents.length - 3} ${t('moreEvents')}</div>`;
        }
    } else {
        content += `<div style="font-size: 16px; opacity: 0.9;">${t('noCurrentEvent')}</div>`;
    }
    
    indicator.innerHTML = content;
    document.body.appendChild(indicator);

    // Remove after 4 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }, 4000);
}

// Load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}

// Event editing functionality
let editingActivity = null;
let customActivities = [];

// Load custom activities from localStorage
function loadCustomActivities() {
    const stored = localStorage.getItem('customActivities');
    if (stored) {
        customActivities = JSON.parse(stored);
    }
}

// Save custom activities to localStorage
function saveCustomActivities() {
    localStorage.setItem('customActivities', JSON.stringify(customActivities));
}

// Get all activities (original + custom)
function getAllActivities() {
    return [...scheduleData, ...customActivities];
}

// Generate unique ID for new activities
function generateActivityId() {
    return 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get unique tracks from schedule data
function getUniqueTracksAndCamps() {
    const tracks = new Set();
    scheduleData.forEach(activity => {
        if (activity.track) {
            tracks.add(activity.track);
        }
    });
    return Array.from(tracks).sort();
}

// Get unique dates from schedule data
function getUniqueDates() {
    const dates = new Set();
    scheduleData.forEach(activity => {
        if (activity.date) {
            dates.add(activity.date);
        }
    });
    return Array.from(dates).sort();
}

// Generate time options for dropdowns
function generateTimeOptions() {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push(timeStr);
        }
    }
    return times;
}

// Open edit event modal
function openEditEventModal(activity = null) {
    editingActivity = activity;
    const modal = document.getElementById('editEventModal');
    const title = document.getElementById('editEventModalTitle');
    const deleteBtn = document.getElementById('deleteEventBtn');
    
    // Set modal title and delete button visibility
    if (activity) {
        title.textContent = t('editEvent');
        deleteBtn.style.display = 'inline-block';
    } else {
        title.textContent = t('newEvent');
        deleteBtn.style.display = 'none';
    }
    
    // Populate form dropdowns
    populateFormDropdowns();
    
    // Fill form with activity data if editing
    if (activity) {
        fillFormWithActivity(activity);
    } else {
        clearForm();
    }
    
    modal.style.display = 'block';
}

// Close edit event modal
function closeEditEventModal() {
    const modal = document.getElementById('editEventModal');
    modal.style.display = 'none';
    editingActivity = null;
    clearForm();
}

// Populate form dropdowns
function populateFormDropdowns() {
    // Populate dates
    const dateSelect = document.getElementById('eventDate');
    dateSelect.innerHTML = '<option value="">' + t('selectDate') + '</option>';
    getUniqueDates().forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDate(date);
        dateSelect.appendChild(option);
    });
    
    // Populate tracks/camps
    const trackSelect = document.getElementById('eventTrack');
    trackSelect.innerHTML = '<option value="">' + t('selectCamp') + '</option>';
    getUniqueTracksAndCamps().forEach(track => {
        const option = document.createElement('option');
        option.value = track;
        option.textContent = track;
        trackSelect.appendChild(option);
    });
    
    // Populate time options
    const timeOptions = generateTimeOptions();
    const startTimeSelect = document.getElementById('eventTimeStart');
    const endTimeSelect = document.getElementById('eventTimeEnd');
    
    startTimeSelect.innerHTML = '<option value="">' + t('selectTime') + '</option>';
    endTimeSelect.innerHTML = '<option value="">' + t('selectTime') + '</option>';
    
    timeOptions.forEach(time => {
        const startOption = document.createElement('option');
        startOption.value = time;
        startOption.textContent = time;
        startTimeSelect.appendChild(startOption);
        
        const endOption = document.createElement('option');
        endOption.value = time;
        endOption.textContent = time;
        endTimeSelect.appendChild(endOption);
    });
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', options);
}

// Fill form with activity data
function fillFormWithActivity(activity) {
    document.getElementById('eventTitle').value = activity.title || '';
    document.getElementById('eventTitleEn').value = activity.titleEn || '';
    document.getElementById('eventAuthor').value = activity.author || '';
    document.getElementById('eventDate').value = activity.date || '';
    document.getElementById('eventTimeStart').value = activity.timeStart || '';
    document.getElementById('eventTimeEnd').value = activity.timeEnd || '';
    document.getElementById('eventTrack').value = activity.track || '';
    document.getElementById('eventType').value = activity.type || '';
    document.getElementById('eventDescription').value = activity.description || '';
    document.getElementById('eventDescriptionEn').value = activity.descriptionEn || '';
}

// Clear form
function clearForm() {
    document.getElementById('eventForm').reset();
}

// Save event (create or update)
function saveEvent() {
    const form = document.getElementById('eventForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'timeStart', 'timeEnd', 'track', 'type'];
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            alert(t('fillRequiredFields'));
            return;
        }
    }
    
    // Create activity object
    const activityData = {
        title: formData.get('title'),
        titleEn: formData.get('titleEn') || formData.get('title'),
        author: formData.get('author') || '',
        date: formData.get('date'),
        timeStart: formData.get('timeStart'),
        timeEnd: formData.get('timeEnd'),
        track: formData.get('track'),
        trackEn: formData.get('track'),
        type: formData.get('type'),
        description: formData.get('description') || '',
        descriptionEn: formData.get('descriptionEn') || formData.get('description'),
        dayName: getDayName(formData.get('date'), 'ru'),
        dayNameEn: getDayName(formData.get('date'), 'en')
    };
    
    if (editingActivity) {
        // Update existing activity
        if (editingActivity.id && editingActivity.id.startsWith('custom_')) {
            // Update custom activity
            const index = customActivities.findIndex(a => a.id === editingActivity.id);
            if (index !== -1) {
                customActivities[index] = { ...activityData, id: editingActivity.id };
            }
        } else {
            // Convert original activity to custom and update
            activityData.id = generateActivityId();
            activityData.originalId = getActivityId(editingActivity);
            customActivities.push(activityData);
        }
    } else {
        // Create new custom activity
        activityData.id = generateActivityId();
        customActivities.push(activityData);
    }
    
    saveCustomActivities();
    closeEditEventModal();
    
    // Refresh the display
    if (currentView === 'stations') {
        renderStationsView();
    } else {
        renderDayView();
    }
    
    showSuccessMessage(t('eventSaved'));
}

// Delete event
function deleteEvent() {
    if (!editingActivity) return;
    
    if (!confirm(t('confirmDelete'))) return;
    
    if (editingActivity.id && editingActivity.id.startsWith('custom_')) {
        // Delete custom activity
        customActivities = customActivities.filter(a => a.id !== editingActivity.id);
        saveCustomActivities();
    } else {
        // Mark original activity as hidden
        const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '[]');
        const activityId = getActivityId(editingActivity);
        if (!hiddenActivities.includes(activityId)) {
            hiddenActivities.push(activityId);
            localStorage.setItem('hiddenActivities', JSON.stringify(hiddenActivities));
        }
    }
    
    closeEditEventModal();
    
    // Refresh the display
    if (currentView === 'stations') {
        renderStationsView();
    } else {
        renderDayView();
    }
    
    showSuccessMessage(t('eventDeleted'));
}

// Update edit modal language
function updateEditModalLanguage() {
    // Update add event button
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        const btnText = addEventBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = t('addEvent');
        }
    }

    // Update modal form labels and buttons if modal is open
    const editModal = document.getElementById('editEventModal');
    if (editModal && editModal.style.display === 'block') {
        // Update save and cancel button text
        const saveBtn = document.getElementById('saveEventBtn');
        const deleteBtn = document.getElementById('deleteEventBtn');
        const cancelBtn = document.getElementById('cancelEventBtn');
        
        if (saveBtn) saveBtn.textContent = t('saveEvent');
        if (deleteBtn) deleteBtn.textContent = t('deleteEvent');
        if (cancelBtn) cancelBtn.textContent = t('cancel');
        
        // Re-populate dropdowns to update placeholders
        populateFormDropdowns();
    }
}

// Get day name for date
function getDayName(dateStr, language) {
    const date = new Date(dateStr);
    const days = {
        ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    return days[language][date.getDay()];
}

// Show success message
function showSuccessMessage(message) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    `;
    
    indicator.textContent = message;
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }, 3000);
}
