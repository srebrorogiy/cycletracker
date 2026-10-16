// ==========================================
// 🌸 Инициализация Telegram WebApp
// ==========================================
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if (tg.initDataUnsafe?.user?.first_name) {
        document.getElementById('greeting-text').innerText = `Привет, ${tg.initDataUnsafe.user.first_name}! :3`;
    }
}

function getUserId() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return window.Telegram.WebApp.initDataUnsafe.user.id;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has('user_id')) {
        return Number(params.get('user_id'));
    }

    return 1;
}

// Живые ретро-часики в панели Пуск
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('xp-clock');
    if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// Данные по умолчанию (для визуализации)
// ==========================================
let personalData = {
    start_date: "2026-09-01",
    current_date: 0,
    prediction: "",
    ovulation_date: "",
    countDaysToNextPeriod: 28,
    phase: "Фолликулярная фаза"
};

// ==========================================
// 📅 Генератор ретро-календаря
// ==========================================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = new Date().toISOString().split('T'[0]);
let cyclesHistory = [];

const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let rangeStart = null;
let rangeEnd = null;

// Клик по дате в календаре
function onDateClicked(dateStr) {
    if (!rangeStart || (rangeStart && rangeEnd)){
        rangeStart = dateStr;
        rangeEnd = null;
    } else if (rangeStart && !rangeEnd) {
        if (dateStr < rangeStart) {
            rangeStart = dateStr;
        }
        else {
            rangeEnd = dateStr
        }
    }
    renderCalendar(currentMonth, currentYear)
    updateUI(personalData)
    
}

function renderCalendar(month, year) {
    const grid = document.getElementById('calendar-days');
    const label = document.getElementById('current-month-label');
    grid.innerHTML = '';
    label.innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Сдвиг (понедельник = 0)
    const shift = (firstDay + 6) % 7;

    for (let i = 0; i < shift; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-cell empty';
        grid.appendChild(empty);
    }

    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
        const thisDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-cell';
        dayEl.innerText = d;
        dayEl.dataset.date = thisDateStr;

        // Подсветка сегодняшнего дня
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        dayEl.addEventListener('click', () => {
            onDateClicked(thisDateStr);
        })

        if (thisDateStr === rangeStart) {
            dayEl.classList.add('range-start')
        }

        if (thisDateStr === rangeEnd) {
            dayEl.classList.add('range-end')
        }

        if (rangeStart && rangeEnd && thisDateStr > rangeStart && thisDateStr < rangeEnd) {
            dayEl.classList.add('period')
        }
        
        if (cyclesHistory && Array.isArray(cyclesHistory)){
            for (const cycle of cyclesHistory) {
                if (thisDateStr >= cycle.start_date && thisDateStr <= cycle.end_date){
                    dayEl.classList.add('period')
                }
            }
        }

        if (month === today.getMonth() && d === personalData.ovulation_date) {
            dayEl.classList.add('ovulation');
        }
        
        grid.appendChild(dayEl);
    }
}

// Переключение месяцев
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
});

function updateUI(cycleInfo) {
    const cell = document.getElementsByClassName('cal-cell');
    const targetStart = cycleInfo.start_date;
    const targetEnd = cycleInfo.end_date;

    if (!targetStart || !targetEnd) return;

    for (c of cell) {
        const targetCell = c.dataset.date;
        if (targetStart <= targetCell && targetCell <= targetEnd) {
            c.classList.add('period')
        }

    }
}

// ==========================================
// 💡 Обработчики действий (ТВОЙ БЭКЕНД)
// ==========================================

// Клик по кнопке "ОТМЕТИТЬ НАЧАЛО"
// document.getElementById('btn-log-period').addEventListener('click', () => {
//     const todayStr = new Date().toISOString().split('T')[0];
//     console.log("Отмечено начало цикла:", todayStr);
//     savePeriodStartDate(todayStr);
// });

const button = document.getElementById('btn-add-period')
button.addEventListener('click', () => {
        savePeriodStartDate(rangeStart, rangeEnd);
        loadCycleDataFromBackend()
})

// Клик по пилюлям симптомов
document.querySelectorAll('.y2k-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        pill.classList.toggle('active');
        const symptom = pill.dataset.symptom;
        console.log("Симптом переключен:", symptom);
    });
});

// ==========================================
// 🚀 Функции под твой Python API
// ==========================================

async function loadCycleDataFromBackend() {
    const userId = getUserId();
    try {
        const cycle_data = await fetch(`/api/cycles?user_id=${userId}`);
        cyclesHistory = await cycle_data.json()
    } catch (e) {
        console.error("Load error:", e);
    }
    
    renderCalendar(currentMonth, currentYear);
    updateUI(personalData);
}

async function savePeriodStartDate(rangeStart, rangeEnd) {
    const userId = getUserId();
    const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({start_date: rangeStart, end_date: rangeEnd, user_id: userId})
    });

    const NewData = await response.json()
    personalData = NewData;
    renderCalendar(currentMonth, currentYear);
    updateUI(personalData);
}

// Запуск
loadCycleDataFromBackend();
renderCalendar(currentMonth, currentYear);
