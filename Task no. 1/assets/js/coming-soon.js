(function () {
  'use strict';

  /* ---------- Slider (slick) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sliderEl = document.getElementById('slider');
  var playBtn = document.getElementById('toggle-play');
  var userPaused = reduce; // reduced motion: slideshow starts paused
  var $slider = null;

  function syncPlayButton() {
    playBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    playBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
  }

  if (window.jQuery && jQuery.fn && jQuery.fn.slick) {
    $slider = jQuery(sliderEl);
    $slider.slick({
      arrows: false,
      dots: false,
      fade: true,
      speed: reduce ? 0 : 900,
      infinite: true,
      autoplay: !reduce,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      pauseOnFocus: true,
      swipe: true,
      touchMove: true,
      draggable: true,
      accessibility: true,
      adaptiveHeight: false
    });

    var count = $slider.slick('getSlick').slideCount;
    var dots = document.getElementById('dots');
    for (var i = 0; i < count; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ' of ' + count);
      b.dataset.index = i;
      dots.appendChild(b);
    }
    function markDot(idx) {
      [].forEach.call(dots.children, function (d, n) {
        if (n === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    markDot(0);
    $slider.on('afterChange', function (e, slick, current) { markDot(current); });
    dots.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (t) $slider.slick('slickGoTo', +t.dataset.index);
    });
    document.getElementById('prev').addEventListener('click', function () { $slider.slick('slickPrev'); });
    document.getElementById('next').addEventListener('click', function () { $slider.slick('slickNext'); });

    playBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      $slider.slick(userPaused ? 'slickPause' : 'slickPlay');
      syncPlayButton();
    });

    // Arrow keys work anywhere on the page unless the user is typing
    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === 'ArrowLeft') { $slider.slick('slickPrev'); }
      else if (e.key === 'ArrowRight') { $slider.slick('slickNext'); }
    });

    // Pause when the tab is hidden; resume only if the user did not pause
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) $slider.slick('slickPause');
      else if (!userPaused) $slider.slick('slickPlay');
    });

    // Honour a live change of the reduced-motion setting
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onMq = function (e) {
      if (e.matches) { userPaused = true; $slider.slick('slickPause'); syncPlayButton(); }
    };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    syncPlayButton();
  } else {
    // Library failed to load: keep the first image and hide the controls
    document.querySelector('.slider-controls').hidden = true;
  }

  /* ---------- Countdown ---------- */
  var cd = document.getElementById('countdown');
  var cdText = document.getElementById('countdown-text');
  var target = new Date(cd.getAttribute('data-launch')).getTime();
  var cells = {};
  [].forEach.call(cd.querySelectorAll('[data-unit]'), function (n) { cells[n.getAttribute('data-unit')] = n; });
  var lastMinute = -1;

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = target - Date.now();
    if (isNaN(diff)) { cd.hidden = true; return false; }
    if (diff <= 0) {
      cd.classList.add('done');
      cd.textContent = 'We have launched - welcome!';
      cdText.textContent = 'We have launched.';
      return false;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    cells.days.textContent = pad(d);
    cells.hours.textContent = pad(h);
    cells.minutes.textContent = pad(m);
    cells.seconds.textContent = pad(sec);
    if (m !== lastMinute) {
      lastMinute = m;
      cdText.textContent = d + ' days, ' + h + ' hours and ' + m + ' minutes until launch.';
    }
    return true;
  }
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- Subscribe form ---------- */
  var KEY = 'tribali.subscribers';
  var form = document.getElementById('subscribe');
  var input = document.getElementById('sub-email');
  var msg = document.getElementById('sub-msg');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function readList() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function setMsg(text, type) {
    msg.textContent = text;
    msg.className = 'sub-msg ' + (type || '');
    if (type === 'error') input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  input.addEventListener('input', function () { if (msg.textContent) setMsg('', ''); });
  input.addEventListener('blur', function () {
    var v = input.value.trim();
    if (v && !emailRe.test(v)) setMsg('That does not look like a valid email address.', 'error');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim().toLowerCase();
    if (!v) { setMsg('Please enter your email address.', 'error'); input.focus(); return; }
    if (!emailRe.test(v)) { setMsg('Please enter a valid email, for example you@example.com.', 'error'); input.focus(); return; }
    var list = readList();
    if (list.indexOf(v) !== -1) { setMsg('You are already on the list. Thank you!', 'success'); return; }
    var btn = form.querySelector('button');
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    setTimeout(function () {
      try {
        list.push(v);
        localStorage.setItem(KEY, JSON.stringify(list));
        setMsg('Thank you! We will email you when we launch.', 'success');
        UI.toast('You are on the list.', 'success');
        form.reset();
      } catch (err) {
        setMsg('Could not save your email because browser storage is blocked.', 'error');
        UI.toast('Subscription failed.', 'error');
      }
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
    }, 350);
  });
})();
