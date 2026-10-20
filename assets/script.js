/* ============================================================
   DISPLAY TRANSITIONS
   ============================================================ */
var display1 = document.getElementById('display1');
var display2 = document.getElementById('display2');
var display3 = document.getElementById('display3');

function showDisplay(target, options) {
  var current = document.querySelector('.display.active');
  if (current) {
    current.classList.remove('active');
  }
  target.classList.add('active');
  if (options && options.animate) {
    target.classList.add('entering');
  }
  if (target === display3) {
    window.scrollTo(0, 0);
    initDisplay3();
  }
}

/* ============================================================
   DISPLAY 1 — Closed Book Click
   ============================================================ */
var closedBook = document.getElementById('closedBook');

closedBook.addEventListener('click', function () {
  if (closedBook.classList.contains('opening')) return;
  closedBook.classList.add('opening');

  setTimeout(function () {
    showDisplay(display2);
    startTyping();
  }, 1100);
});

/* ============================================================
   DISPLAY 2 — Typing Animation
   ============================================================ */
var typingEl = document.getElementById('typingText');
var melodyImg = document.getElementById('pageMelody');

var typingLines = [
  'You are invited...',
  '',
  'Join us as we turn the page to Story\'s new chapter'
];

function startTyping() {
  var fullText = typingLines.join('\n');
  var i = 0;

  // Add cursor
  var cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  typingEl.textContent = '';
  typingEl.appendChild(cursor);

  function typeNext() {
    if (i < fullText.length) {
      var char = fullText[i];
      if (char === '\n') {
        cursor.insertAdjacentHTML('beforebegin', '<br>');
      } else {
        cursor.insertAdjacentText('beforebegin', char);
      }
      i++;
      var delay = char === '.' ? 180 : char === ',' ? 100 : 40;
      setTimeout(typeNext, delay);
    } else {
      // Show melody image after typing finishes
      setTimeout(function () {
        melodyImg.classList.add('show');
        cursor.remove();
      }, 800);
    }
  }

  typeNext();
}

/* ============================================================
   DISPLAY 2 — Envelope "Click Here"
   ============================================================ */
function openMainDisplay() {
  if (display2.dataset.transitioning) return;
  display2.dataset.transitioning = '1';
  display2.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  display2.style.opacity = '0';
  display2.style.transform = 'scale(1.05)';

  setTimeout(function () {
    showDisplay(display3, { animate: true });
  }, 600);
}

document.getElementById('envelopeBtn').addEventListener('click', openMainDisplay);
document.querySelector('.envelope-pointer').addEventListener('click', openMainDisplay);

/* ============================================================
   DISPLAY 3 — Initialise once shown
   ============================================================ */
var display3Initialised = false;

function initDisplay3() {
  if (display3Initialised) return;
  display3Initialised = true;

  initCountdown();
  initCalendarButton();
  initStickyNav();
  initActiveNavLink();
  initFadeIn();
}

/* ===== Countdown Timer ===== */
function initCountdown() {
  var partyDate = new Date('2026-10-31T16:00:00+08:00');
  var daysEl = document.getElementById('cdDays');
  var hoursEl = document.getElementById('cdHours');
  var minutesEl = document.getElementById('cdMinutes');
  var secondsEl = document.getElementById('cdSeconds');
  var timerEl = document.getElementById('countdownTimer');
  var pastEl = document.getElementById('countdownPast');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    var now = new Date();
    var diff = partyDate - now;

    if (diff <= 0) {
      timerEl.hidden = true;
      pastEl.hidden = false;
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ===== Add to Calendar ===== */
function initCalendarButton() {
  document.getElementById('addCalendarBtn').addEventListener('click', function () {
    var title = "Storya Olivia's 7th Birthday Party";
    var start = '20261031T080000Z';
    var end = '20261031T120000Z';
    var location = 'Subic Bay Peninsular Hotel, Subic Bay Freeport Zone, Zambales, Philippines';
    var details = "Join us for Storya Olivia's 7th Birthday Party! Dress code: floral, white or pastel.";

    var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(title)
      + '&dates=' + start + '/' + end
      + '&location=' + encodeURIComponent(location)
      + '&details=' + encodeURIComponent(details);

    window.open(url, '_blank');
  });
}

/* ===== Sticky Nav ===== */
function initStickyNav() {
  var nav = document.getElementById('stickyNav');
  var hero = document.getElementById('hero');
  var rsvpBtn = document.getElementById('stickyRsvp');

  function onScroll() {
    var heroBottom = hero.getBoundingClientRect().bottom;
    var show = heroBottom < 0;
    nav.classList.toggle('visible', show);
    rsvpBtn.classList.toggle('visible', show);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Active Nav Link ===== */
function initActiveNavLink() {
  var sections = document.querySelectorAll('#display3 section[id]');
  var navLinks = document.querySelectorAll('.sticky-nav a');

  function highlightNav() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top <= 80) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* ===== Fade-In on Scroll ===== */
function initFadeIn() {
  var targets = document.querySelectorAll('#display3 .card, #display3 .section-title, #display3 .countdown, .rsvp-section > p, .rsvp-section > a, .closing, .contact');
  targets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('#display3 .fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('#display3 .fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }
}
