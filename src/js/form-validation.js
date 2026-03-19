/* ═══════════════════════════════════════
   Womondo Pegasus — Form Validation
   Phase 2C — Ported from pegasus.html
   ═══════════════════════════════════════ */

// ── EU Countries ──
const EU_COUNTRIES = [
  'Austria','Belgium','Bulgaria','Croatia','Cyprus','Czech Republic',
  'Denmark','Estonia','Finland','France','Germany','Greece','Hungary',
  'Ireland','Italy','Latvia','Lithuania','Luxembourg','Malta',
  'Netherlands','Poland','Portugal','Romania','Slovakia','Slovenia',
  'Spain','Sweden'
];

// ── Dial codes (E.164) ──
const DIAL = {
  'AUSTRIA':'+43','BELGIUM':'+32','BULGARIA':'+359','CROATIA':'+385',
  'CYPRUS':'+357','CZECH REPUBLIC':'+420','DENMARK':'+45','ESTONIA':'+372',
  'FINLAND':'+358','FRANCE':'+33','GERMANY':'+49','GREECE':'+30',
  'HUNGARY':'+36','IRELAND':'+353','ITALY':'+39','LATVIA':'+371',
  'LITHUANIA':'+370','LUXEMBOURG':'+352','MALTA':'+356','NETHERLANDS':'+31',
  'POLAND':'+48','PORTUGAL':'+351','ROMANIA':'+40','SLOVAKIA':'+421',
  'SLOVENIA':'+386','SPAIN':'+34','SWEDEN':'+46'
};

// ── Postal code patterns by country ──
const POSTAL_PATTERNS = {
  'Germany': /^\d{5}$/,
  'Austria': /^\d{4}$/,
  'Switzerland': /^\d{4}$/,
  'Netherlands': /^\d{4}\s?[A-Z]{2}$/i,
  'Belgium': /^\d{4}$/,
  'France': /^\d{5}$/,
  'Italy': /^\d{5}$/,
  'Spain': /^\d{5}$/,
  'Portugal': /^\d{4}-?\d{3}$/,
  'Poland': /^\d{2}-?\d{3}$/,
  'Czech Republic': /^\d{3}\s?\d{2}$/,
  'Denmark': /^\d{4}$/,
  'Sweden': /^\d{3}\s?\d{2}$/,
  'Norway': /^\d{4}$/,
  'Finland': /^\d{5}$/,
  'Slovenia': /^\d{4}$/,
  'Slovakia': /^\d{3}\s?\d{2}$/,
  'Hungary': /^\d{4}$/,
  'Croatia': /^\d{5}$/,
  'Romania': /^\d{6}$/,
  'Bulgaria': /^\d{4}$/,
  'Greece': /^\d{3}\s?\d{2}$/,
  'Ireland': /^[A-Z]\d[\dW]\s?[A-Z\d]{4}$/i,
  'Lithuania': /^LT-?\d{5}$/i,
  'Latvia': /^LV-?\d{4}$/i,
  'Estonia': /^\d{5}$/,
  'Cyprus': /^\d{4}$/,
  'Luxembourg': /^\d{4}$/,
  'Malta': /^[A-Z]{3}\s?\d{4}$/i
};

// ── Helpers ──
const up = s => (s || '').trim().toUpperCase();
const MIN_DIG = 8;
const MAX_DIG = 15;

function isValidPostal(country, code) {
  if (!country || !code) return false;
  const pattern = POSTAL_PATTERNS[country.trim()];
  if (!pattern) return code.trim().length >= 3;
  return pattern.test(code.trim());
}

