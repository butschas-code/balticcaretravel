const TIMEZONE = 'Europe/Riga';
const API_URL = '/api/discovery-bookings';
const DAYS_TO_SHOW = 28;
const SLOT_MINUTES = 15;

const state = {
  days: [],
  selectedDate: '',
  selectedSlot: '',
  booked: new Set(),
  loading: true,
};

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
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(dateKeyToUtcNoon(dateKey));
}

function formatLongSlot(iso) {
  return new Intl.DateTimeFormat('en-GB', {
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
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
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
  state.days.forEach((dateKey) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'booking-day';
    button.dataset.date = dateKey;
    button.setAttribute('aria-pressed', dateKey === state.selectedDate ? 'true' : 'false');

    const label = document.createElement('span');
    label.className = 'booking-day__label';
    label.textContent = formatDateLabel(dateKey);

    const count = document.createElement('span');
    count.className = 'booking-day__count';
    const slots = buildSlots(dateKey);
    count.textContent = slots.length ? `${slots.length} open` : 'Full';

    button.disabled = !slots.length;
    button.append(label, count);
    button.addEventListener('click', () => {
      state.selectedDate = dateKey;
      state.selectedSlot = '';
      render();
    });
    els.days.appendChild(button);
  });
}

function renderSlots() {
  const slots = buildSlots(state.selectedDate);
  els.slots.innerHTML = '';
  els.slotsTitle.textContent = state.selectedDate ? formatDateLabel(state.selectedDate) : 'Choose a day';

  if (!slots.length) {
    const empty = document.createElement('p');
    empty.className = 'booking-empty';
    empty.textContent = 'No open slots on this day.';
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
    els.selected.textContent = 'No time selected yet.';
    els.startAt.value = '';
    els.submit.disabled = true;
  }
}

function render() {
  renderDays();
  renderSlots();
  renderSelected();
}

async function loadBookings() {
  state.loading = true;
  els.status.textContent = 'Loading available slots…';
  els.message.textContent = '';

  buildDays();
  const from = zonedTimeToUtc(state.days[0], 0, 0);
  const lastDay = state.days[state.days.length - 1];
  const to = zonedTimeToUtc(lastDay, 23, 59);

  try {
    const response = await fetch(`${API_URL}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load booked slots.');
    state.booked = new Set((data.bookings || []).map((booking) => booking.start_at));
    state.loading = false;
    els.status.textContent = 'Calendar is up to date.';
  } catch (err) {
    state.booked = new Set();
    state.loading = false;
    els.status.textContent = 'Could not load live availability. Please refresh in a moment.';
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
    setFormMessage('Please choose a time slot first.', 'error');
    return;
  }
  if (!document.getElementById('booking-privacy').checked) {
    setFormMessage('Please confirm the consent checkbox.', 'error');
    return;
  }
  if (!els.form.checkValidity()) {
    els.form.reportValidity();
    return;
  }

  els.submit.disabled = true;
  els.submit.textContent = 'Booking…';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPayload()),
    });
    const data = await response.json();
    if (!response.ok && response.status !== 202) throw new Error(data.error || 'Could not complete booking.');

    state.booked.add(state.selectedSlot);
    const confirmedSlot = formatLongSlot(state.selectedSlot);
    state.selectedSlot = '';
    els.form.reset();
    render();

    if (data.warning) {
      var detail = data.emailError ? ` Email error: ${data.emailError}` : '';
      setFormMessage(`Booked for ${confirmedSlot}. Confirmation email needs a manual retry.${detail}`, 'warning');
    } else {
      setFormMessage(`Booked for ${confirmedSlot}. Confirmation emails are on their way.`, 'success');
    }
  } catch (err) {
    setFormMessage(err.message || 'Could not complete booking. Please try another slot.', 'error');
  } finally {
    els.submit.textContent = 'Book 15-minute call';
    renderSelected();
  }
}

if (els.refresh) els.refresh.addEventListener('click', loadBookings);
if (els.form) els.form.addEventListener('submit', submitBooking);

loadBookings();
