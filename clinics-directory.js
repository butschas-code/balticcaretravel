/**
 * clinics.html — search across clinic names, locations and treatment keywords.
 */
(function () {
  'use strict';

  var input = document.getElementById('clinics-search');
  var cards = document.querySelectorAll('.clinics-apple-card');
  var statusEl = document.getElementById('clinics-search-status');
  var emptyEl = document.getElementById('clinics-empty');

  if (!input || !cards.length) return;

  function t(key) {
    try {
      var lang = window.BHT && window.BHT.i18n && window.BHT.i18n.getLang
        ? window.BHT.i18n.getLang()
        : 'de';
      var g = window.BHT && window.BHT.i18n && window.BHT.i18n.get;
      return g ? g(key, lang) || '' : '';
    } catch (e) {
      return '';
    }
  }

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function updateStatus(visible) {
    if (!statusEl) return;
    var q = normalize(input.value);
    if (!q) {
      statusEl.textContent = t('clinics.searchResultsAll');
      return;
    }
    if (visible === 0) {
      statusEl.textContent = t('clinics.searchEmpty');
      return;
    }
    if (visible === 1) {
      statusEl.textContent = t('clinics.searchResultsOne');
      return;
    }
    statusEl.textContent = (t('clinics.searchResultsMany') || '').replace(/\{n\}/g, String(visible));
  }

  function filter() {
    var q = normalize(input.value);
    var visible = 0;
    cards.forEach(function (card) {
      var hay = normalize(card.getAttribute('data-search') || '');
      var show = !q || hay.indexOf(q) !== -1;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyEl) emptyEl.hidden = visible !== 0;
    updateStatus(visible);
  }

  var debounce;
  input.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(filter, 120);
  });
  input.addEventListener('search', filter);

  filter();
  document.addEventListener('bht-lang-change', filter);
}());

