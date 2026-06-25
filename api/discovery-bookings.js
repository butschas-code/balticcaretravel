const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const nodemailer = require('nodemailer');

const TIMEZONE = 'Europe/Riga';
const OWNER_EMAIL = 'sascha@balticcaretravel.com';
const SLOT_MINUTES = 15;
const DEFAULT_MEETING_LOCATION =
  'Zoom: https://us05web.zoom.us/j/3512850325?pwd=dscobVBwpaJbsbbzHtP7ciaJgmwxVN.1&omn=82113167293';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 20000) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });
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

function formatSlot(iso) {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcs(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function publicEmailError(err) {
  const message = String((err && err.message) || err || 'Unknown email error.');
  return message
    .replace(/pass(word)?["'=:\s]+[^,\s}]+/gi, 'password=[hidden]')
    .replace(/Bearer\s+[a-z0-9._-]+/gi, 'Bearer [hidden]')
    .slice(0, 500);
}

function createIcs({ startAt, endAt, name, company }) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const stamp = new Date();
  const location = process.env.BOOKING_MEETING_LOCATION || DEFAULT_MEETING_LOCATION;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Baltic Care Travel//Partner Discovery//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${randomUUID()}@balticcaretravel.com`,
    `DTSTAMP:${formatIcsDate(stamp)}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    'SUMMARY:15-minute discovery call with Baltic Care Travel',
    `DESCRIPTION:${escapeIcs(`Discovery call with ${name}${company ? ` (${company})` : ''}. Time shown in your calendar timezone.`)}`,
    `LOCATION:${escapeIcs(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

async function sendEmail({ to, subject, html, ics }) {
  const host = process.env.SMTP_HOST || 'smtppro.zoho.eu';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.BOOKING_FROM_EMAIL || (user ? `Baltic Care Travel <${user}>` : '');

  if (!user || !pass) throw new Error('SMTP_USER and SMTP_PASS are not configured.');
  if (!from) throw new Error('BOOKING_FROM_EMAIL or SMTP_USER is required.');

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    replyTo: OWNER_EMAIL,
    subject,
    html,
    attachments: ics
      ? [
          {
            filename: 'discovery-call.ics',
            content: ics,
            contentType: 'text/calendar; charset=utf-8; method=REQUEST',
          },
        ]
      : [],
  });
}

function validateSlot(startAt) {
  const date = new Date(startAt);
  if (!Number.isFinite(date.getTime())) return 'Please choose a valid time slot.';
  if (date.getTime() < Date.now() + 5 * 60 * 1000) return 'This time slot is no longer available.';

  const p = zonedParts(date);
  const weekday = p.weekday;
  const hour = Number(p.hour);
  const minute = Number(p.minute);
  const isWeekday = weekday !== 'Sat' && weekday !== 'Sun';
  const isBusinessHour = hour >= 8 && (hour < 20 || (hour === 20 && minute === 0));
  const isSlotStep = minute % SLOT_MINUTES === 0;

  if (!isWeekday || !isBusinessHour || !isSlotStep || hour === 20) {
    return 'Please choose a weekday slot between 08:00 and 20:00 Riga time.';
  }
  return '';
}

async function handleGet(req, res, supabase) {
  const url = new URL(req.url, 'https://balticcaretravel.com');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let query = supabase
    .from('partner_discovery_bookings')
    .select('start_at,end_at,status')
    .eq('status', 'booked')
    .order('start_at', { ascending: true });

  if (from) query = query.gte('start_at', from);
  if (to) query = query.lt('start_at', to);

  const { data, error } = await query;
  if (error) return json(res, 500, { error: 'Could not load booked slots.' });
  return json(res, 200, { bookings: data || [] });
}

async function handlePost(req, res, supabase) {
  let body;
  try {
    body = await getBody(req);
  } catch (err) {
    return json(res, 400, { error: err.message });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const company = String(body.company || '').trim();
  const phone = String(body.phone || '').trim();
  const notes = String(body.notes || '').trim();
  const startAt = String(body.startAt || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || name.length > 120) return json(res, 400, { error: 'Please enter your name.' });
  if (!emailOk || email.length > 254) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (company.length > 160 || phone.length > 60 || notes.length > 1500) {
    return json(res, 400, { error: 'One of the fields is too long.' });
  }

  const slotError = validateSlot(startAt);
  if (slotError) return json(res, 400, { error: slotError });

  const startDate = new Date(startAt);
  const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60 * 1000);
  const endAt = endDate.toISOString();

  const { data, error } = await supabase
    .from('partner_discovery_bookings')
    .insert({
      start_at: startDate.toISOString(),
      end_at: endAt,
      timezone: TIMEZONE,
      name,
      email,
      company: company || null,
      phone: phone || null,
      notes: notes || null,
    })
    .select('id,start_at,end_at')
    .single();

  if (error) {
    if (error.code === '23505') return json(res, 409, { error: 'This time slot has just been booked. Please choose another one.' });
    return json(res, 500, { error: 'Could not save the booking.' });
  }

  const slotLabel = formatSlot(data.start_at);
  const location = process.env.BOOKING_MEETING_LOCATION || DEFAULT_MEETING_LOCATION;
  const ics = createIcs({ startAt: data.start_at, endAt: data.end_at, name, company });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || '-');
  const safePhone = escapeHtml(phone || '-');
  const safeNotes = escapeHtml(notes || '-').replace(/\n/g, '<br />');
  const safeSlotLabel = escapeHtml(slotLabel);
  const safeTimezone = escapeHtml(TIMEZONE);
  const safeLocation = escapeHtml(location);

  const bookerHtml = `
    <p>Hallo ${safeName},</p>
    <p>vielen Dank. Ihr 15-minütiges Discovery-Gespräch mit Baltic Care Travel ist gebucht.</p>
    <p><strong>Termin:</strong> ${safeSlotLabel} (${safeTimezone})<br />
    <strong>Dauer:</strong> 15 Minuten<br />
    <strong>Ort:</strong> ${safeLocation}</p>
    <p>Falls sich etwas ändert, antworten Sie einfach auf diese E-Mail.</p>
    <p>Viele Grüße<br />Baltic Care Travel</p>
  `;

  const ownerHtml = `
    <p>Neue Partner-Discovery-Buchung:</p>
    <p><strong>Termin:</strong> ${safeSlotLabel} (${safeTimezone})<br />
    <strong>Name:</strong> ${safeName}<br />
    <strong>E-Mail:</strong> ${safeEmail}<br />
    <strong>Firma:</strong> ${safeCompany}<br />
    <strong>Telefon:</strong> ${safePhone}</p>
    <p><strong>Notizen:</strong><br />${safeNotes}</p>
  `;

  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: 'Ihre Discovery-Call-Buchung bei Baltic Care Travel',
        html: bookerHtml,
        ics,
      }),
      sendEmail({
        to: OWNER_EMAIL,
        subject: `Neue Discovery-Call-Buchung: ${name}`,
        html: ownerHtml,
        ics,
      }),
    ]);
  } catch (err) {
    const emailError = publicEmailError(err);
    console.error('Booking confirmation email failed:', emailError);
    await supabase
      .from('partner_discovery_bookings')
      .update({ confirmation_error: emailError })
      .eq('id', data.id);
    return json(res, 202, {
      booking: data,
      warning: 'The booking was saved, but confirmation email could not be sent yet.',
      emailError,
    });
  }

  return json(res, 201, { booking: data });
}

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return json(res, 500, { error: 'Booking service is not configured.' });
  }

  try {
    if (req.method === 'GET') return await handleGet(req, res, supabase);
    return await handlePost(req, res, supabase);
  } catch (err) {
    return json(res, 500, { error: 'Unexpected booking service error.' });
  }
};