// ══════════════════════════════════════
//  1. EU Country Dropdown
// ══════════════════════════════════════
function insertEuCountryDropdown(form) {
  const containers = form.querySelectorAll('.field-country');
  containers.forEach(container => {
    const input = container.matches('input, textarea')
      ? container
      : container.querySelector('input[type="text"], input:not([type]), textarea');
    if (!input || container.dataset.euDropdown) return;
    container.dataset.euDropdown = '1';

    const sel = document.createElement('select');
    sel.dataset.euCountry = '1';
    sel.id = input.id ? input.id + '-select' : '';
    sel.setAttribute('aria-label', 'Country (EU only)');
    sel.required = input.required;

    // Copy classes for styling, swap w-input for w-select
    sel.className = (input.className || '').replace(/\bw-input\b/g, '');

    const ph = document.createElement('option');
    ph.value = '';
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = 'Select your country';
    sel.appendChild(ph);

    EU_COUNTRIES.forEach(name => {
      const o = document.createElement('option');
      o.value = name;
      o.textContent = name;
      sel.appendChild(o);
    });

    // Insert before hidden input
    input.insertAdjacentElement('beforebegin', sel);

    // Hide the original input (still submits)
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    input.style.opacity = '0';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;

    // Preselect if value already set
    if (input.value && EU_COUNTRIES.includes(input.value.trim())) {
      sel.value = input.value.trim();
    }

    // Sync select -> hidden input
    function syncToInput() {
      input.value = sel.value || '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sel.addEventListener('change', syncToInput);
    if (sel.value && sel.value !== '') syncToInput();
  });
}

// ══════════════════════════════════════
//  2. Phone Validation
// ══════════════════════════════════════
function currentDial(phoneInput) {
  const form = phoneInput.closest('form');
  const sel = form ? form.querySelector('select[data-eu-country]') : null;
  if (sel && sel.value && DIAL[up(sel.value)]) return DIAL[up(sel.value)];
  return null;
}

function swapPrefix(input, dial) {
  if (!dial) return;
  const rest = (input.value || '').replace(/^\+\d+(?:\s)?/, '');
  const next = dial + (rest ? ' ' + rest.replace(/^\s+/, '') : ' ');
  if (input.value !== next) {
    input.value = next;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function strongSanitize(input) {
  let raw = String(input.value || '').replace(/[^+\d]/g, '');
  let dial = currentDial(input);
  if (!dial) {
    const m = raw.match(/^\+\d{1,4}/);
    dial = m ? m[0] : '+';
  }

  let userPart;
  if (raw.startsWith(dial)) {
    userPart = raw.slice(dial.length);
  } else {
    userPart = raw.replace(/^\+\d{1,4}/, '');
  }
  userPart = userPart.replace(/\D/g, '');
  input.value = dial + (userPart ? ' ' + userPart : ' ');
}

function digitsCount(v) { return (v || '').replace(/\D/g, '').length; }

function phoneValid(v) {
  if (!/^\+\d/.test(v || '')) return false;
  const d = digitsCount(v);
  return d >= MIN_DIG && d <= MAX_DIG;
}

function ensurePhoneMsg(input) {
  let msg = input.parentElement.querySelector('.field-phone-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'field-phone-msg';
    input.insertAdjacentElement('afterend', msg);
  }
  return msg;
}

function showPhoneError(input, text) {
  const msg = ensurePhoneMsg(input);
  input.classList.add('is-invalid');
  input.setCustomValidity(text);
  msg.textContent = text;
  msg.style.display = 'block';
}

function clearPhoneError(input) {
  const msg = ensurePhoneMsg(input);
  input.classList.remove('is-invalid');
  input.setCustomValidity('');
  msg.textContent = '';
  msg.style.display = 'none';
}

function validatePhone(input, show = false) {
  strongSanitize(input);
  const ok = phoneValid(input.value);
  if (!ok) {
    if (show) showPhoneError(input, 'Please enter a valid phone number (e.g., +386 40123456).');
  } else {
    clearPhoneError(input);
  }
  return ok;
}

function initPhones(form) {
  const phones = form.querySelectorAll('.field-phone input[type="tel"], .field-phone input:not([type])');
  phones.forEach(inp => {
    if (inp.dataset._phoneInit) return;
    inp.dataset._phoneInit = '1';

    try { if (inp.type !== 'tel') inp.type = 'tel'; } catch (_) { /* */ }
    inp.setAttribute('inputmode', 'tel');

    // Prevent illegal keys
    inp.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'].includes(k)) return;
      if (k === ' ') { e.preventDefault(); return; }
      if (k === '+') {
        const hasPlus = (inp.value || '').includes('+');
        if (hasPlus || inp.selectionStart !== 0) e.preventDefault();
        return;
      }
      if (/\d/.test(k)) return;
      e.preventDefault();
    });

    inp.addEventListener('input', () => validatePhone(inp, false));
    inp.addEventListener('blur', () => validatePhone(inp, true));

    inp.addEventListener('focus', () => {
      if (!/^\+\d/.test(inp.value || '')) {
        const dial = currentDial(inp);
        if (dial) swapPrefix(inp, dial);
        strongSanitize(inp);
      }
    });

    // Set initial prefix
    const dial = currentDial(inp);
    if (dial) swapPrefix(inp, dial);
    strongSanitize(inp);

    // Block form submit if invalid
    form.addEventListener('submit', e => {
      if (inp.offsetParent === null) return;
      if (!validatePhone(inp, true)) {
        e.preventDefault();
        inp.focus({ preventScroll: false });
      }
    });
  });
}

function updatePhonePrefixes(form) {
  const phones = form.querySelectorAll('.field-phone input[type="tel"], .field-phone input:not([type])');
  phones.forEach(inp => {
    const dial = currentDial(inp);
    if (!dial) return;
    swapPrefix(inp, dial);
    strongSanitize(inp);
  });
}

// ══════════════════════════════════════
//  3. Email Validation
// ══════════════════════════════════════
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function initEmailValidation(form) {
  const containers = form.querySelectorAll('.field-email');
  containers.forEach(container => {
    const input = container.matches('input, textarea')
      ? container
      : container.querySelector('input[type="email"], input[type="text"], input:not([type]), textarea');
    if (!input || input.dataset._emailInit) return;
    input.dataset._emailInit = '1';

    if (input.tagName.toLowerCase() === 'input' && input.type !== 'email') {
      try { input.type = 'email'; } catch (_) { /* */ }
    }
    input.setAttribute('inputmode', 'email');
    input.autocomplete = input.autocomplete || 'email';

    let msg = container.querySelector('.field-email-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'field-email-msg';
      input.insertAdjacentElement('afterend', msg);
    }

    function isValid(v) {
      v = (v || '').trim();
      if (!EMAIL_REGEX.test(v)) return false;
      if (v.includes('..')) return false;
      const domain = v.split('@')[1];
      if (!domain) return false;
      const bad = domain.split('.').some(lbl => !lbl || lbl.startsWith('-') || lbl.endsWith('-'));
      return !bad;
    }

    function showErr(t) {
      input.classList.add('is-invalid');
      input.setCustomValidity(t);
      msg.textContent = t;
      msg.style.display = 'block';
    }
    function clearErr() {
      input.classList.remove('is-invalid');
      input.setCustomValidity('');
      msg.textContent = '';
      msg.style.display = 'none';
    }

    function validate(show = false) {
      const ok = isValid(input.value);
      if (!ok) { if (show) showErr('Please enter a valid email address (e.g., name@example.com).'); }
      else { clearErr(); }
      return ok;
    }

    input.addEventListener('input', () => validate(false));
    input.addEventListener('blur', () => validate(true));

    form.addEventListener('submit', e => {
      if (container.offsetParent === null) return;
      if (!validate(true)) {
        e.preventDefault();
        input.focus({ preventScroll: false });
      }
    });
  });
}

// ══════════════════════════════════════
//  4. Postal Code Validation
// ══════════════════════════════════════
function initPostalValidation(form) {
  const zipField = form.querySelector('#zip');
  const countrySelect = form.querySelector('select[data-eu-country]');
  if (!zipField || !countrySelect) return;

  let msg = zipField.parentElement.querySelector('.field-error-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'field-error-msg';
    zipField.insertAdjacentElement('afterend', msg);
  }

  function validate(show = false) {
    const country = countrySelect.value;
    const code = zipField.value.trim();
    if (!code) { clearErr(); return true; } // optional field
    const ok = isValidPostal(country, code);
    if (!ok && show) {
      showErr('Please enter a valid postal code for ' + (country || 'your country') + '.');
    } else if (ok) {
      clearErr();
    }
    return ok;
  }

  function showErr(t) {
    zipField.classList.add('is-invalid');
    msg.textContent = t;
    msg.style.display = 'block';
  }
  function clearErr() {
    zipField.classList.remove('is-invalid');
    msg.textContent = '';
    msg.style.display = 'none';
  }

  zipField.addEventListener('blur', () => validate(true));
  zipField.addEventListener('input', () => validate(false));
  countrySelect.addEventListener('change', () => {
    if (zipField.value.trim()) validate(true);
  });
}

// ══════════════════════════════════════
//  5. Dealer Auto-Assignment
// ══════════════════════════════════════
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.asin(Math.sqrt(a));
}

