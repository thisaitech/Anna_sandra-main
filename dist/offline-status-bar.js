/**
 * Compact sync status pill (top-right). Hidden when online + idle; no layout overlap.
 */
(function () {
  'use strict';
  var ID = 'sandra-offline-status-bar';
  var STYLE_ID = 'sandra-offline-status-style';

  function getSettings() {
    try {
      var raw = localStorage.getItem('offlineSyncSettings');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      syncStatus: 'idle',
      pendingSyncCount: 0,
      lastSyncTime: null,
      lastSyncError: null,
    };
  }

  function formatTime(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function shouldShow(online, cfg, syncing) {
    if (!online) return true;
    if (syncing || cfg.syncStatus === 'syncing') return true;
    if (cfg.syncStatus === 'error' || cfg.lastSyncError) return true;
    if ((cfg.pendingSyncCount || 0) > 0) return true;
    return false;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '#' +
      ID +
      '{position:fixed;top:12px;right:12px;left:auto;bottom:auto;z-index:2147483644;display:none;align-items:center;justify-content:flex-end;gap:8px;padding:6px 12px;border-radius:12px;font:600 12px system-ui,sans-serif;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.12);max-width:min(420px,calc(100vw - 24px));flex-wrap:wrap}' +
      '#' +
      ID +
      '.visible{display:flex}' +
      '#' +
      ID +
      '.online{background:linear-gradient(90deg,#ecfdf5,#d1fae5);color:#065f46;border:1px solid #a7f3d0}' +
      '#' +
      ID +
      '.offline{background:linear-gradient(90deg,#fef2f2,#fee2e2);color:#991b1b;border:1px solid #fecaca}' +
      '#' +
      ID +
      '.syncing{background:linear-gradient(90deg,#eff6ff,#dbeafe);color:#1e40af;border:1px solid #bfdbfe}' +
      '#' +
      ID +
      '.error{background:linear-gradient(90deg,#fff7ed,#ffedd5);color:#9a3412;border:1px solid #fed7aa}' +
      '@media (max-width:1023px){#' +
      ID +
      '{top:auto;bottom:12px;right:12px;left:12px;max-width:none}}';
    document.head.appendChild(s);
  }

  function render() {
    var el = document.getElementById(ID);
    if (!el) return;
    var online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    var cfg = getSettings();
    var status = cfg.syncStatus || 'idle';
    var pending = cfg.pendingSyncCount || 0;
    var last = formatTime(cfg.lastSyncTime);
    var syncing =
      status === 'syncing' || (window.__SANDRA_OFFLINE__ && window.__SANDRA_OFFLINE__.syncing);

    el.className = 'visible';
    document.body.classList.add('sandra-app-shell');
    if (shouldShow(online, cfg, syncing)) {
      document.body.classList.add('sandra-sync-active');
    } else {
      document.body.classList.remove('sandra-sync-active');
      el.className = '';
      el.style.display = 'none';
      return;
    }

    if (!online) {
      el.classList.add('offline');
      el.innerHTML =
        '<span>🔴 Offline</span><span>Data saved locally (IndexedDB)</span>' +
        (pending > 0 ? '<span>· ' + pending + ' pending</span>' : '');
      return;
    }
    if (syncing) {
      el.classList.add('syncing');
      el.innerHTML =
        '<span>🔄 Syncing</span><span>' +
        (pending > 0 ? 'Uploading ' + pending + ' records' : 'Uploading changes') +
        '</span>';
      return;
    }
    if (status === 'error' || cfg.lastSyncError) {
      el.classList.add('error');
      var _err = (cfg.lastSyncError || 'Retrying…').replace(/^(\\w+:\\s*){2,}/, '').replace(/ - /g, ' · ');
      el.innerHTML = '<span>⚠ Sync issue</span><span>' + _err + '</span>';
      return;
    }
    el.classList.add('online');
    el.innerHTML =
      '<span>🟢 Online</span>' +
      (last ? '<span>Last sync: ' + last + '</span>' : '') +
      (pending > 0 ? '<span>· ' + pending + ' pending</span>' : '<span>✅ Synced</span>');
  }

  function inject() {
    if (document.getElementById(ID)) return;
    injectStyles();
    var el = document.createElement('div');
    el.id = ID;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    (document.body || document.documentElement).appendChild(el);
    render();
  }

  window.addEventListener('online', render);
  window.addEventListener('offline', render);
  window.addEventListener('offline-settings-changed', render);
  window.addEventListener('offline-sync-completed', render);
  window.addEventListener('offline-sync-started', render);
  window.addEventListener('offline-sync-finished', render);

  function boot() {
    inject();
    render();
    setInterval(render, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
