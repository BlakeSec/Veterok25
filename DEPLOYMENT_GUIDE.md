# Развертывание сайта Veterok на GitHub Pages

## Быстрый старт

### 1. Создание репозитория на GitHub
1. Войдите в GitHub и создайте новый репозиторий
2. Назовите его `veterok-schedule` (или любое другое имя)
3. **НЕ** добавляйте README.md, .gitignore или лицензию (они уже есть)

### 2. Подготовка локального репозитория
```bash
# Инициализация git репозитория (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Veterok schedule website"

# Подключение к GitHub репозиторию
git remote add origin https://github.com/YOUR_USERNAME/veterok-schedule.git

# Установка основной ветки
git branch -M main

# Загрузка на GitHub
git push -u origin main
```

### 3. Настройка GitHub Pages
1. Перейдите в ваш репозиторий на GitHub
2. Нажмите на вкладку **Settings**
3. Прокрутите вниз до раздела **Pages**
4. В разделе **Source** выберите **Deploy from a branch**
5. Выберите ветку **main**
6. Выберите папку **/ (root)**
7. Нажмите **Save**

### 4. Доступ к сайту
- Сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/veterok-schedule/`
- Первое развертывание может занять несколько минут
- При каждом push в main ветку сайт будет автоматически обновляться

## Настройка собственного домена (опционально)

### 1. Покупка домена
- Купите домен у любого регистратора (Reg.ru, GoDaddy, Namecheap)
- Например: `veterok2025.ru`

### 2. Настройка DNS
В панели управления доменом добавьте записи:
```
A record: @ → 185.199.108.153
A record: @ → 185.199.109.153
A record: @ → 185.199.110.153
A record: @ → 185.199.111.153
CNAME: www → YOUR_USERNAME.github.io
```

### 3. Настройка в GitHub
1. В репозитории перейдите в **Settings > Pages**
2. В поле **Custom domain** введите ваш домен
3. Подождите проверки DNS
4. Включите **Enforce HTTPS**

## Автоматическое развертывание

### GitHub Actions (для продвинутых пользователей)
Создайте файл `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Обновление содержимого

### Обновление расписания
1. Отредактируйте файл `schedule.json`
2. Сохраните изменения
3. Загрузите на GitHub:
```bash
git add schedule.json
git commit -m "Update schedule data"
git push origin main
```

### Обновление стилей
1. Отредактируйте файл `styles.css`
2. Загрузите изменения аналогично

## Мониторинг и аналитика

### Google Analytics
Добавьте в `index.html` перед закрывающим тегом `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Яндекс.Метрика
Добавьте код счетчика в `index.html`.

## Резервное копирование

### Создание backup
```bash
# Создание архива
tar -czf veterok-backup-$(date +%Y%m%d).tar.gz \
  index.html schedule.json script.js styles.css images/ README.md

# Загрузка в облако
# Или сохранение на внешний носитель
```

### Восстановление
```bash
# Распаковка архива
tar -xzf veterok-backup-YYYYMMDD.tar.gz

# Восстановление репозитория
git add .
git commit -m "Restore from backup"
git push origin main
```

## Устранение проблем

### Сайт не загружается
1. Проверьте статус GitHub Pages в настройках репозитория
2. Убедитесь, что файл `index.html` находится в корне
3. Проверьте логи в разделе **Actions**

### Ошибки в JavaScript
1. Откройте DevTools в браузере (F12)
2. Проверьте вкладку **Console** на ошибки
3. Убедитесь, что файл `schedule.json` корректный

### Проблемы с кодировкой
1. Убедитесь, что все файлы сохранены в UTF-8
2. Проверьте `<meta charset="utf-8">` в HTML

## Безопасность

### Рекомендации
1. Не включайте в репозиторий чувствительные данные
2. Используйте GitHub Secrets для API ключей
3. Регулярно обновляйте зависимости

### Пример .gitignore
```
# Временные файлы
*.tmp
*.log
.DS_Store

# Конфиденциальные данные
.env
config.local.js

# Зависимости
node_modules/
```

## Дополнительные возможности

### SSL сертификат
GitHub Pages автоматически предоставляет SSL сертификат для `github.io` доменов.

### CDN
Для ускорения загрузки можно использовать:
- Cloudflare (бесплатно)
- jsDelivr для статических файлов

### Мониторинг uptime
- UptimeRobot
- Pingdom
- StatusCake

## Заключение

После выполнения всех шагов ваш сайт будет:
- ✅ Доступен 24/7
- ✅ Автоматически обновляется при изменениях
- ✅ Имеет SSL сертификат
- ✅ Поддерживает собственный домен
- ✅ Абсолютно бесплатен

Сайт готов к использованию участниками фестиваля Veterok!