function geocode(country, postal) {
  const url = 'https://nominatim.openstreetmap.org/search?q=' +
    encodeURIComponent(postal + ' ' + country) +
    '&format=json&limit=1';
  return fetch(url, { headers: { 'Accept': 'application/json' } })
    .then(r => r.json())
    .then(data => {
      if (!data || !data.length) throw new Error('no geocode');
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    });
}

function loadDealersFromDom() {
  return Array.from(document.querySelectorAll('.dealer-record'))
    .map(el => ({
      name: (el.getAttribute('data-dealer-name') || '').trim(),
      country: (el.getAttribute('data-dealer-country') || '').trim(),
      lat: parseFloat(el.getAttribute('data-dealer-lat')),
      lng: parseFloat(el.getAttribute('data-dealer-lng')),
      city: (el.getAttribute('data-dealer-city') || '').trim()
    }))
    .filter(d => d.name && !isNaN(d.lat) && !isNaN(d.lng));
}

function initDealerAutoAssign(form) {
  const countrySelect = form.querySelector('select[data-eu-country]');
  const zipField = form.querySelector('#zip');
  const assignedField = form.querySelector('#assigned_dealer');
  if (!countrySelect || !zipField || !assignedField) return;

  const dealers = loadDealersFromDom();
  if (!dealers.length) {
    console.warn('[Pegasus] Dealer auto-assign: no dealers in DOM — will skip');
    return;
  }

  let debounceTimer = null;

  function triggerAssign() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(assignDealer, 600);
  }

  function assignDealer() {
    const country = countrySelect.value.trim();
    const postal = zipField.value.trim();
    if (!country || !postal || !isValidPostal(country, postal)) {
      assignedField.value = '';
      return;
    }

    assignedField.value = 'Finding nearest dealer...';
    geocode(country, postal)
      .then(pos => {
        const normCountry = country.toLowerCase();
        let pool = dealers.filter(d => d.country.toLowerCase() === normCountry);
        if (!pool.length) pool = dealers;

        let best = null;
        let bestDist = Infinity;
        pool.forEach(d => {
          const dKm = distanceKm(pos.lat, pos.lng, d.lat, d.lng);
          if (dKm < bestDist) {
            bestDist = dKm;
            best = { dealer: d, dist: dKm };
          }
        });

        if (best) {
          assignedField.value =
            best.dealer.name +
            (best.dealer.city ? ' \u2014 ' + best.dealer.city : '') +
            ' \u2014 ' + Math.round(best.dist) + ' km';
        } else {
          assignedField.value = '';
        }
      })
      .catch(() => {
        assignedField.value = '';
      });
  }

  countrySelect.addEventListener('change', triggerAssign);
  countrySelect.addEventListener('input', triggerAssign);
  zipField.addEventListener('change', triggerAssign);
  zipField.addEventListener('input', triggerAssign);

  if (countrySelect.value && zipField.value) triggerAssign();
}

