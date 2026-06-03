/* Notifies app to run sync when connectivity returns (SW postMessage). */
(function () {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.addEventListener('message', function (ev) {
    if (ev.data && ev.data.type === 'RUN_OFFLINE_SYNC') {
      window.dispatchEvent(new CustomEvent('offline-sync-requested'));
      if (window.__SANDRA_OFFLINE__ && window.__SANDRA_OFFLINE__.triggerSync) {
        window.__SANDRA_OFFLINE__.triggerSync();
      }
    }
  });
  window.addEventListener('online', function () {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLIENT_ONLINE' });
    }
  });
})();
