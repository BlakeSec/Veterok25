# Руководство по локализации / Localization Guide

## Обзор / Overview

Добавлена полная система локализации для приложения "Расписание движух Ветерок / Tramontana'25" с поддержкой русского и английского языков.

Complete localization system has been added to the "Veterok / Tramontana'25 Activities Schedule" application with support for Russian and English languages.

## Возможности / Features

### Переключение языков / Language Switching
- Переключатель языков в правом верхнем углу интерфейса
- Language switcher in the top right corner of the interface
- Автоматическое сохранение выбранного языка в localStorage
- Automatic saving of selected language in localStorage
- Мгновенное переключение без перезагрузки страницы
- Instant switching without page reload

### Локализованные элементы / Localized Elements

#### Интерфейс / Interface
- **Заголовок страницы / Page Title**: "Расписание движух Ветерок / Tramontana'25" ↔ "Veterok / Tramontana'25 Activities Schedule"
- **Кнопки управления / Control Buttons**: 
  - "Что сейчас?" ↔ "What's Now?"
  - "Только избранное" ↔ "Favorites Only"
- **Вкладки / Tabs**: "Кэмпы" ↔ "Camps"

#### Содержание / Content
- **Дни недели / Days of week**: вс, пн, вт, ср, чт, пт, сб ↔ Sun, Mon, Tue, Wed, Thu, Fri, Sat
- **Месяцы / Months**: января, февраля, марта... ↔ January, February, March...
- **Приёмы пищи / Meals**: Завтрак, Обед, Ужин ↔ Breakfast, Lunch, Dinner
- **Треки / Tracks**: "Все треки" ↔ "All Tracks"

#### Избранное / Favorites
- **Кнопки / Buttons**: 
  - "Добавить в избранное" ↔ "Add to Favorites"
  - "Удалить из избранного" ↔ "Remove from Favorites"

#### Сообщения и уведомления / Messages and Notifications
- **Ошибки загрузки / Loading errors**
- **Функция "Что сейчас?" / "What's Now?" function alerts**
- **Общие уведомления / General notifications**

## Техническая реализация / Technical Implementation

### Структура переводов / Translation Structure

```javascript
const translations = {
    ru: {
        // Русские переводы
    },
    en: {
        // Английские переводы
    }
};
```

### Основные функции / Main Functions

1. **`t(key)`** - получение переведённого текста
2. **`switchLanguage(lang)`** - переключение языка
3. **`initializeLanguage()`** - инициализация языка при загрузке
4. **`updatePageLanguage()`** - обновление всех элементов интерфейса

### CSS стили / CSS Styles

Добавлены стили для переключателя языков:
- Адаптивный дизайн для мобильных устройств
- Стилизация в соответствии с общим дизайном приложения
- Hover и focus эффекты

## Использование / Usage

### Переключение языка / Language Switching

1. Найдите переключатель языков в правом верхнем углу
2. Выберите нужный язык из выпадающего списка
3. Интерфейс мгновенно переключится на выбранный язык

1. Find the language switcher in the top right corner
2. Select the desired language from the dropdown
3. The interface will instantly switch to the selected language

### Добавление новых переводов / Adding New Translations

Чтобы добавить новые переводы:

1. Откройте файл `script.js`
2. Найдите объект `translations`
3. Добавьте новые ключи в оба языка (ru и en)
4. Используйте функцию `t('новый_ключ')` в коде

To add new translations:

1. Open `script.js` file
2. Find the `translations` object
3. Add new keys to both languages (ru and en)
4. Use `t('new_key')` function in the code

### Совместимость / Compatibility

- ✅ Поддержка как русских, так и английских данных в schedule.json
- ✅ Обратная совместимость с существующими данными
- ✅ Автоматическое определение языка при первом запуске
- ✅ Сохранение настроек между сессиями

## Файлы изменений / Changed Files

1. **`index.html`** - добавлен переключатель языков
2. **`script.js`** - система локализации и обновление всех текстовых элементов
3. **`styles.css`** - стили для переключателя языков
4. **`LOCALIZATION_GUIDE.md`** - данное руководство

## Поддержка / Support

Система локализации полностью интегрирована в существующий код и не требует дополнительных зависимостей. Все переводы хранятся в JavaScript файле для быстрого доступа.

The localization system is fully integrated into the existing code and requires no additional dependencies. All translations are stored in the JavaScript file for quick access.