// ══════════════════════════════════════
//  6. Configuration Text Auto-Fill
// ══════════════════════════════════════
function initConfigAutoFill(form) {
  const textarea = form.querySelector('#customes_configuration_and_price');
  if (!textarea) return;

  function updateText(configText) {
    textarea.value = configText || '';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
  }

  // Listen for configurator changes
  document.addEventListener('configurator:change', e => {
    updateText(e.detail);
  });

  // Also update on form focus
  form.addEventListener('focusin', () => {
    // Re-fire to get latest config text
    const evt = new CustomEvent('configurator:requestText');
    document.dispatchEvent(evt);
  });
}

// ══════════════════════════════════════
//  7. Hidden Field Auto-Population
// ══════════════════════════════════════
function initHiddenFields(form) {
  // Contact origin
  const origin = form.querySelector('#contact_origin');
  if (origin) origin.value = 'WOMONDO CONFIGURATOR (rok)';

  // Page metadata
  const pageUri = form.querySelector('input[name="pageUri"]');
  const pageName = form.querySelector('input[name="pageName"]');
  if (pageUri) pageUri.value = window.location.href;
  if (pageName) pageName.value = document.title;

  // HubSpot tracking cookie
  const hutk = form.querySelector('input[name="hutk"]');
  if (hutk) {
    const match = document.cookie.match(/hubspotutk=([^;]+)/);
    if (match) hutk.value = match[1];
  }
}

// ══════════════════════════════════════
//  8. Form Submit Guard
// ══════════════════════════════════════
function initSubmitGuard(form) {
  form.addEventListener('submit', e => {
    const textarea = form.querySelector('#customes_configuration_and_price');
    if (textarea && (!textarea.value || textarea.value.includes('No configuration selected'))) {
      e.preventDefault();
      alert('Please select a model configuration before submitting.');
      const configSection = document.getElementById('configurator');
      if (configSection) configSection.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
  });
}

// ══════════════════════════════════════
//  Main Init
// ══════════════════════════════════════
export function initFormValidation() {
  const form = document.getElementById('pegasus-form');
  if (!form) return;

  // 1. EU Country dropdown
  insertEuCountryDropdown(form);

  // 2. Phone validation (must come after country dropdown)
  initPhones(form);

  // 3. Email validation
  initEmailValidation(form);

  // 4. Postal code validation
  initPostalValidation(form);

  // 5. Dealer auto-assignment
  initDealerAutoAssign(form);

  // 6. Config textarea auto-fill
  initConfigAutoFill(form);

  // 7. Hidden fields
  initHiddenFields(form);

  // 8. Submit guard
  initSubmitGuard(form);

  // Wire up country change -> phone prefix update
  document.addEventListener('change', e => {
    if (e.target && e.target.matches('select[data-eu-country]')) {
      updatePhonePrefixes(form);
    }
  });

  console.log('[Pegasus] Form validation initialized');
}
