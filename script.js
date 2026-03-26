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

  // --- Consultation form ---
  var form = document.getElementById('consultation-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      if (name && name.value.trim() && email && email.value.trim()) {
        var actions = form.querySelector('.form-actions');
        var msg = document.createElement('p');
        msg.className = 'form-success';
        msg.setAttribute('role', 'status');
        msg.textContent = (window.BHT && window.BHT.i18n ? window.BHT.i18n.get('index.formSuccess', window.BHT.i18n.getLang()) : 'Vielen Dank. Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.');
        if (actions && actions.parentNode) {
          actions.parentNode.insertBefore(msg, actions);
        }
        form.reset();
      }
    });
  }
})();
