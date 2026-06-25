const TIMEZONE = 'Europe/Riga';
const API_URL = '/api/discovery-bookings';
const DAYS_TO_SHOW = 28;
const SLOT_MINUTES = 15;

const state = {
  days: [],
  selectedDate: '',
  selectedSlot: '',
  currentMonth: '',
  booked: new Set(),
  loading: true,
  statusKey: 'loading',
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const els = {
  status: document.getElementById('booking-status'),
  days: document.getElementById('booking-days'),
  slots: document.getElementById('booking-slots'),
  slotsTitle: document.getElementById('booking-slots-title'),
  selected: document.getElementById('booking-selected'),
  form: document.getElementById('booking-form-submit'),
  submit: document.getElementById('booking-submit'),
  startAt: document.getElementById('booking-start-at'),
  message: document.getElementById('booking-form-message'),
  refresh: document.getElementById('booking-refresh'),
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function currentLang() {
  const lang = window.BHT?.i18n?.getLang?.() || document.documentElement.getAttribute('lang') || 'de';
  return lang === 'en' ? 'en' : 'de';
}

function text(key, fallback, vars) {
  const value = window.BHT?.i18n?.get?.(`bookingPage.${key}`, currentLang()) || fallback || '';
  return Object.entries(vars || {}).reduce((out, [name, replacement]) => {
    return out.replace(new RegExp(`\\{${name}\\}`, 'g'), replacement);
  }, value);
}

function locale() {
  return currentLang() === 'de' ? 'de-DE' : 'en-GB';
}

function zonedParts(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const out = {};
  parts.forEach((part) => {
    if (part.type !== 'literal') out[part.type] = part.value;
  });
  return out;
}

function dateKeyFromDate(date) {
  const p = zonedParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function dateKeyToUtcNoon(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function addDays(dateKey, days) {
  const date = dateKeyToUtcNoon(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthKey(dateKey) {
  return dateKey ? dateKey.slice(0, 7) : '';
}

function monthStart(month) {
  return `${month}-01`;
}

function addMonths(month, diff) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + diff, 1, 12, 0, 0));
  return date.toISOString().slice(0, 7);
}

function compareMonth(a, b) {
  return a.localeCompare(b);
}

function zonedTimeToUtc(dateKey, hour, minute) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = target;

  for (let i = 0; i < 3; i += 1) {
    const p = zonedParts(new Date(guess));
    const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), 0);
    guess += target - asUtc;
  }

  return new Date(guess).toISOString();
}

