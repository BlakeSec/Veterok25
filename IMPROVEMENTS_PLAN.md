# План улучшений сайта Veterok Schedule

## Приоритет 1: Критически важные улучшения

### 1.1 Мобильная адаптивность
**Проблема**: Сайт не полностью адаптирован для мобильных устройств

**Решение**:
- Улучшить responsive дизайн для экранов < 768px
- Добавить touch-friendly элементы (кнопки min 44px)
- Оптимизировать шрифты для мобильных устройств
- Добавить viewport meta tag
- Улучшить прокрутку расписания на мобильных

**Код для styles.css**:
```css
/* Мобильная адаптивность */
@media screen and (max-width: 768px) {
  .schedule-container {
    padding: 10px;
  }
  
  .activity-item {
    padding: 15px;
    margin: 5px 0;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .filter-btn {
    min-height: 44px;
    padding: 12px 16px;
  }
}

/* Touch-friendly элементы */
.clickable {
  min-height: 44px;
  min-width: 44px;
}
```

### 1.2 Производительность
**Проблема**: Большой размер JSON файла может замедлять загрузку

**Решение**:
- Добавить lazy loading для изображений
- Минификация JavaScript и CSS
- Сжатие JSON данных
- Добавить Service Worker для кеширования

**Service Worker (sw.js)**:
```javascript
const CACHE_NAME = 'veterok-schedule-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/schedule.json',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 1.3 Офлайн поддержка
**Решение**:
- Добавить manifest.json для PWA
- Кеширование критических ресурсов
- Уведомление о статусе подключения

**manifest.json**:
```json
{
  "name": "Veterok Schedule",
  "short_name": "Veterok",
  "description": "Расписание фестиваля Veterok 2025",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a90e2",
  "icons": [
    {
      "src": "images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## Приоритет 2: Функциональные улучшения

### 2.1 Расширенная фильтрация и поиск
**Функции**:
- Поиск по названию события
- Фильтр по типу события
- Фильтр по авторам
- Фильтр по времени (утро, день, вечер, ночь)
- Фильтр по длительности события

**Код для script.js**:
```javascript
class AdvancedFilter {
  constructor() {
    this.filters = {
      search: '',
      type: '',
      author: '',
      timeOfDay: '',
      duration: ''
    };
  }

  applyFilters(activities) {
    return activities.filter(activity => {
      return this.matchesSearch(activity) &&
             this.matchesType(activity) &&
             this.matchesAuthor(activity) &&
             this.matchesTimeOfDay(activity) &&
             this.matchesDuration(activity);
    });
  }

  matchesSearch(activity) {
    if (!this.filters.search) return true;
    const searchTerm = this.filters.search.toLowerCase();
    return activity.title.toLowerCase().includes(searchTerm) ||
           activity.description.toLowerCase().includes(searchTerm);
  }

  // ... другие методы фильтрации
}
```

### 2.2 Избранные события
**Функции**:
- Добавление/удаление событий из избранного
- Отдельная вкладка для избранных событий
- Сохранение в localStorage
- Уведомления о приближающихся избранных событиях

**Код**:
```javascript
class FavoriteManager {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
  }

  addToFavorites(activityId) {
    if (!this.favorites.includes(activityId)) {
      this.favorites.push(activityId);
      this.saveFavorites();
      this.showNotification('Событие добавлено в избранное');
    }
  }

  removeFromFavorites(activityId) {
    this.favorites = this.favorites.filter(id => id !== activityId);
    this.saveFavorites();
    this.showNotification('Событие удалено из избранного');
  }

  saveFavorites() {
    localStorage.setItem('favoriteEvents', JSON.stringify(this.favorites));
  }
}
```

### 2.3 Календарная интеграция
**Функции**:
- Экспорт событий в Google Calendar
- Создание .ics файлов
- Синхронизация с календарем устройства

**Код**:
```javascript
class CalendarExporter {
  exportToICS(activities) {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Veterok//Schedule//EN\n';
    
    activities.forEach(activity => {
      icsContent += this.createICSEvent(activity);
    });
    
    icsContent += 'END:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veterok-schedule.ics';
    a.click();
  }

  createICSEvent(activity) {
    const startTime = this.formatDateForICS(activity.date, activity.timeStart);
    const endTime = this.formatDateForICS(activity.date, activity.timeEnd);
    
    return `BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${activity.title}
DESCRIPTION:${activity.description}
LOCATION:${activity.track}
END:VEVENT\n`;
  }
}
```

## Приоритет 3: UX/UI улучшения

### 3.1 Темная тема
**Решение**:
```css
/* Темная тема */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #e0e0e0;
    --card-bg: #2d2d2d;
    --accent-color: #4a90e2;
  }
}

.dark-theme {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.dark-theme .activity-item {
  background-color: var(--card-bg);
  border-color: #444;
}
```

### 3.2 Анимации и переходы
**Код**:
```css
/* Плавные анимации */
.activity-item {
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-btn {
  transition: background-color 0.2s ease;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3.3 Улучшенные иконки и визуальные элементы
**Решение**:
- Использование SVG иконок вместо эмодзи
- Цветовая схема для типов событий
- Индикаторы статуса (прошедшие/текущие/будущие события)

## Приоритет 4: Интерактивные функции

### 4.1 Карта фестиваля
**Интерактивная карта с локациями кэмпов**

**HTML**:
```html
<div id="festival-map" class="map-container">
  <svg viewBox="0 0 800 600" class="festival-svg">
    <!-- Кэмпы как SVG элементы -->
    <g id="camp-zendo" class="camp-location" data-camp="zendo">
      <circle cx="100" cy="100" r="20" fill="#8A2BE2"/>
      <text x="100" y="105" text-anchor="middle">🔮</text>
    </g>
    <!-- Другие кэмпы... -->
  </svg>
</div>
```

**JavaScript**:
```javascript
class FestivalMap {
  constructor() {
    this.initMap();
  }

  initMap() {
    const campElements = document.querySelectorAll('.camp-location');
    campElements.forEach(camp => {
      camp.addEventListener('click', (e) => {
        const campId = e.target.dataset.camp;
        this.showCampInfo(campId);
      });
    });
  }

  showCampInfo(campId) {
    const camp = scheduleData.places.find(p => p.id === campId);
    // Показать информацию о кэмпе
  }
}
```

### 4.2 Уведомления
**Push уведомления о событиях**

**Service Worker**:
```javascript
// Запрос разрешения на уведомления
if ('Notification' in window) {
  Notification.requestPermission();
}

// Планирование уведомлений
function scheduleNotification(activity) {
  const notificationTime = new Date(activity.date + 'T' + activity.timeStart);
  notificationTime.setMinutes(notificationTime.getMinutes() - 15); // за 15 минут

  const timeUntilNotification = notificationTime.getTime() - Date.now();
  
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      new Notification(`Скоро начнется: ${activity.title}`, {
        body: `В ${activity.timeStart} в ${activity.track}`,
        icon: '/images/logo.png'
      });
    }, timeUntilNotification);
  }
}
```

### 4.3 Социальные функции
**Комментарии и рейтинги**

**HTML**:
```html
<div class="social-features">
  <div class="rating">
    <span class="stars">
      <i class="star" data-rating="1">★</i>
      <i class="star" data-rating="2">★</i>
      <i class="star" data-rating="3">★</i>
      <i class="star" data-rating="4">★</i>
      <i class="star" data-rating="5">★</i>
    </span>
    <span class="rating-count">(0 отзывов)</span>
  </div>
  
  <div class="comments">
    <textarea placeholder="Оставьте отзыв о событии..."></textarea>
    <button class="submit-comment">Отправить</button>
  </div>
