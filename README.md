# 🌸 RedTracker 2000 (CycleTracker)

> **Ретро Telegram Mini App для отслеживания менструального цикла в ностальгической эстетике Windows 98 / Y2K.**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Telegram](https://img.shields.io/badge/Telegram_Bot-Mini_App-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots/webapps)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![UI Style](https://img.shields.io/badge/UI-Windows_98_/_Y2K-FF69B4?style=for-the-badge)](https://github.com/srebrorogiy/cycletracker)

---

## ✨ Особенности

- 🪟 **Аутентичный ретро-интерфейс Windows 98 / Y2K**:
  - Окна программ (`RedTracker.exe`, `Calendar_September.dll`) с винтажными кнопками управления.
  - Ретро-палитра, пиксельные акценты и ностальгическая типографика.
- 📱 **Telegram Mini App**:
  - Запуск в один клик прямо из Telegram через встроенную кнопку бота.
  - Адаптивный мобильный интерфейс, оптимизированный под Telegram WebApp SDK.
- 📅 **Интерактивный календарь цикла**:
  - Навигация по месяцам.
  - Отметка начала и завершения периода.
  - Подсветка активных дней и прогнозируемых дат.
- 🔮 **Расчёт фаз и прогноз**:
  - Определение текущего дня цикла.
  - Автоматический расчёт фазы: *Менструация*, *Фолликулярная*, *Овуляция*, *Лютеиновая*.
  - Обратный отсчёт дней до следующего цикла и дата предполагаемой овуляции.
- 💾 **Хранение данных**:
  - База данных SQLite с историей циклов пользователя.
- 🐳 **Готовность к деплою**:
  - `docker-compose` связка: бэкенд (FastAPI), Telegram-бот (aiogram/python-telegram-bot) и Caddy (автоматические SSL-сертификаты Let's Encrypt).

---

## 🛠 Стек технологий

| Категория | Технологии |
|---|---|
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic |
| **Bot** | `python-telegram-bot` (Telegram Bot API) |
| **Frontend** | HTML5, CSS3 (Windows 98 theme), Vanilla JavaScript, Telegram WebApp JS SDK |
| **База данных** | SQLite |
| **Инфраструктура** | Docker, Docker Compose, Caddy (авто-HTTPS) |

---

## 📁 Структура проекта

```text
├── bot.py               # Telegram-бот с кнопкой запуска Mini App
├── server.py            # FastAPI веб-сервер и REST API эндпоинты
├── tracker.py           # Логика расчёта цикла, дат овуляции и прогнозов
├── phases.py            # Определение фаз менструального цикла
├── db.py                # Инициализация и операции с базой данных SQLite
├── index.html           # Интерфейс ретро-приложения (Windows 98)
├── app.js               # Клиентская логика календаря и взаимодействие с API
├── style.css            # Ретро-стили (Win98 window, buttons, calendar)
├── requirements.txt     # Зависимости Python
├── Dockerfile           # Сборка контейнера приложения
├── docker-compose.yml   # Оркестрация сервисов (web + bot)
├── Caddyfile            # Конфигурация Caddy обратного прокси для HTTPS
└── .env.example         # Пример конфигурации переменных окружения
```

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone git@github.com:srebrorogiy/cycletracker.git
cd cycletracker
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

Заполните переменные в `.env`:

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ  # Токен от @BotFather
WEBAPP_URL=https://your-domain.com               # Публичный HTTPS URL приложения
DOMAIN_NAME=your-domain.com                      # Домен для Caddy (при деплое)
```

---

### 3. Локальный запуск (для разработки)

#### Создание и активация виртуального окружения:

```bash
python3 -m venv .venv
source .venv/bin/activate  # macOS / Linux
# .venv\Scripts\activate   # Windows
```

#### Установка зависимостей:

```bash
pip install -r requirements.txt
```

#### Запуск сервера:

```bash
uvicorn server:app --reload --port 8000
```
> Откройте в браузере: [http://localhost:8000](http://localhost:8000)

#### Запуск Telegram-бота (в отдельном терминале):

```bash
python bot.py
```

---

### 4. Запуск через Docker Compose (Production)

Для развёртывания на сервере с автоматическим получением SSL-сертификата:

```bash
docker compose up -d --build
```

Сервисы будут запущены в изолированных контейнерах:
- `web` — FastAPI бэкенд на порту 8000
- `bot` — Telegram-бот в режиме polling

---

## 📡 API Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/` | Главная страница ретро-приложения |
| `GET` | `/api/cycles` | Получить список всех сохранённых циклов |
| `POST` | `/api/cycles` | Сохранить новый цикл (`start_date`, `end_date`) |
| `GET` | `/api/cycle-info` | Получить текущую информацию о цикле и фазе |

---

## 🔮 Планы развития (Roadmap)

- [ ] Поддержка многопользовательского режима через `Telegram user_id` из `initData`
- [ ] Напоминания и уведомления в Telegram о приближении следующей фазы
- [ ] Экспорт истории циклов в CSV/JSON
- [ ] Кастомные темы оформления (Classic Win98, Vaporwave, Cyberpunk 2000)
- [ ] Статистика средней длины цикла и отклонений

---

## 👩‍💻 Автор

- GitHub: [@srebrorogiy](https://github.com/srebrorogiy)
- Репозиторий: [srebrorogiy/cycletracker](https://github.com/srebrorogiy/cycletracker)
