/**
 * PWA install — native prompt() only. No banners, toasts, or instruction modals.
 * Install button is plain HTML (not React) so service-worker-cached Login cannot break it.
 */
(function () {
  'use strict';
  var LOG = '[PWA]';
  var BTN_ID = 'pwa-native-install-btn';
  var STYLE_ID = 'pwa-native-install-style';

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift(LOG);
    console.log.apply(console, a);
  }

  var api = (window.__PWA_INSTALL__ = window.__PWA_INSTALL__ || {});
  api.deferred = api.deferred || null;
  api.state = 'checking';

  function isStandalone() {
    try {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        navigator.standalone === true
      );
    } catch (e) {
      return false;
    }
  }

  function emit() {
    window.dispatchEvent(new CustomEvent('pwa-state-change', { detail: { state: api.state } }));
  }

  function setState(state) {
    api.state = state;
    log('state →', state);
    emit();
    updateButton();
  }

  /** Install UI only on login — hidden on dashboard, POS, and all other routes */
  function isLoginPage() {
    try {
      var p = (window.location.pathname || '').replace(/\/$/, '') || '/';
      return p === '/login';
    } catch (e) {
      return false;
    }
  }

  function hookSpaNavigation() {
    if (window.__PWA_LOGIN_ROUTE_HOOK__) return;
    window.__PWA_LOGIN_ROUTE_HOOK__ = true;
    var push = history.pushState;
    var replace = history.replaceState;
    history.pushState = function () {
      var r = push.apply(history, arguments);
      updateButton();
      return r;
    };
    history.replaceState = function () {
      var r = replace.apply(history, arguments);
      updateButton();
      return r;
    };
    window.addEventListener('popstate', updateButton);
  }

  function updateButton() {
    var btn = document.getElementById(BTN_ID);
    if (!btn) return;
    if (!isLoginPage()) {
      btn.style.display = 'none';
      return;
    }
    if (api.state === 'standalone') {
      btn.style.display = 'none';
      return;
    }
    if (api.state === 'already_installed') {
      btn.style.display = 'flex';
      btn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128 24a8 8 0 0 0-8 8v40.85l-33.65-19.39a8 8 0 0 0-8 13.86l41.42 23.94-41.42 23.94a8 8 0 1 0 8 13.86L120 136.15V177a8 8 0 0 0 16 0v-40.85l33.65 19.39a8 8 0 1 0 8-13.86l-41.42-23.94 41.42-23.94a8 8 0 0 0-8-13.86L136 72.85V32a8 8 0 0 0-8-8Z"/></svg><span>Open App</span>';
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';
      btn.style.borderColor = '#15803d';
      btn.disabled = false;
      btn.title = 'Open installed Sandra ERP (same as address bar Open in app)';
      return;
    }
    if (api.state === 'installable') {
      btn.style.display = 'flex';
      btn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h176v-56a8 8 0 0 1 16 0Zm-101.66 2.34a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 116.69V24a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z"/></svg><span>Install App</span>';
      btn.style.background = 'rgba(255,255,255,.95)';
      btn.style.color = '#4f46e5';
      btn.style.borderColor = 'rgba(79,70,229,.2)';
      btn.title = 'Install Sandra ERP — native browser install';
      return;
    }
    if (api.state === 'checking' || api.state === 'waiting') {
      btn.style.display = 'flex';
      btn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h176v-56a8 8 0 0 1 16 0Zm-101.66 2.34a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 116.69V24a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z"/></svg><span>Install App</span>';
      btn.style.background = 'rgba(255,255,255,.95)';
      btn.style.color = '#4f46e5';
      btn.style.borderColor = 'rgba(79,70,229,.2)';
      btn.title = 'Preparing install…';
      return;
    }
    btn.style.display = 'none';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '#' +
      BTN_ID +
      '{position:fixed;top:16px;right:16px;z-index:2147483646;display:none;align-items:center;gap:8px;padding:10px 16px;border:1px solid rgba(79,70,229,.2);border-radius:12px;font:600 14px system-ui,sans-serif;cursor:pointer;pointer-events:auto;box-shadow:0 4px 14px rgba(0,0,0,.12);touch-action:manipulation}' +
      '#' +
      BTN_ID +
      ':hover{box-shadow:0 6px 20px rgba(0,0,0,.15)}' +
      '#' +
      BTN_ID +
      ':disabled{opacity:.7;cursor:default}';
    document.head.appendChild(s);
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return;
    injectStyles();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BTN_ID;
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      api.install();
    });
    (document.body || document.documentElement).appendChild(btn);
    updateButton();
  }

  window.addEventListener(
    'beforeinstallprompt',
    function (e) {
      log('beforeinstallprompt fired');
      e.preventDefault();
      api.deferred = e;
      log('deferredPrompt stored:', !!api.deferred);
      setState('installable');
    },
    { capture: true }
  );

  window.addEventListener('appinstalled', function () {
    log('appinstalled — User accepted installation');
    api.deferred = null;
    try {
      localStorage.setItem('pwa_installed', '1');
    } catch (e) {}
    setState('already_installed');
  });

  function detectInstalled() {
    if (isStandalone()) {
      setState('standalone');
      return Promise.resolve(true);
    }
    try {
      if (localStorage.getItem('pwa_installed') === '1') {
        log('localStorage pwa_installed');
        setState('already_installed');
        return Promise.resolve(true);
      }
    } catch (e) {}
    if ('getInstalledRelatedApps' in navigator) {
      return navigator.getInstalledRelatedApps().then(function (apps) {
        if (apps && apps.length > 0) {
          log('getInstalledRelatedApps: already installed');
          try {
            localStorage.setItem('pwa_installed', '1');
          } catch (e) {}
          setState('already_installed');
          return true;
        }
        return false;
      });
    }
    return Promise.resolve(false);
  }

  function runPrompt(prompt) {
    log('Calling deferredPrompt.prompt() — Installation prompt opened');
    return prompt
      .prompt()
      .then(function () {
        return prompt.userChoice;
      })
      .then(function (choice) {
        log('User choice:', choice && choice.outcome);
        if (choice && choice.outcome === 'accepted') {
          log('User accepted installation');
          api.deferred = null;
          setState('already_installed');
        } else if (choice && choice.outcome === 'dismissed') {
          log('User dismissed installation');
        }
      });
  }

  api.install = function () {
    log('Install App clicked');

    if (isStandalone()) {
      log('Already in standalone mode');
      return Promise.resolve();
    }

    if (api.state === 'already_installed') {
      log('Already installed — opening app');
      window.location.href = '/';
      return Promise.resolve();
    }

    var prompt = api.deferred;
    if (prompt && typeof prompt.prompt === 'function') {
      return runPrompt(prompt).catch(function (err) {
        console.error(LOG, 'prompt() failed:', err);
      });
    }

    log('No deferredPrompt — beforeinstallprompt did not fire yet');
    return detectInstalled().then(function (installed) {
      if (installed) return;
      log('Reason: Chrome has not fired beforeinstallprompt (app may need reinstall from chrome://apps, or use address-bar install chip)');
    });
  };

  window.__PWA__ = api;

  function boot() {
    hookSpaNavigation();
    injectButton();
    detectInstalled().then(function (installed) {
      if (!installed && api.deferred) setState('installable');
      else if (!installed && !api.deferred) setState('checking');
    });
    setTimeout(function () {
      if (api.state === 'checking' || api.state === 'waiting') {
        detectInstalled().then(function (installed) {
          if (!installed && !api.deferred && api.state === 'checking') setState('waiting');
        });
      }
    }, 2500);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(function (reg) {
          log('Service worker registered:', reg.scope);
        })
        .catch(function (e) {
          console.warn(LOG, 'SW registration failed:', e);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  log('controller v5 loaded (login page only)');
})();
