import { getSupabase, isConfigured } from './supabase.js';
import { t, setLang, getLang } from './i18n.js';
import './portal.css';

var MAX_BYTES = 5 * 1024 * 1024;
var Q_SLUG = 'intake_v1';

var STEP_KEY = 'bht-portal-step';

var state = {
  user: null,
  profile: null,
  intake: null,
  cases: [],
  questionnaire: null,
  files: [],
  step: 1,
  authTab: 'login',
  message: '',
  messageOk: false,
  loading: false,
  /** Set after signUp when email confirmation is required (no session yet). */
  authPendingEmail: null,
};

function persistStep(n) {
  try {
    if (n >= 2 && n <= 4) sessionStorage.setItem(STEP_KEY, String(n));
    else sessionStorage.removeItem(STEP_KEY);
  } catch (_) {}
}

function readPersistedStep() {
  try {
    var n = parseInt(sessionStorage.getItem(STEP_KEY), 10);
    return n >= 2 && n <= 4 ? n : null;
  } catch (_) {
    return null;
  }
}

function esc(s) {
  if (s == null || s === '') return '';
  var d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

function syncLangFromSite() {
  if (window.BHT && window.BHT.i18n) {
    var g = window.BHT.i18n.getLang();
    if (g === 'de' || g === 'en') setLang(g);
  }
}

function applySiteLang() {
  if (window.BHT && window.BHT.i18n) {
    window.BHT.i18n.setLang(getLang());
    window.BHT.i18n.applyLang();
  }
}

async function loadPatientBundle(supabase, uid) {
  var intake = await supabase.from('patient_intake').select('*').eq('user_id', uid).maybeSingle();
  if (intake.error) throw intake.error;
  var casesRes = await supabase
    .from('patient_cases')
    .select('*')
    .eq('user_id', uid)
    .order('assigned_at', { ascending: false });
  if (casesRes.error) throw casesRes.error;
  var quest = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('user_id', uid)
    .eq('questionnaire_slug', Q_SLUG)
    .maybeSingle();
  if (quest.error) throw quest.error;
  var files = await supabase.from('case_files').select('*').eq('user_id', uid).order('created_at', { ascending: false });
  if (files.error) throw files.error;

  var caseRows = casesRes.data || [];
  var clinicIds = caseRows
    .map(function (c) {
      return c.clinic_id;
    })
    .filter(function (id, i, a) {
      return id && a.indexOf(id) === i;
    });
  var clinicById = {};
  if (clinicIds.length) {
    var clin = await supabase.from('clinics').select('id,name').in('id', clinicIds);
    if (!clin.error && clin.data) {
      clin.data.forEach(function (row) {
        clinicById[row.id] = row;
      });
    }
  }
  caseRows = caseRows.map(function (c) {
    var copy = Object.assign({}, c);
    var cl = c.clinic_id ? clinicById[c.clinic_id] : null;
    copy.clinics = cl ? { name: cl.name } : null;
    return copy;
  });

  state.intake = intake.data;
  state.cases = caseRows;
  state.questionnaire = quest.data;
  state.files = files.data || [];
}

async function loadClinicBundle(supabase, clinicId) {
  var { data: cases, error: e1 } = await supabase
    .from('patient_cases')
    .select('*, clinics(name)')
    .eq('clinic_id', clinicId)
    .order('assigned_at', { ascending: false });
  if (e1) throw e1;
  cases = cases || [];
  var ids = cases
    .map(function (c) {
      return c.user_id;
    })
    .filter(function (id, i, a) {
      return id && a.indexOf(id) === i;
    });
  var profMap = {};
  if (ids.length) {
    var { data: profs, error: e2 } = await supabase.from('profiles').select('id,email,full_name').in('id', ids);
    if (e2) throw e2;
    (profs || []).forEach(function (p) {
      profMap[p.id] = p;
    });
  }
  state.cases = cases.map(function (c) {
    var copy = Object.assign({}, c);
    copy.profiles = profMap[c.user_id] || null;
    return copy;
  });
}

/** @typedef {{ access_token: string; refresh_token: string; user?: object }} SessionLike */

/**
 * @param {SessionLike | null | undefined} sessionOverride
 *        Session from signIn/signUp so we do not rely on getSession() before the client has persisted it.
 */
async function refreshSession(sessionOverride) {
  var supabase = getSupabase();
  if (!supabase) return;
  state.loading = true;
  state.message = '';
  renderShell();
  try {
    var session = null;

    // When called right after signInWithPassword / signUp, the session is already
    // persisted by the auth client. Just read it.
    var sessRes = await supabase.auth.getSession();
    session = sessRes.data && sessRes.data.session ? sessRes.data.session : null;

    // If the caller gave us explicit tokens and getSession still found nothing, try setSession once.
    if (
      !session &&
      sessionOverride &&
      sessionOverride.access_token &&
      sessionOverride.refresh_token
    ) {
      var setRes = await supabase.auth.setSession({
        access_token: sessionOverride.access_token,
        refresh_token: sessionOverride.refresh_token,
      });
      if (!setRes.error && setRes.data && setRes.data.session) {
        session = setRes.data.session;
      }
    }

    state.user = session && session.user ? session.user : null;

    if (state.user) {
      state.authPendingEmail = null;

      // --- profile ---
      var p = await supabase.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
      if (p.error) {
        console.error('profiles select', p.error);
        state.profile = null;
        state.message = p.error.message || t('errorGeneric');
        state.messageOk = false;
        state.step = 2;
        persistStep(2);
        state.loading = false;
        renderShell();
        return;
      }
      if (!p.data) {
        var meta = state.user.user_metadata || {};
        var up = await supabase.from('profiles').upsert(
          {
            id: state.user.id,
            email: state.user.email || '',
            full_name: String(meta.full_name || meta.name || '').trim() || null,
            role: 'patient',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
        if (up.error) {
          console.error('profiles upsert', up.error);
          state.profile = null;
          state.message = up.error.message || t('errorProfileSync');
          state.messageOk = false;
          state.step = 2;
          persistStep(2);
          state.loading = false;
          renderShell();
          return;
        }
        p = await supabase.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
      }
      state.profile = p.data || null;

      // --- role routing ---
      if (state.profile && state.profile.role === 'clinic_staff') {
        if (state.profile.clinic_id) {
          try {
            await loadClinicBundle(supabase, state.profile.clinic_id);
          } catch (err) {
            console.error('loadClinicBundle', err);
            state.cases = [];
            state.message = err && err.message ? String(err.message) : t('errorGeneric');
            state.messageOk = false;
          }
        } else {
          state.cases = [];
          state.message = t('clinicStaffNoClinic');
          state.messageOk = false;
        }
      } else {
        try {
          await loadPatientBundle(supabase, state.user.id);
        } catch (bundleErr) {
          console.error('loadPatientBundle', bundleErr);
          state.intake = null;
          state.cases = [];
          state.questionnaire = null;
          state.files = [];
          state.message =
            bundleErr && bundleErr.message ? String(bundleErr.message) : t('errorGeneric');
          state.messageOk = false;
        }
        var saved = readPersistedStep();
        if (!state.intake) {
          state.step = 2;
          persistStep(2);
        } else if (saved != null) {
          state.step = saved;
        } else if (!state.cases || state.cases.length === 0) {
          state.step = 4;
        } else {
          state.step = 3;
        }
      }
    } else {
      state.profile = null;
      state.intake = null;
      state.cases = [];
      state.questionnaire = null;
      state.files = [];
      state.step = 1;
      try {
        sessionStorage.removeItem(STEP_KEY);
      } catch (_) {}
    }
  } catch (e) {
    console.error('refreshSession', e);
    state.message = (e && e.message) || t('errorGeneric');
    state.messageOk = false;
  }
  state.loading = false;
  renderShell();
}

function stepClass(n) {
  if (state.step === n) return 'is-active';
  if (state.step > n) return 'is-done';
  return '';
}

function renderStepper() {
  if (!state.user || (state.profile && state.profile.role === 'clinic_staff')) return '';
  return (
    '<ol class="portal-steps" role="list">' +
    '<li class="portal-step ' +
    stepClass(1) +
    '"><span class="portal-step-num">1</span> ' +
    esc(t('stepAuth')) +
    '</li>' +
    '<li class="portal-step ' +
    stepClass(2) +
    '"><span class="portal-step-num">2</span> ' +
    esc(t('stepIntake')) +
    '</li>' +
    '<li class="portal-step ' +
    stepClass(3) +
    '"><span class="portal-step-num">3</span> ' +
    esc(t('stepDocs')) +
    '</li>' +
    '<li class="portal-step ' +
    stepClass(4) +
    '"><span class="portal-step-num">4</span> ' +
    esc(t('stepClinic')) +
    '</li>' +
    '</ol>'
  );
}

function renderPendingConfirmationCard() {
  var email = state.authPendingEmail || '';
  var body = t('confirmEmailBody').replace(/\{email\}/g, email);
  return (
    '<div class="portal-card portal-card--pending">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    '<div class="portal-pending-icon" aria-hidden="true">' +
    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v12H4V6z" stroke="currentColor" stroke-width="1.5"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</div>' +
    '<h1 class="portal-pending-title">' +
    esc(t('confirmEmailTitle')) +
    '</h1>' +
    '<p class="portal-lead portal-lead--pending">' +
    esc(body) +
    '</p>' +
    '<ul class="portal-pending-steps" role="list">' +
    '<li>' +
    esc(t('confirmEmailStep1')) +
    '</li>' +
    '<li>' +
    esc(t('confirmEmailStep2')) +
    '</li>' +
    '<li>' +
    esc(t('confirmEmailStep3')) +
    '</li>' +
    '</ul>' +
    '<p class="portal-confirm-hint">' +
    esc(t('confirmEmailHint')) +
    '</p>' +
    '<div class="portal-actions portal-actions--pending">' +
    '<button type="button" class="portal-btn portal-btn--primary" data-auth-pending-login>' +
    esc(t('confirmEmailToLogin')) +
    '</button>' +
    '</div>' +
    '</div></div>'
  );
}

function renderAuthCard() {
  if (state.authPendingEmail) {
    return renderPendingConfirmationCard();
  }
  var loginActive = state.authTab === 'login' ? ' portal-btn--primary' : ' portal-btn--ghost';
  var regActive = state.authTab === 'register' ? ' portal-btn--primary' : ' portal-btn--ghost';
  return (
    '<div class="portal-card">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    '<div class="portal-eyebrow">' + esc(t('stepAuth')) + '</div>' +
    '<h1>' +
    esc(t('authTitle')) +
    '</h1>' +
    '<p class="portal-lead">' +
    esc(t('authLead')) +
    '</p>' +
    (state.message
      ? '<div class="portal-msg ' +
        (state.messageOk ? 'portal-msg--ok' : 'portal-msg--err') +
        '">' +
        esc(state.message) +
        '</div>'
      : '') +
    '<div class="portal-auth-tabs">' +
    '<button type="button" class="portal-btn' +
    loginActive +
    '" data-auth-tab="login">' +
    esc(t('tabLogin')) +
    '</button>' +
    '<button type="button" class="portal-btn' +
    regActive +
    '" data-auth-tab="register">' +
    esc(t('tabRegister')) +
    '</button>' +
    '</div>' +
    '<form class="portal-auth-form" style="margin-top:1.5rem">' +
    (state.authTab === 'register'
      ? '<div class="portal-field"><label for="pf-name">' +
        esc(t('fullName')) +
        '</label><input type="text" id="pf-name" name="full_name" required autocomplete="name" /></div>'
      : '') +
    '<div class="portal-field"><label for="pf-email">' +
    esc(t('email')) +
    '</label><input type="email" id="pf-email" name="email" required autocomplete="email" /></div>' +
    '<div class="portal-field"><label for="pf-pass">' +
    esc(t('password')) +
    '</label><input type="password" id="pf-pass" name="password" required minlength="8" autocomplete="' +
    (state.authTab === 'login' ? 'current-password' : 'new-password') +
    '" /></div>' +
    '<div class="portal-actions">' +
    '<button type="submit" class="portal-btn portal-btn--primary">' +
    esc(state.authTab === 'login' ? t('signIn') : t('signUp')) +
    '</button>' +
    '</div>' +
    '</form>' +
    '</div></div>'
  );
}

function intakeValues() {
  var i = state.intake || {};
  return {
    treatment_type: i.treatment_type || '',
    country: i.country || state.profile?.country || '',
    phone: i.phone || state.profile?.phone || '',
    preferred_language: i.preferred_language || state.profile?.preferred_language || getLang(),
    referral_source: i.referral_source || '',
    consent_terms: !!i.consent_terms,
    consent_privacy: !!i.consent_privacy,
    consent_health_data: !!i.consent_health_data,
  };
}

function renderIntakeCard() {
  var v = intakeValues();
  return (
    '<div class="portal-card">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    renderStepper() +
    '<div class="portal-eyebrow">' + esc(t('stepIntake')) + '</div>' +
    '<h1>' +
    esc(t('intakeTitle')) +
    '</h1>' +
    '<p class="portal-lead">' +
    esc(t('intakeLead')) +
    '</p>' +
    (state.message
      ? '<div class="portal-msg ' +
        (state.messageOk ? 'portal-msg--ok' : 'portal-msg--err') +
        '">' +
        esc(state.message) +
        '</div>'
      : '') +
    '<form id="form-intake">' +
    '<div class="portal-field"><label for="in-treat">' +
    esc(t('treatmentType')) +
    '</label><select id="in-treat" name="treatment_type" required>' +
    '<option value="">' +
    esc(t('treatmentPlaceholder')) +
    '</option>' +
    '<option value="dental"' +
    (v.treatment_type === 'dental' ? ' selected' : '') +
    '>' +
    esc(t('treatmentDental')) +
    '</option>' +
    '<option value="fertility"' +
    (v.treatment_type === 'fertility' ? ' selected' : '') +
    '>' +
    esc(t('treatmentFertility')) +
    '</option>' +
    '<option value="orthopedic"' +
    (v.treatment_type === 'orthopedic' ? ' selected' : '') +
    '>' +
    esc(t('treatmentOrtho')) +
    '</option>' +
    '<option value="plastic"' +
    (v.treatment_type === 'plastic' ? ' selected' : '') +
    '>' +
    esc(t('treatmentPlastic')) +
    '</option>' +
    '<option value="other"' +
    (v.treatment_type === 'other' ? ' selected' : '') +
    '>' +
    esc(t('treatmentOther')) +
    '</option>' +
    '</select></div>' +
    '<div class="portal-divider"></div>' +
    '<div class="portal-legend">' + esc(t('country')) + ' & ' + esc(t('phone')) + '</div>' +
    '<div class="portal-row-split">' +
    '<div class="portal-field"><label for="in-country">' +
    esc(t('country')) +
    '</label><input type="text" id="in-country" name="country" value="' +
    esc(v.country) +
    '" autocomplete="country-name" /></div>' +
    '<div class="portal-field"><label for="in-phone">' +
    esc(t('phone')) +
    '</label><input type="tel" id="in-phone" name="phone" value="' +
    esc(v.phone) +
    '" autocomplete="tel" /></div>' +
    '</div>' +
    '<div class="portal-row-split">' +
    '<div class="portal-field"><label for="in-lang">' +
    esc(t('preferredLang')) +
    '</label><select id="in-lang" name="preferred_language">' +
    '<option value="de"' +
    (v.preferred_language === 'de' ? ' selected' : '') +
    '>' +
    esc(t('langDe')) +
    '</option>' +
    '<option value="en"' +
    (v.preferred_language === 'en' ? ' selected' : '') +
    '>' +
    esc(t('langEn')) +
    '</option>' +
    '</select></div>' +
    '<div class="portal-field"><label for="in-ref">' +
    esc(t('referral')) +
    '</label><input type="text" id="in-ref" name="referral_source" value="' +
    esc(v.referral_source) +
    '" placeholder="' +
    esc(t('referralPlaceholder')) +
    '" /></div>' +
    '</div>' +
    '<div class="portal-divider"></div>' +
    '<label class="portal-check"><input type="checkbox" name="consent_terms" value="1"' +
    (v.consent_terms ? ' checked' : '') +
    ' required /><span>' +
    t('consentTerms') +
    '</span></label>' +
    '<label class="portal-check"><input type="checkbox" name="consent_privacy" value="1"' +
    (v.consent_privacy ? ' checked' : '') +
    ' required /><span>' +
    t('consentPrivacy') +
    '</span></label>' +
    '<label class="portal-check"><input type="checkbox" name="consent_health_data" value="1"' +
    (v.consent_health_data ? ' checked' : '') +
    ' required /><span>' +
    esc(t('consentHealth')) +
    '</span></label>' +
    '<div class="portal-actions">' +
    '<button type="submit" class="portal-btn portal-btn--primary">' +
    esc(t('saveContinue')) +
    '</button>' +
    '</div>' +
    '</form>' +
    '</div></div>'
  );
}

function renderClinicCard() {
  var c = state.cases && state.cases[0];
  var detail = '';
  if (!c) {
    detail = '<p class="portal-muted" style="margin-top:0">' + esc(t('clinicPending')) + '</p>';
  } else {
    var cn = (c.clinics && c.clinics.name) || '—';
    detail =
      '<div class="portal-divider"></div>' +
      '<p style="margin:0 0 0.5rem"><strong>' +
      esc(t('clinicAssigned')) +
      ':</strong> ' +
      esc(cn) +
      '</p>' +
      '<p class="portal-muted" style="margin:0 0 0.35rem"><strong>' +
      esc(t('treatmentPlanId')) +
      ':</strong> ' +
      esc(c.treatment_plan_id || '—') +
      '</p>' +
      '<p class="portal-muted" style="margin:0"><strong>' +
      esc(t('status')) +
      ':</strong> ' +
      esc(c.status) +
      '</p>';
  }
  return (
    '<div class="portal-card">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    renderStepper() +
    '<div class="portal-eyebrow">' + esc(t('stepClinic')) + '</div>' +
    '<h1>' +
    esc(t('clinicTitle')) +
    '</h1>' +
    '<p class="portal-lead">' +
    esc(t('clinicLead')) +
    '</p>' +
    (state.message
      ? '<div class="portal-msg ' +
        (state.messageOk ? 'portal-msg--ok' : 'portal-msg--err') +
        '">' +
        esc(state.message) +
        '</div>'
      : '') +
    detail +
    '<div class="portal-actions">' +
    '<button type="button" class="portal-btn portal-btn--ghost" data-step="3">' +
    esc(t('back')) +
    '</button>' +
    '</div>' +
    '</div></div>'
  );
}

function qValues() {
  var r = (state.questionnaire && state.questionnaire.responses) || {};
  return {
    reason: r.reason || '',
    allergies: r.allergies || '',
    medications: r.medications || '',
    conditions: r.conditions || '',
    emergency_name: r.emergency_name || '',
    emergency_phone: r.emergency_phone || '',
    confirm_accurate: !!r.confirm_accurate,
  };
}

function renderDocsCard() {
  var v = qValues();
  var primaryCase = state.cases && state.cases[0];
  var fileRows =
    state.files.length === 0
      ? '<p class="portal-muted">' + esc(t('noFiles')) + '</p>'
      : state.files
          .map(function (f) {
            return (
              '<div class="portal-file-row"><span>' +
              esc(f.file_name) +
              '</span><span class="portal-muted">' +
              (f.size_bytes ? Math.round(f.size_bytes / 1024) + ' KB' : '') +
              '</span></div>'
            );
          })
          .join('');
  return (
    '<div class="portal-card">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    renderStepper() +
    '<div class="portal-eyebrow">' + esc(t('stepDocs')) + '</div>' +
    '<h1>' +
    esc(t('docsTitle')) +
    '</h1>' +
    '<p class="portal-lead">' +
    esc(t('docsLead')) +
    '</p>' +
    (state.message
      ? '<div class="portal-msg ' +
        (state.messageOk ? 'portal-msg--ok' : 'portal-msg--err') +
        '">' +
        esc(state.message) +
        '</div>'
      : '') +
    '<div class="portal-divider"></div>' +
    '<div class="portal-legend">' + esc(t('uploadLabel')) + '</div>' +
    '<p class="portal-muted" style="margin:0 0 1rem">' +
    esc(t('uploadHint')) +
    '</p>' +
    '<div class="portal-field"><input type="file" id="file-up" accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.dcm,application/pdf,image/*" /></div>' +
    '<div class="portal-actions" style="margin-top:0.75rem"><button type="button" class="portal-btn portal-btn--primary" data-upload>' +
    esc(t('uploadSubmit')) +
    '</button></div>' +
    '<div class="portal-divider"></div>' +
    '<div class="portal-legend">' + esc(t('yourFiles')) + '</div>' +
    fileRows +
    '<div class="portal-divider"></div>' +
    '<div id="print-zone">' +
    '<div class="portal-legend">' +
    esc(t('questionnaireTitle')) +
    '</div>' +
    '<form id="form-q">' +
    '<div class="portal-field"><label for="q-reason">' +
    esc(t('qReason')) +
    '</label><textarea id="q-reason" name="reason">' +
    esc(v.reason) +
    '</textarea></div>' +
    '<div class="portal-field"><label for="q-all">' +
    esc(t('qAllergies')) +
    '</label><textarea id="q-all" name="allergies">' +
    esc(v.allergies) +
    '</textarea></div>' +
    '<div class="portal-field"><label for="q-med">' +
    esc(t('qMeds')) +
    '</label><textarea id="q-med" name="medications">' +
    esc(v.medications) +
    '</textarea></div>' +
    '<div class="portal-field"><label for="q-cond">' +
    esc(t('qConditions')) +
    '</label><textarea id="q-cond" name="conditions">' +
    esc(v.conditions) +
    '</textarea></div>' +
    '<div class="portal-field"><label for="q-en">' +
    esc(t('qEmergencyName')) +
    '</label><input type="text" id="q-en" name="emergency_name" value="' +
    esc(v.emergency_name) +
    '" /></div>' +
    '<div class="portal-field"><label for="q-ep">' +
    esc(t('qEmergencyPhone')) +
    '</label><input type="tel" id="q-ep" name="emergency_phone" value="' +
    esc(v.emergency_phone) +
    '" /></div>' +
    '<label class="portal-check"><input type="checkbox" name="confirm_accurate" value="1"' +
    (v.confirm_accurate ? ' checked' : '') +
    ' required /><span>' +
    esc(t('qConfirm')) +
    '</span></label>' +
    '<div class="portal-actions">' +
    '<button type="button" class="portal-btn portal-btn--ghost" data-step="2">' +
    esc(t('back')) +
    '</button>' +
    '<button type="submit" class="portal-btn portal-btn--primary">' +
    esc(t('saveQuestionnaire')) +
    '</button>' +
    '<button type="button" class="portal-btn portal-btn--ghost" data-print>' +
    esc(t('exportPdf')) +
    '</button>' +
    '</div>' +
    '</form>' +
    '<p class="portal-muted">' +
    esc(t('exportNote')) +
    '</p>' +
    (primaryCase
      ? '<p class="portal-muted" style="margin-top:0.75rem"><strong>Case ID:</strong> ' +
        esc(primaryCase.id) +
        '</p>'
      : '') +
    '<div class="portal-divider"></div>' +
    '<div class="portal-actions">' +
    '<button type="button" class="portal-btn portal-btn--primary" data-step="4">' +
    esc(t('next')) +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div></div>'
  );
}

function renderClinicDashboard() {
  var rows =
    state.cases.length === 0
      ? '<tr><td colspan="4">' + esc(t('noCases')) + '</td></tr>'
      : state.cases
          .map(function (c) {
            var pr = c.profiles || {};
            return (
              '<tr><td>' +
              esc(pr.email || '—') +
              '<br /><span class="portal-muted">' +
              esc(pr.full_name || '') +
              '</span></td><td>' +
              esc(c.treatment_plan_id || '—') +
              '</td><td>' +
              esc(c.status) +
              '</td><td>' +
              esc(c.assigned_at ? String(c.assigned_at).slice(0, 10) : '—') +
              '</td></tr>'
            );
          })
          .join('');
  return (
    '<div class="portal-card">' +
    '<div class="portal-card__accent"></div>' +
    '<div class="portal-card__inner">' +
    '<div class="portal-eyebrow">Clinic Dashboard</div>' +
    '<h1>' +
    esc(t('clinicDashTitle')) +
    '</h1>' +
    '<p class="portal-lead">' +
    esc(t('clinicDashLead')) +
    '</p>' +
    (state.message
      ? '<div class="portal-msg ' +
        (state.messageOk ? 'portal-msg--ok' : 'portal-msg--err') +
        '">' +
        esc(state.message) +
        '</div>'
      : '') +
    '<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>' +
    esc(t('casesPatient')) +
    '</th><th>' +
    esc(t('casesPlan')) +
    '</th><th>' +
    esc(t('casesStatus')) +
    '</th><th>' +
    esc(t('casesDate')) +
    '</th></tr></thead><tbody>' +
    rows +
    '</tbody></table></div>' +
    '</div></div>'
  );
}

function renderMainInner() {
  if (state.loading) {
    return '<div class="portal-card"><div class="portal-card__accent"></div><div class="portal-card__inner"><p class="portal-muted" style="margin:0;text-align:center">…</p></div></div>';
  }
  if (!state.user) return renderAuthCard();
  if (state.profile && state.profile.role === 'clinic_staff') return renderClinicDashboard();
  if (state.step === 3) return renderDocsCard();
  if (state.step === 4) return renderClinicCard();
  return renderIntakeCard();
}

function renderShell() {
  var root = document.getElementById('portal-root');
  var missing = document.getElementById('portal-config-missing');
  var logoutWrap = document.getElementById('portal-logout-wrap');
  if (!root) return;

  if (!isConfigured()) {
    if (missing) {
      missing.hidden = false;
      missing.textContent = t('configMissing');
    }
    root.innerHTML = '';
    if (logoutWrap) logoutWrap.innerHTML = '';
    return;
  }
  if (missing) {
    missing.hidden = true;
    missing.textContent = '';
  }

  root.innerHTML = '<div class="portal-main">' + renderMainInner() + '</div>';

  if (logoutWrap) {
    logoutWrap.innerHTML =
      state.user && getSupabase()
        ? '<button type="button" class="nav-cta-secondary" style="margin-right:0.35rem" data-logout>' +
          esc(t('navLogout')) +
          '</button>'
        : '';
  }

  bindMainHandlers();
}

function validateFile(file) {
  if (!file || file.size > MAX_BYTES) return false;
  var okMime =
    file.type === 'application/pdf' ||
    file.type.indexOf('image/') === 0 ||
    file.type === 'application/dicom' ||
    file.type === 'application/octet-stream';
  var n = file.name.toLowerCase();
  var okExt = /\.(pdf|jpe?g|png|webp|gif|dcm)$/.test(n);
  return okMime || okExt;
}

async function submitPortalAuthForm(form) {
  var supabase = getSupabase();
  if (!supabase) {
    state.message = t('configMissing');
    state.messageOk = false;
    renderShell();
    return;
  }
  var fd = new FormData(form);
  var email = String(fd.get('email') || '').trim();
  var password = String(fd.get('password') || '');
  state.message = '';
  try {
    if (state.authTab === 'login') {
      var res = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (res.error) throw res.error;
      await refreshSession(res.data && res.data.session ? res.data.session : null);
    } else {
      var full = String(fd.get('full_name') || '').trim();
      var resUp = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: full, name: full } },
      });
      if (resUp.error) throw resUp.error;
      if (!resUp.data.session) {
        state.authPendingEmail = email;
        state.message = '';
        state.messageOk = false;
        renderShell();
        return;
      }
      await refreshSession(resUp.data && resUp.data.session ? resUp.data.session : null);
      state.message = t('signUpWelcome');
      state.messageOk = true;
      renderShell();
      return;
    }
  } catch (e) {
    var raw = e && e.message ? String(e.message) : '';
    var errCode = e && e.code ? String(e.code) : '';
    var msg = raw || t('errorGeneric');
    if (
      state.authTab === 'login' &&
      (errCode === 'email_not_confirmed' ||
        /email not confirmed|not confirmed|Email address not confirmed|nicht bestätigt|nicht verifiziert|unconfirmed/i.test(
          raw
        ))
    ) {
      msg = t('errorEmailNotConfirmed');
    }
    state.message = msg;
    state.messageOk = false;
    renderShell();
  }
}