function formatDateLabel(dateKey) {
  return new Intl.DateTimeFormat(locale(), {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(dateKeyToUtcNoon(dateKey));
}

function formatLongSlot(iso) {
  return new Intl.DateTimeFormat(locale(), {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatTime(iso) {
  return new Intl.DateTimeFormat(locale(), {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatMonthLabel(month) {
  return new Intl.DateTimeFormat(locale(), {
    timeZone: TIMEZONE,
    month: 'long',
    year: 'numeric',
  }).format(dateKeyToUtcNoon(monthStart(month)));
}

function formatWeekdayLabel(index) {
  const base = new Date(Date.UTC(2026, 0, 5 + index, 12, 0, 0));
  return new Intl.DateTimeFormat(locale(), {
    timeZone: TIMEZONE,
    weekday: 'short',
  }).format(base);
}

function weekdayIndex(dateKey) {
  return WEEKDAYS.indexOf(zonedParts(dateKeyToUtcNoon(dateKey)).weekday);
}

function buildDays() {
  const keys = [];
  const seen = new Set();
  const now = Date.now();

  for (let i = 0; keys.length < DAYS_TO_SHOW && i < 50; i += 1) {
    const candidate = new Date(now + i * 24 * 60 * 60 * 1000);
    const key = dateKeyFromDate(candidate);
    if (seen.has(key)) continue;
    seen.add(key);

    const p = zonedParts(dateKeyToUtcNoon(key));
    if (p.weekday !== 'Sat' && p.weekday !== 'Sun') keys.push(key);
  }

  state.days = keys;
  if (!state.selectedDate && keys.length) state.selectedDate = keys[0];
  if (!state.currentMonth && state.selectedDate) state.currentMonth = monthKey(state.selectedDate);
}

function buildSlots(dateKey) {
  const slots = [];
  const earliest = Date.now() + 5 * 60 * 1000;

  for (let hour = 8; hour < 20; hour += 1) {
    for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
      const iso = zonedTimeToUtc(dateKey, hour, minute);
      if (new Date(iso).getTime() < earliest) continue;
      if (state.booked.has(iso)) continue;
      slots.push(iso);
    }
  }

  return slots;
}

function renderDays() {
  els.days.innerHTML = '';
  els.days.classList.add('booking-calendar');

  const minMonth = monthKey(state.days[0]);
  const maxMonth = monthKey(state.days[state.days.length - 1]);
  if (!state.currentMonth) state.currentMonth = minMonth;

  const calendarHead = document.createElement('div');
  calendarHead.className = 'booking-calendar__head';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'booking-calendar__nav';
  prev.setAttribute('aria-label', text('previousMonth', 'Previous month'));
  prev.textContent = '‹';
  prev.disabled = compareMonth(state.currentMonth, minMonth) <= 0;
  prev.addEventListener('click', () => {
    state.currentMonth = addMonths(state.currentMonth, -1);
    render();
  });

  const month = document.createElement('div');
  month.className = 'booking-calendar__month';
  month.textContent = formatMonthLabel(state.currentMonth);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'booking-calendar__nav';
  next.setAttribute('aria-label', text('nextMonth', 'Next month'));
  next.textContent = '›';
  next.disabled = compareMonth(state.currentMonth, maxMonth) >= 0;
  next.addEventListener('click', () => {
    state.currentMonth = addMonths(state.currentMonth, 1);
    render();
  });

  calendarHead.append(prev, month, next);

  const weekdayRow = document.createElement('div');
  weekdayRow.className = 'booking-calendar__weekdays';
  WEEKDAYS.forEach((_, index) => {
    const label = document.createElement('span');
    label.textContent = formatWeekdayLabel(index);
    weekdayRow.appendChild(label);
  });

  const grid = document.createElement('div');
  grid.className = 'booking-calendar__grid';

  const availableDays = new Set(state.days);
  const first = monthStart(state.currentMonth);
  const start = addDays(first, -weekdayIndex(first));

  for (let index = 0; index < 42; index += 1) {
    const dateKey = addDays(start, index);
    const parts = zonedParts(dateKeyToUtcNoon(dateKey));
    const inMonth = monthKey(dateKey) === state.currentMonth;
    const isWeekend = parts.weekday === 'Sat' || parts.weekday === 'Sun';
    const slots = availableDays.has(dateKey) ? buildSlots(dateKey) : [];
    const isAvailable = inMonth && !isWeekend && slots.length > 0;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'booking-day';
    button.dataset.date = dateKey;
    button.setAttribute('aria-pressed', dateKey === state.selectedDate ? 'true' : 'false');
    button.disabled = !isAvailable;
    if (!inMonth) button.classList.add('is-outside-month');
    if (isWeekend) button.classList.add('is-weekend');

    const label = document.createElement('span');
    label.className = 'booking-day__label';
    label.textContent = String(Number(parts.day));

    const count = document.createElement('span');
    count.className = 'booking-day__count';
    count.textContent = !inMonth || isWeekend
      ? ''
      : slots.length
        ? text('openCountShort', '{n} open', { n: String(slots.length) })
        : text('full', 'Full');

    button.append(label, count);
    button.addEventListener('click', () => {
      state.selectedDate = dateKey;
      state.currentMonth = monthKey(dateKey);
      state.selectedSlot = '';
      render();
    });
    grid.appendChild(button);
  }

  els.days.append(calendarHead, weekdayRow, grid);
}

function renderSlots() {
  const slots = buildSlots(state.selectedDate);
  els.slots.innerHTML = '';
  els.slotsTitle.textContent = state.selectedDate ? formatDateLabel(state.selectedDate) : text('chooseDay', 'Choose a day');

  if (!slots.length) {
    const empty = document.createElement('p');
    empty.className = 'booking-empty';
    empty.textContent = text('noOpenSlots', 'No open slots on this day.');
    els.slots.appendChild(empty);
    return;
  }

  slots.forEach((iso) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'booking-slot';
    button.dataset.slot = iso;
    button.setAttribute('aria-pressed', iso === state.selectedSlot ? 'true' : 'false');
    button.textContent = formatTime(iso);
    button.addEventListener('click', () => {
      state.selectedSlot = iso;
      renderSelected();
    });
    els.slots.appendChild(button);
  });
}

function renderSelected() {
  const selectedButtons = document.querySelectorAll('.booking-slot');
  selectedButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.slot === state.selectedSlot ? 'true' : 'false');
  });

  if (state.selectedSlot) {
    els.selected.textContent = `${formatLongSlot(state.selectedSlot)} (${TIMEZONE})`;
    els.startAt.value = state.selectedSlot;
    els.submit.disabled = false;
  } else {
    els.selected.textContent = text('noTimeSelected', 'No time selected yet.');
    els.startAt.value = '';
    els.submit.disabled = true;
  }
}

function renderStatus() {
  els.status.textContent = text(state.statusKey, 'Loading available slots...');
}

function render() {
  renderStatus();
  renderDays();
  renderSlots();
  renderSelected();
}

async function loadBookings() {
  state.loading = true;
  state.statusKey = 'loading';
  renderStatus();
  els.message.textContent = '';

  buildDays();
  const from = zonedTimeToUtc(state.days[0], 0, 0);
  const lastDay = state.days[state.days.length - 1];
  const to = zonedTimeToUtc(lastDay, 23, 59);

  try {
    const response = await fetch(`${API_URL}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || text('loadBookedFailed', 'Could not load booked slots.'));
    state.booked = new Set((data.bookings || []).map((booking) => booking.start_at));
    state.loading = false;
    state.statusKey = 'statusReady';
    renderStatus();
  } catch (err) {
    state.booked = new Set();
    state.loading = false;
    state.statusKey = 'statusLoadFailed';
    renderStatus();
  }

  if (!buildSlots(state.selectedDate).length) {
    state.selectedDate = state.days.find((day) => buildSlots(day).length) || state.days[0] || '';
  }
  state.selectedSlot = '';
  render();
}

function setFormMessage(text, tone) {
  els.message.textContent = text;
  els.message.dataset.tone = tone || '';
}

function formPayload() {
  const formData = new FormData(els.form);
  return {
    startAt: String(formData.get('startAt') || ''),
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    company: String(formData.get('company') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
  };
}

async function submitBooking(event) {
  event.preventDefault();
  setFormMessage('', '');

  if (!state.selectedSlot) {
    setFormMessage(text('chooseSlotFirst', 'Please choose a time slot first.'), 'error');
    return;
  }
  if (!document.getElementById('booking-privacy').checked) {
    setFormMessage(text('consentRequired', 'Please confirm the consent checkbox.'), 'error');
    return;
  }
  if (!els.form.checkValidity()) {
    els.form.reportValidity();
    return;
  }

  els.submit.disabled = true;
  els.submit.textContent = text('booking', 'Booking...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPayload()),
    });
    const data = await response.json();
    if (!response.ok && response.status !== 202) throw new Error(data.error || text('completeFailed', 'Could not complete booking.'));

    state.booked.add(state.selectedSlot);
    const confirmedSlot = formatLongSlot(state.selectedSlot);
    state.selectedSlot = '';
    els.form.reset();
    render();

    if (data.warning) {
      var detail = data.emailError ? text('emailError', ' Email error: {error}', { error: data.emailError }) : '';
      setFormMessage(text('bookedWarning', 'Booked for {slot}. Confirmation email needs a manual retry.', { slot: confirmedSlot }) + detail, 'warning');
    } else {
      setFormMessage(text('bookedSuccess', 'Booked for {slot}. Confirmation emails are on their way.', { slot: confirmedSlot }), 'success');
    }
  } catch (err) {
    setFormMessage(err.message || text('tryAnotherSlot', 'Could not complete booking. Please try another slot.'), 'error');
  } finally {
    els.submit.textContent = text('submit', 'Book 15-minute call');
    renderSelected();
  }
}

if (els.refresh) els.refresh.addEventListener('click', loadBookings);
if (els.form) els.form.addEventListener('submit', submitBooking);
document.addEventListener('bht-lang-change', render);

loadBookings();
