(function () {
  'use strict';

  // Demo account. Only a SHA-256 hash is stored here, never the password itself.
  var DEMO = { email: 'demo@example.com', hash: '2c5aac059ceb506544c3e822b7b6ddae45ad2158d81d0b9e02f75f5f9e3f711f', name: 'Demo user' };
  var SESSION_KEY = 'tribali.session';
  var REMEMBER_KEY = 'tribali.rememberedEmail';
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var $ = function (id) { return document.getElementById(id); };
  var views = { login: $('view-login'), forgot: $('view-forgot'), done: $('view-done') };
  var email = $('email'), password = $('password'), remember = $('remember');
  var alertBox = $('login-alert');
  var failed = 0, lockUntil = 0, lockTimer = null;

  function show(name) {
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
    var h = views[name].querySelector('h1');
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }

  function setError(input, errEl, text) {
    errEl.textContent = text || '';
    if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !text;
  }
  function checkEmail(input, errEl) {
    var v = input.value.trim();
    if (!v) return setError(input, errEl, 'Email is required.');
    if (!emailRe.test(v)) return setError(input, errEl, 'Enter a valid email, for example you@example.com.');
    return setError(input, errEl, '');
  }
  function checkPassword() {
    var v = password.value;
    if (!v) return setError(password, $('password-err'), 'Password is required.');
    if (v.length < 8) return setError(password, $('password-err'), 'Password must be at least 8 characters.');
    return setError(password, $('password-err'), '');
  }
  function alertMsg(text, type) {
    alertBox.hidden = !text;
    alertBox.textContent = text || '';
    alertBox.className = 'alert' + (type ? ' ' + type : '');
  }

  // Inline validation on blur, and live clearing once corrected
  email.addEventListener('blur', function () { if (email.value) checkEmail(email, $('email-err')); });
  email.addEventListener('input', function () { if (email.hasAttribute('aria-invalid')) checkEmail(email, $('email-err')); });
  password.addEventListener('blur', function () { if (password.value) checkPassword(); });
  password.addEventListener('input', function () { if (password.hasAttribute('aria-invalid')) checkPassword(); });

  // Show / hide password
  $('toggle-pw').addEventListener('click', function () {
    var showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    this.setAttribute('aria-pressed', showing ? 'false' : 'true');
    this.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    this.querySelector('.i-eye').hidden = !showing;
    this.querySelector('.i-eye-off').hidden = showing;
  });

  // Remembered email
  try {
    var saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) { email.value = saved; remember.checked = true; }
  } catch (e) { /* ignore */ }

  $('fill-demo').addEventListener('click', function () {
    email.value = DEMO.email;
    password.value = 'Demo@1234';
    checkEmail(email, $('email-err')); checkPassword();
    password.focus();
  });

  function startLock(seconds) {
    lockUntil = Date.now() + seconds * 1000;
    var btn = $('login-btn');
    btn.disabled = true;
    clearInterval(lockTimer);
    lockTimer = setInterval(function () {
      var left = Math.ceil((lockUntil - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(lockTimer);
        btn.disabled = false; btn.textContent = 'Sign in'; failed = 0;
        alertMsg('', '');
      } else {
        btn.textContent = 'Try again in ' + left + 's';
      }
    }, 500);
  }

  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alertMsg('', '');
    var okE = checkEmail(email, $('email-err'));
    var okP = checkPassword();
    if (!okE || !okP) { (okE ? password : email).focus(); return; }

    var btn = $('login-btn');
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'Signing in...';
    UI.sha256('rwt|' + email.value.trim().toLowerCase() + '|' + password.value).then(function (h) {
      setTimeout(function () {
        btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = 'Sign in';
        if (email.value.trim().toLowerCase() === DEMO.email && h === DEMO.hash) {
          failed = 0;
          try {
            if (remember.checked) localStorage.setItem(REMEMBER_KEY, DEMO.email); else localStorage.removeItem(REMEMBER_KEY);
            (remember.checked ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify({ email: DEMO.email, at: Date.now() }));
          } catch (err) { /* storage blocked: still show success for this visit */ }
          $('done-text').textContent = 'Signed in as ' + DEMO.email + (remember.checked ? '. We will remember you on this device.' : '.');
          password.value = '';
          show('done');
          UI.toast('Signed in successfully.', 'success');
        } else {
          failed++;
          alertMsg('Incorrect email or password. ' + Math.max(0, 5 - failed) + ' attempt(s) left.', '');
          UI.toast('Sign in failed.', 'error');
          password.focus();
          if (failed >= 5) { alertMsg('Too many attempts. Please wait 30 seconds.', ''); startLock(30); }
        }
      }, 400);
    });
  });

  // Forgot password
  function route() {
    if (location.hash === '#forgot') show('forgot');
    else if (views.done.hidden === false) { /* stay */ }
    else if (!views.forgot.hidden) show('login');
  }
  $('to-forgot').addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', '#forgot'); show('forgot'); });
  $('to-login').addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', '#login'); show('login'); });
  $('forgot-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var fe = $('forgot-email');
    if (!checkEmail(fe, $('forgot-err'))) { fe.focus(); return; }
    UI.toast('If an account exists for ' + fe.value.trim() + ', a reset link would be sent. (Demo: nothing is sent.)', 'success');
    fe.value = '';
    history.replaceState(null, '', '#login');
    show('login');
  });

  $('logout').addEventListener('click', function () {
    try { sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    show('login');
    UI.toast('Signed out.', 'info');
  });

  // Restore an existing session
  try {
    var s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null');
    if (s && s.email) { $('done-text').textContent = 'Signed in as ' + s.email + '.'; views.login.hidden = true; views.done.hidden = false; }
  } catch (e) { /* ignore */ }
  if (location.hash === '#forgot' && views.done.hidden) { views.login.hidden = true; views.forgot.hidden = false; }
  window.addEventListener('hashchange', route);
})();