</div>
```

## Приоритет 5: Аналитика и мониторинг

### 5.1 Пользовательская аналитика
**Отслеживание**:
- Популярные события
- Время нахождения на сайте
- Используемые фильтры
- Конверсия в избранное

**Код**:
```javascript
class Analytics {
  constructor() {
    this.events = [];
  }

  trackEvent(eventName, data) {
    this.events.push({
      name: eventName,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    // Отправка в Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  }

  trackViewEvent(activityId) {
    this.trackEvent('view_event', {
      event_id: activityId,
      category: 'engagement'
    });
  }

  trackFilterUsage(filterType, filterValue) {
    this.trackEvent('use_filter', {
      filter_type: filterType,
      filter_value: filterValue,
      category: 'interaction'
    });
  }
}
```

### 5.2 Мониторинг производительности
**Метрики**:
- Время загрузки страницы
- Размер загружаемых ресурсов
- Ошибки JavaScript

**Код**:
```javascript
// Мониторинг производительности
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart);
    }
  });
});

perfObserver.observe({ entryTypes: ['navigation'] });
```

## Технические требования для реализации

### Инструменты разработки:
- **Препроцессор CSS**: SASS/SCSS
- **Минификация**: Terser (JS), cssnano (CSS)
- **Сборщик**: Webpack или Vite
- **Тестирование**: Jest для JavaScript
- **Линтинг**: ESLint, Prettier

### Структура проекта:
```
veterok-schedule/
├── src/
│   ├── js/
│   │   ├── main.js
│   │   ├── filters.js
│   │   ├── favorites.js
│   │   └── analytics.js
│   ├── scss/
│   │   ├── main.scss
│   │   ├── components/
│   │   └── utilities/
│   └── images/
├── dist/
├── tests/
└── docs/
```

### Оценка времени реализации:
- **Приоритет 1**: 2-3 недели
- **Приоритет 2**: 3-4 недели
- **Приоритет 3**: 1-2 недели
- **Приоритет 4**: 4-6 недель
- **Приоритет 5**: 1-2 недели

**Общее время**: 11-17 недель (в зависимости от команды)

## Заключение

Этот план улучшений превратит базовый сайт расписания в полноценное PWA приложение с богатым функционалом. Рекомендуется начать с реализации Приоритета 1, так как эти улучшения критически важны для пользовательского опыта.