/**
 * Baltic Health Travel — conversion & UX
 * Static HTML/CSS/vanilla JS only.
 */

(function () {
  'use strict';

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  // --- Scroll-triggered fade-in for sections ---
  var animatedSections = document.querySelectorAll('.section[data-animate]');
  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  animatedSections.forEach(function (section) {
    observer.observe(section);
  });

  // --- Cost savings calculator ---
  var calcTreatment = document.getElementById('calc-treatment');
  var calcCountry = document.getElementById('calc-country');
  var elGermany = document.getElementById('calc-germany');
  var elBaltics = document.getElementById('calc-baltics');
  var elSavings = document.getElementById('calc-savings');

  var calculatorData = {
    'dental-implant': { de: 3000, baltics: 1200 },
    'dental-crown': { de: 1800, baltics: 650 },
    'dental-whitening': { de: 650, baltics: 280 },
    'knee-arthroscopy': { de: 4500, baltics: 2200 },
    'cataract': { de: 2500, baltics: 1100 }
  };

  function formatEuro(n) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  function updateCalculator() {
    if (!calcTreatment || !elGermany || !elBaltics || !elSavings) return;
    var key = calcTreatment.value;
    var data = calculatorData[key];
    if (!data) return;
    var germany = data.de;
    var baltics = data.baltics;
    var savings = Math.max(0, germany - baltics);
    elGermany.textContent = formatEuro(germany);
    elBaltics.textContent = formatEuro(baltics);
    elSavings.textContent = formatEuro(savings);
  }

  if (calcTreatment) {
    calcTreatment.addEventListener('change', updateCalculator);
  }
  if (calcCountry) {
    calcCountry.addEventListener('change', updateCalculator);
  }
  updateCalculator();

  // --- Treatments slider (Behandlungen block) ---
  var treatmentsSlider = document.querySelector('.treatments-slider');
  var treatmentsViewport = document.querySelector('.treatments-slider-viewport');
  var treatmentsTrack = document.querySelector('.treatments-slider-track');
  var treatmentsCards = document.querySelectorAll('.treatments-slider-card');
  var treatmentsPrev = document.querySelector('.treatments-slider-btn-prev');
  var treatmentsNext = document.querySelector('.treatments-slider-btn-next');

  if (treatmentsSlider && treatmentsViewport && treatmentsTrack && treatmentsCards.length) {
    var treatmentsCount = treatmentsCards.length;
    var treatmentsIndex = 0;
    var gap = 40; /* matches var(--space-lg) 2.5rem */

    function treatmentsGetMaxIndex() {
      return window.matchMedia('(max-width: 768px)').matches
        ? Math.max(0, treatmentsCount - 1)
        : Math.max(0, treatmentsCount - 2);
    }

    function treatmentsUpdateTransform() {
      var viewportWidth = treatmentsViewport.clientWidth || treatmentsViewport.offsetWidth;
      var isMobile = window.matchMedia('(max-width: 768px)').matches;
      var cardsVisible = isMobile ? 1 : 2;
      var cardWidth = Math.floor((viewportWidth - (cardsVisible - 1) * gap) / cardsVisible);
      if (cardWidth < 200) cardWidth = viewportWidth;

      /* Set card width so CSS uses it (2 cards or 1 card visible) */
      treatmentsSlider.style.setProperty('--treatments-card-width', cardWidth + 'px');

      var offset = -treatmentsIndex * (cardWidth + gap);
      treatmentsTrack.style.transform = 'translateX(' + offset + 'px)';

      if (treatmentsPrev) {
        treatmentsPrev.disabled = treatmentsIndex <= 0;
      }
      if (treatmentsNext) {
        treatmentsNext.disabled = treatmentsIndex >= treatmentsGetMaxIndex();
      }
    }

    function treatmentsGo(delta) {
      var maxIndex = treatmentsGetMaxIndex();
      treatmentsIndex = Math.max(0, Math.min(maxIndex, treatmentsIndex + delta));
      treatmentsUpdateTransform();
    }

    if (treatmentsPrev) {
      treatmentsPrev.addEventListener('click', function () { treatmentsGo(-1); });
    }
    if (treatmentsNext) {
      treatmentsNext.addEventListener('click', function () { treatmentsGo(1); });
    }

    window.addEventListener('resize', treatmentsUpdateTransform);
    treatmentsUpdateTransform();
    /* Run again after layout/paint so viewport width is correct */
    requestAnimationFrame(function () { treatmentsUpdateTransform(); });
  }

  // --- Clinics slider (Partnerkliniken block) — same behaviour as treatments ---
  var clinicsSlider = document.querySelector('.clinics-slider');
  var clinicsViewport = document.querySelector('.clinics-slider-viewport');
  var clinicsTrack = document.querySelector('.clinics-slider-track');
  var clinicsCards = document.querySelectorAll('.clinics-slider-card');
  var clinicsPrev = document.querySelector('.clinics-slider-btn-prev');
  var clinicsNext = document.querySelector('.clinics-slider-btn-next');

  if (clinicsSlider && clinicsViewport && clinicsTrack && clinicsCards.length) {
    var clinicsCount = clinicsCards.length;
    var clinicsIndex = 0;
    var sliderGap = 40;

    function clinicsGetMaxIndex() {
      return window.matchMedia('(max-width: 768px)').matches
        ? Math.max(0, clinicsCount - 1)
        : Math.max(0, clinicsCount - 2);
    }

    function clinicsUpdateTransform() {
      var viewportWidth = clinicsViewport.clientWidth || clinicsViewport.offsetWidth;
      var isMobile = window.matchMedia('(max-width: 768px)').matches;
      var cardsVisible = isMobile ? 1 : 2;
      var cardWidth = Math.floor((viewportWidth - (cardsVisible - 1) * sliderGap) / cardsVisible);
      if (cardWidth < 200) cardWidth = viewportWidth;

      clinicsSlider.style.setProperty('--clinics-card-width', cardWidth + 'px');

      var offset = -clinicsIndex * (cardWidth + sliderGap);
      clinicsTrack.style.transform = 'translateX(' + offset + 'px)';

      if (clinicsPrev) {
        clinicsPrev.disabled = clinicsIndex <= 0;
      }
      if (clinicsNext) {
        clinicsNext.disabled = clinicsIndex >= clinicsGetMaxIndex();
      }
    }

    function clinicsGo(delta) {
      var maxIndex = clinicsGetMaxIndex();
      clinicsIndex = Math.max(0, Math.min(maxIndex, clinicsIndex + delta));
      clinicsUpdateTransform();
    }

    if (clinicsPrev) {
      clinicsPrev.addEventListener('click', function () { clinicsGo(-1); });
    }
    if (clinicsNext) {
      clinicsNext.addEventListener('click', function () { clinicsGo(1); });
    }

    window.addEventListener('resize', clinicsUpdateTransform);
    clinicsUpdateTransform();
    requestAnimationFrame(function () { clinicsUpdateTransform(); });
  }

  // --- Testimonials slider ---
  var track = document.querySelector('.testimonials-track');
  var cards = track ? track.querySelectorAll('.testimonial-card') : [];
  var btnPrev = document.querySelector('.testimonial-btn-prev');
  var btnNext = document.querySelector('.testimonial-btn-next');
  var dotsContainer = document.getElementById('testimonial-dots');

  if (track && cards.length && dotsContainer) {
    var count = cards.length;
    var current = 0;

    function getScrollPosition(index) {
      return index * track.offsetWidth;
    }

    function goTo(index) {
      current = (index + count) % count;
      var pos = getScrollPosition(current);
      track.scrollTo({ left: pos, behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      dotsContainer.innerHTML = '';
      for (var i = 0; i < count; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonials-dot' + (i === current ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
        dot.addEventListener('click', function (idx) {
          return function () { goTo(idx); };
        }(i));
        dotsContainer.appendChild(dot);
      }
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });

    track.addEventListener('scroll', function () {
      var pos = track.scrollLeft;
      var width = track.offsetWidth || 1;
      var newIndex = Math.round(pos / width);
      if (newIndex !== current && newIndex >= 0 && newIndex < count) {
        current = newIndex;
        updateDots();
      }
    });

    updateDots();
  }

  // --- Consultation form (contact.html) ---
  var form = document.getElementById('consultation-form');
  if (form) {
    var MAX_FILE_BYTES = 15 * 1024 * 1024;
    var LIMITS = { firstName: 60, lastName: 60, email: 254, phone: 30, message: 2000 };
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function tr(key, deFallback) {
      if (window.BHT && window.BHT.i18n) {
        var v = window.BHT.i18n.get(key, window.BHT.i18n.getLang());
        if (v) return v;
      }
      return deFallback;
    }

    function showError(field, msg) {
      var wrap =
        field.closest('.form-row-split__item') ||
        field.closest('.form-row') ||
        field.parentNode;
      var existing = wrap.querySelector('.form-error');
      if (existing) existing.remove();
      field.setAttribute('aria-invalid', 'true');
      var err = document.createElement('p');
      err.className = 'form-error';
      err.setAttribute('role', 'alert');
      err.textContent = msg;
      wrap.appendChild(err);
    }

    function clearError(field) {
      var wrap =
        field.closest('.form-row-split__item') ||
        field.closest('.form-row') ||
        field.parentNode;
      var existing = wrap.querySelector('.form-error');
      if (existing) existing.remove();
      field.removeAttribute('aria-invalid');
    }

    function validateForm() {
      var valid = true;
      var firstEl = form.querySelector('[name="firstName"]');
      var lastEl = form.querySelector('[name="lastName"]');
      var emailEl = form.querySelector('[name="email"]');
      var phoneEl = form.querySelector('[name="phone"]');
      var treatmentEl = form.querySelector('[name="treatment"]');
      var msgEl = form.querySelector('[name="message"]');
      var privacyEl = form.querySelector('[name="privacy"]');
      var fileEl = form.querySelector('[name="attachment"]');

      if (firstEl) {
        if (!firstEl.value.trim()) {
          showError(firstEl, tr('contact.formErrFirstName', 'Bitte geben Sie Ihren Vornamen ein.'));
          valid = false;
        } else if (firstEl.value.length > LIMITS.firstName) {
          showError(firstEl, tr('contact.formErrFirstName', 'Bitte geben Sie Ihren Vornamen ein.'));
          valid = false;
        } else clearError(firstEl);
      }

      if (lastEl) {
        if (!lastEl.value.trim()) {
          showError(lastEl, tr('contact.formErrLastName', 'Bitte geben Sie Ihren Nachnamen ein.'));
          valid = false;
        } else if (lastEl.value.length > LIMITS.lastName) {
          showError(lastEl, tr('contact.formErrLastName', 'Bitte geben Sie Ihren Nachnamen ein.'));
          valid = false;
        } else clearError(lastEl);
      }

      if (emailEl) {
        if (!emailEl.value.trim()) {
          showError(emailEl, tr('contact.formErrEmail', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'));
          valid = false;
        } else if (!EMAIL_RE.test(emailEl.value.trim())) {
          showError(emailEl, tr('contact.formErrEmail', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'));
          valid = false;
        } else if (emailEl.value.length > LIMITS.email) {
          showError(emailEl, tr('contact.formErrEmail', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'));
          valid = false;
        } else clearError(emailEl);
      }

      if (phoneEl) {
        if (phoneEl.value.trim()) {
          var phoneClean = phoneEl.value.replace(/[\s\-().+]/g, '');
          if (!/^\d{5,20}$/.test(phoneClean) || phoneEl.value.length > LIMITS.phone) {
            showError(phoneEl, tr('contact.formErrPhone', 'Bitte geben Sie eine gültige Telefonnummer ein.'));
            valid = false;
          } else clearError(phoneEl);
        } else clearError(phoneEl);
      }

      if (treatmentEl) {
        if (!treatmentEl.value.trim()) {
          showError(treatmentEl, tr('contact.formErrTreatment', 'Bitte wählen Sie einen Behandlungsbereich.'));
          valid = false;
        } else clearError(treatmentEl);
      }

      if (msgEl) {
        if (!msgEl.value.trim()) {
          showError(msgEl, tr('contact.formErrMessage', 'Bitte beschreiben Sie kurz Ihr Anliegen.'));
          valid = false;
        } else if (msgEl.value.length > LIMITS.message) {
          showError(msgEl, tr('contact.formErrMessage', 'Bitte beschreiben Sie kurz Ihr Anliegen.'));
          valid = false;
        } else clearError(msgEl);
      }

      if (privacyEl) {
        if (!privacyEl.checked) {
          showError(privacyEl, tr('contact.formErrPrivacy', 'Bitte bestätigen Sie die Datenschutzhinweise.'));
          valid = false;
        } else clearError(privacyEl);
      }

      if (fileEl && fileEl.files && fileEl.files[0]) {
        if (fileEl.files[0].size > MAX_FILE_BYTES) {
          showError(fileEl, tr('contact.formErrFileSize', 'Die Datei ist zu groß (max. 15 MB).'));
          valid = false;
        } else clearError(fileEl);
      } else if (fileEl) {
        clearError(fileEl);
      }

      return valid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      var actions = form.querySelector('.form-actions');
      var prev = form.querySelector('.form-success');
      if (prev) prev.remove();

      var msg = document.createElement('p');
      msg.className = 'form-success';
      msg.setAttribute('role', 'status');
      msg.textContent = tr('contact.formSuccess', 'Vielen Dank. Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.');
      if (actions && actions.parentNode) {
        actions.parentNode.insertBefore(msg, actions);
      }
      form.reset();
    });

    form.querySelectorAll('.form-input, .form-textarea, .form-select, .form-checkbox, .form-file-input').forEach(function (field) {
      var ev = field.type === 'checkbox' || field.type === 'file' ? 'change' : 'input';
      field.addEventListener(ev, function () { clearError(field); });
    });
  }

  // --- Language switcher (shared across all pages) ---
  document.querySelectorAll('.lang-switcher [data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (window.BHT && window.BHT.i18n) window.BHT.i18n.setLang(lang);
    });
  });

  // --- Animated stat counters (index.html stats-bar) ---
  (function () {
    var statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    var counters = statsBar.querySelectorAll('.stat-number[data-count]');
    var started = false;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function animateCounters() {
      if (started) return;
      started = true;
      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var isDecimal = el.getAttribute('data-decimal') === 'true';
        var duration = 1800;
        var startTime = performance.now();
        function step(now) {
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var value = Math.round(easeOutQuart(progress) * target);
          el.textContent = isDecimal
            ? (value / 10).toFixed(1).replace('.', ',')
            : value;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) animateCounters(); });
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  }());

  // --- Nav dropdown (keyboard + touch support) ---
  (function () {
    var items = document.querySelectorAll('.nav-dropdown-item');
    items.forEach(function (item) {
      var trigger = item.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (o) {
          o.classList.remove('is-open');
          var t = o.querySelector('.nav-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
    document.addEventListener('click', function (ev) {
      if (ev.target.closest && ev.target.closest('.nav-dropdown a')) return;
      items.forEach(function (o) {
        o.classList.remove('is-open');
        var t = o.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  }());

  // --- Clinics treatment filter (clinics.html) ---
  (function () {
    var filter = document.getElementById('filter-treatment');
    var links = document.querySelectorAll('.clinic-card-link');
    if (!filter || !links.length) return;
    filter.addEventListener('change', function () {
      var value = this.value.trim();
      links.forEach(function (link) {
        var treatments = (link.getAttribute('data-treatment') || '').split(/\s+/);
        var show = !value || treatments.indexOf(value) !== -1;
        link.style.display = show ? '' : 'none';
      });
    });
  }());

  // --- FAQ page: at most one item open per accordion (clearer on long pages) ---
  (function () {
    document.querySelectorAll('.faq-page-accordion').forEach(function (accordion) {
      accordion.addEventListener('toggle', function (e) {
        var el = e.target;
        if (!el.matches || !el.matches('details.faq-acc-item')) return;
        if (el.open) {
          accordion.querySelectorAll('details.faq-acc-item').forEach(function (d) {
            if (d !== el) d.open = false;
          });
        }
      });
    });
  }());
})();