function onPortalRootSubmit(ev) {
  var form = ev.target && ev.target.closest ? ev.target.closest('form.portal-auth-form') : null;
  if (!form) return;
  ev.preventDefault();
  void submitPortalAuthForm(form);
}

function bindMainHandlers() {
  document.querySelectorAll('[data-auth-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.authTab = btn.getAttribute('data-auth-tab');
      state.message = '';
      state.authPendingEmail = null;
      renderShell();
    });
  });

  document.querySelectorAll('[data-auth-pending-login]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.authPendingEmail = null;
      state.authTab = 'login';
      state.message = '';
      renderShell();
    });
  });

  var lo = document.querySelector('[data-logout]');
  if (lo) {
    lo.addEventListener('click', async function () {
      var supabase = getSupabase();
      if (supabase) await supabase.auth.signOut();
      state.user = null;
      state.authPendingEmail = null;
      try {
        sessionStorage.removeItem(STEP_KEY);
      } catch (_) {}
      await refreshSession();
    });
  }

  document.querySelectorAll('[data-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.step = parseInt(btn.getAttribute('data-step'), 10);
      persistStep(state.step);
      state.message = '';
      renderShell();
    });
  });

  var formIntake = document.getElementById('form-intake');
  if (formIntake) {
    formIntake.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var supabase = getSupabase();
      if (!supabase || !state.user) return;
      var fd = new FormData(formIntake);
      var row = {
        user_id: state.user.id,
        treatment_type: String(fd.get('treatment_type') || ''),
        country: String(fd.get('country') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        preferred_language: String(fd.get('preferred_language') || 'de'),
        referral_source: String(fd.get('referral_source') || '').trim(),
        consent_terms: fd.get('consent_terms') === '1',
        consent_privacy: fd.get('consent_privacy') === '1',
        consent_health_data: fd.get('consent_health_data') === '1',
        updated_at: new Date().toISOString(),
      };
      try {
        var upProf = await supabase
          .from('profiles')
          .update({
            phone: row.phone,
            country: row.country,
            preferred_language: row.preferred_language,
            updated_at: row.updated_at,
          })
          .eq('id', state.user.id);
        if (upProf.error) throw upProf.error;

        var res = await supabase.from('patient_intake').upsert(row, { onConflict: 'user_id' });
        if (res.error) throw res.error;
        state.intake = row;
        if (state.profile) {
          state.profile.phone = row.phone;
          state.profile.country = row.country;
          state.profile.preferred_language = row.preferred_language;
        }
        state.message = '';
        state.step = 3;
        persistStep(3);
        renderShell();

      } catch (e) {
        console.error(e);
        state.message = e.message || t('errorGeneric');
        state.messageOk = false;
        renderShell();
      }
    });
  }

  var upBtn = document.querySelector('[data-upload]');
  var fileInput = document.getElementById('file-up');
  if (upBtn && fileInput) {
    upBtn.addEventListener('click', async function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) {
        state.message = t('errorGeneric');
        state.messageOk = false;
        renderShell();
        return;
      }
      if (!validateFile(file)) {
        state.message = t('uploadHint');
        state.messageOk = false;
        renderShell();
        return;
      }
      var supabase = getSupabase();
      if (!supabase || !state.user) return;
      var safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      var path = state.user.id + '/' + crypto.randomUUID() + '_' + safe;
      try {
        var up = await supabase.storage.from('case-files').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (up.error) throw up.error;
        var primaryCase = state.cases && state.cases[0];
        var ins = await supabase.from('case_files').insert({
          user_id: state.user.id,
          case_id: primaryCase ? primaryCase.id : null,
          storage_path: path,
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
        });
        if (ins.error) throw ins.error;
        state.files.unshift({
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
          storage_path: path,
          created_at: new Date().toISOString(),
        });
        fileInput.value = '';
        state.message = '';
        state.messageOk = true;
        renderShell();
      } catch (e) {
        console.error(e);
        state.message = e.message || t('errorGeneric');
        state.messageOk = false;
        renderShell();
      }
    });
  }

  var formQ = document.getElementById('form-q');
  if (formQ) {
    formQ.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var supabase = getSupabase();
      if (!supabase || !state.user) return;
      var fd = new FormData(formQ);
      var responses = {
        reason: String(fd.get('reason') || '').trim(),
        allergies: String(fd.get('allergies') || '').trim(),
        medications: String(fd.get('medications') || '').trim(),
        conditions: String(fd.get('conditions') || '').trim(),
        emergency_name: String(fd.get('emergency_name') || '').trim(),
        emergency_phone: String(fd.get('emergency_phone') || '').trim(),
        confirm_accurate: fd.get('confirm_accurate') === '1',
      };
      var primaryCase = state.cases && state.cases[0];
      try {
        var res = await supabase.from('questionnaire_responses').upsert(
          {
            user_id: state.user.id,
            case_id: primaryCase ? primaryCase.id : null,
            questionnaire_slug: Q_SLUG,
            responses: responses,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,questionnaire_slug' }
        );
        if (res.error) throw res.error;
        state.questionnaire = {
          user_id: state.user.id,
          questionnaire_slug: Q_SLUG,
          responses: responses,
          updated_at: new Date().toISOString(),
        };
        state.message = t('saveQuestionnaire') ? '' : '';
        state.messageOk = true;
        renderShell();
      } catch (e) {
        console.error(e);
        state.message = e.message || t('errorGeneric');
        state.messageOk = false;
        renderShell();
      }
    });
  }

  var printBtn = document.querySelector('[data-print]');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      var zone = document.getElementById('print-zone');
      if (!zone) return;
      var w = window.open('', '_blank');
      if (!w) return;
      w.document.write(
        '<!DOCTYPE html><html><head><title>Questionnaire</title><style>body{font-family:system-ui,sans-serif;padding:1.5rem;max-width:640px}</style></head><body>' +
          zone.innerHTML +
          '</body></html>'
      );
      w.document.close();
      w.focus();
      w.print();
    });
  }
}

function bindLangSwitcher() {
  document.querySelectorAll('.lang-switcher [data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      setLang(lang === 'en' ? 'en' : 'de');
      applySiteLang();
      renderShell();
    });
  });
}

getSupabase();
syncLangFromSite();

document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('portal-root');
  if (root && !root.dataset.portalAuthDelegated) {
    root.dataset.portalAuthDelegated = '1';
    root.addEventListener('submit', onPortalRootSubmit);
  }
  bindLangSwitcher();
  if (!isConfigured()) {
    renderShell();
    return;
  }
  refreshSession();
});
