/**
 * Offline app download — validated installer delivery (v6).
 * Prevents saving HTML/placeholder as .exe (Firebase SPA rewrite / Spark hosting limit).
 */
(function () {
  'use strict';

  var LOG = '[DOWNLOAD_APP]';
  var BTN_ID = 'offline-download-btn';
  var DROPDOWN_ID = 'offline-download-dropdown';
  var STYLE_ID = 'offline-download-style';
  var TOAST_ID = 'offline-download-toast';
  var MANIFEST_URL = '/downloads/installer-manifest.json';

  var manifest = null;
  var manifestLoading = null;

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift(LOG);
    console.log.apply(console, a);
  }

  function isLoginPage() {
    try {
      var p = (window.location.pathname || '').replace(/\/$/, '') || '/';
      return p === '/login';
    } catch (e) {
      return false;
    }
  }

  function isHostedSite() {
    var h = (location.hostname || '').toLowerCase();
    return h.indexOf('web.app') >= 0 || h.indexOf('firebaseapp.com') >= 0;
  }

  function isLocalDev() {
    var h = (location.hostname || '').toLowerCase();
    return h === 'localhost' || h === '127.0.0.1';
  }

  function showToast(title, message, isError) {
    var existing = document.getElementById(TOAST_ID);
    if (existing) existing.remove();

    var box = document.createElement('div');
    box.id = TOAST_ID;
    box.setAttribute('role', 'alert');
    box.style.cssText =
      'position:fixed;top:72px;right:16px;z-index:2147483647;max-width:360px;padding:16px 18px;' +
      'border-radius:12px;font:500 14px/1.45 system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.18);' +
      (isError
        ? 'background:#fef2f2;color:#991b1b;border:1px solid #fecaca;'
        : 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;');

    box.innerHTML =
      '<div style="font-weight:700;margin-bottom:6px">' +
      title +
      '</div><div>' +
      message +
      '</div>' +
      '<button type="button" style="margin-top:10px;padding:6px 12px;border-radius:8px;border:0;cursor:pointer;font-weight:600;' +
      (isError ? 'background:#dc2626;color:#fff' : 'background:#059669;color:#fff') +
      '">OK</button>';

    box.querySelector('button').addEventListener('click', function () {
      box.remove();
    });
    (document.body || document.documentElement).appendChild(box);
    setTimeout(function () {
      if (box.parentNode) box.remove();
    }, 12000);
  }

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    if (manifestLoading) return manifestLoading;
    manifestLoading = fetch(MANIFEST_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('manifest HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        manifest = data;
        log('manifest loaded', data.windows && data.windows.sizeBytes);
        return data;
      })
      .catch(function (err) {
        log('manifest load failed', err);
        manifestLoading = null;
        return null;
      });
    return manifestLoading;
  }

  var winAvailable = false;
  var androidAvailable = false;

  function pickWindowsUrl(m) {
    if (!m || !m.windows) return null;
    var w = m.windows;
    var hostingPath = w.localPath || '/downloads/windows/Sandra_ERP_Setup.exe';
    if (isHostedSite()) {
      return w.releaseUrl || w.storageUrl || hostingPath;
    }
    return hostingPath;
  }

  function pickAndroidUrl(m) {
    if (!m || !m.android) return null;
    var a = m.android;
    var hostingPath = a.localPath || '/downloads/android/Sandra_ERP.apk';
    if (isHostedSite()) {
      return a.storageUrl || a.releaseUrl || hostingPath;
    }
    return hostingPath;
  }

  function checkInstallerAvailability() {
    return loadManifest().then(function (m) {
      var minWin = (m && m.windows && m.windows.minSizeBytes) || 50 * 1024 * 1024;
      var minApk = (m && m.android && m.android.minSizeBytes) || 5 * 1024 * 1024;
      var winUrl = pickWindowsUrl(m);
      var apkUrl = pickAndroidUrl(m);
      var tasks = [];

      winAvailable = false;
      androidAvailable = false;

      if (winUrl) {
        tasks.push(
          probeUrl(winUrl, minWin)
            .then(function () {
              winAvailable = true;
            })
            .catch(function (err) {
              log('windows probe failed', winUrl, err && err.message);
              winAvailable = false;
            })
        );
      }

      if (apkUrl && m && m.android && m.android.available) {
        tasks.push(
          probeUrl(apkUrl, minApk)
            .then(function () {
              androidAvailable = true;
            })
            .catch(function (err) {
              log('android probe failed', apkUrl, err && err.message);
              androidAvailable = false;
            })
        );
      }

      return Promise.all(tasks).then(function () {
        updateButtonStates();
      });
    });
  }

  function updateButtonStates() {
    var winBtn = document.getElementById('sandra-win-download');
    var apkBtn = document.getElementById('sandra-apk-download');
    if (!winBtn || !apkBtn) return;

    if (winAvailable) {
      winBtn.disabled = false;
      winBtn.style.opacity = '1';
      winBtn.style.cursor = 'pointer';
      winBtn.style.background = '#fff';
      winBtn.style.color = '#374151';
      winBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22L22,22L22,2L2,2M11,11L11,4L20,4L20,11M11,20L11,13L20,13L20,20M4,11L4,4L9,4L9,11M4,20L4,13L9,13L9,20Z"/></svg> Windows App (.exe)';
    } else {
      winBtn.disabled = true;
      winBtn.style.opacity = '0.6';
      winBtn.style.cursor = 'not-allowed';
      winBtn.style.background = '#f9fafb';
      winBtn.style.color = '#9ca3af';
      winBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color:#d1d5db"><path d="M2,22L22,22L22,2L2,2M11,11L11,4L20,4L20,11M11,20L11,13L20,13L20,20M4,11L4,4L9,4L9,11M4,20L4,13L9,13L9,20Z"/></svg><div style="display:flex;flex-direction:column;gap:2px"><span>Windows App - Build Not Available</span><span style="font-size:11px;color:#9ca3af;font-weight:400">Contact Administrator</span></div>';
    }

    if (androidAvailable) {
      apkBtn.disabled = false;
      apkBtn.style.opacity = '1';
      apkBtn.style.cursor = 'pointer';
      apkBtn.style.background = '#fff';
      apkBtn.style.color = '#374151';
      apkBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6,9.48L19.45,6.27L18.58,5.77L16.67,9.08C15.2,8.4 13.63,8 12,8C10.37,8 8.8,8.4 7.33,9.08L5.42,5.77L4.55,6.27L6.4,9.48C3.3,11.25 1.25,14.46 1,18.25H23C22.75,14.46 20.7,11.25 17.6,9.48M7,15.25C6.31,15.25 5.75,14.69 5.75,14C5.75,13.31 6.31,12.75 7,12.75C7.69,12.75 8.25,13.31 8.25,14C8.25,14.69 7.69,15.25 7,15.25M17,15.25C16.31,15.25 15.75,14.69 15.75,14C15.75,13.31 16.31,12.75 17,12.75C17.69,12.75 18.25,13.31 18.25,14C18.25,14.69 17.69,15.25 17,15.25Z"/></svg> Android App (.apk)';
    } else {
      apkBtn.disabled = true;
      apkBtn.style.opacity = '0.6';
      apkBtn.style.cursor = 'not-allowed';
      apkBtn.style.background = '#f9fafb';
      apkBtn.style.color = '#9ca3af';
      apkBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color:#d1d5db"><path d="M17.6,9.48L19.45,6.27L18.58,5.77L16.67,9.08C15.2,8.4 13.63,8 12,8C10.37,8 8.8,8.4 7.33,9.08L5.42,5.77L4.55,6.27L6.4,9.48C3.3,11.25 1.25,14.46 1,18.25H23C22.75,14.46 20.7,11.25 17.6,9.48M7,15.25C6.31,15.25 5.75,14.69 5.75,14C5.75,13.31 6.31,12.75 7,12.75C7.69,12.75 8.25,13.31 8.25,14C8.25,14.69 7.69,15.25 7,15.25M17,15.25C16.31,15.25 15.75,14.69 15.75,14C15.75,13.31 16.31,12.75 17,12.75C17.69,12.75 18.25,13.31 18.25,14C18.25,14.69 17.69,15.25 17,15.25Z"/></svg><div style="display:flex;flex-direction:column;gap:2px"><span>Android App - Build Not Available</span><span style="font-size:11px;color:#9ca3af;font-weight:400">Contact Administrator</span></div>';
    }
  }

  function validateResponse(meta, minSize) {
    var ct = (meta.contentType || '').toLowerCase();
    var len = meta.contentLength;
    if (ct.indexOf('text/html') >= 0) {
      return 'Server returned HTML instead of installer (hosting misconfiguration).';
    }
    if (len > 0 && len < minSize) {
      return 'Installer too small (' + len + ' bytes). File is incomplete or corrupted.';
    }
    return null;
  }

  function probeUrl(url, minSize) {
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (head) {
        var meta = {
          contentType: head.headers.get('content-type') || '',
          contentLength: parseInt(head.headers.get('content-length') || '0', 10) || 0,
        };
        if (!head.ok) {
          throw new Error('Download probe failed (HTTP ' + head.status + ')');
        }
        var err = validateResponse(meta, minSize);
        if (err) return Promise.reject(new Error(err));
        if (meta.contentLength >= minSize) return meta;
        return fetch(url, { headers: { Range: 'bytes=0-1' }, cache: 'no-store' }).then(function (r) {
          if (!r.ok && r.status !== 206) throw new Error('Download probe failed (HTTP ' + r.status + ')');
          var ct2 = (r.headers.get('content-type') || meta.contentType).toLowerCase();
          if (ct2.indexOf('text/html') >= 0) {
            throw new Error('Server returned HTML instead of installer.');
          }
          return r.arrayBuffer().then(function (buf) {
            var b = new Uint8Array(buf);
            if (b.length < 2 || b[0] !== 0x4d || b[1] !== 0x5a) {
              throw new Error('Installer Corrupted — file is not a valid Windows executable.');
            }
            return meta;
          });
        });
      });
  }

  function triggerBlobDownload(blob, fileName) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      a.remove();
    }, 500);
  }

  function validateApkBlob(blob, minSize) {
    if (blob.size < minSize) {
      throw new Error('APK too small (' + blob.size + ' bytes). Please download again.');
    }
    return blob.slice(0, 2).arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      if (b.length < 2 || b[0] !== 0x50 || b[1] !== 0x4b) {
        throw new Error('Installer Corrupted — APK is not a valid ZIP archive.');
      }
      return blob;
    });
  }

  function downloadAndroid(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (!androidAvailable) {
      showToast('Android Installer Download Failed', 'Build Not Available.\n\nContact Administrator', true);
      return;
    }
    loadManifest().then(function (m) {
      var apk = m && m.android;
      var minSize = (apk && apk.minSizeBytes) || 5 * 1024 * 1024;
      var fileName = (apk && apk.fileName) || 'Sandra_ERP.apk';
      var url = pickAndroidUrl(m);
      if (!url) {
        showToast('Android Installer Download Failed', 'No download URL configured.', true);
        return;
      }
      probeUrl(url, minSize)
        .then(function () {
          return fetch(url, { cache: 'no-store' });
        })
        .then(function (r) {
          if (!r.ok) throw new Error('Download failed (HTTP ' + r.status + ')');
          return r.blob();
        })
        .then(function (blob) {
          return validateApkBlob(blob, minSize);
        })
        .then(function (blob) {
          triggerBlobDownload(blob, fileName);
          showToast('Download started', fileName + ' (' + Math.round(blob.size / 1024 / 1024) + ' MB)', false);
        })
        .catch(function (err) {
          var msg = err && err.message ? err.message : 'Unknown error';
          showToast('Android Installer Download Failed', 'Please Retry.\n\n' + msg, true);
        });
    });
  }

  function downloadWindows(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (!winAvailable) {
      showToast('Windows Installer Download Failed', 'Build Not Available.\n\nContact Administrator', true);
      return;
    }

    loadManifest().then(function (m) {
      var win = m && m.windows;
      var minSize = (win && win.minSizeBytes) || 50 * 1024 * 1024;
      var fileName = (win && win.fileName) || 'Sandra_ERP_Setup.exe';
      var url = pickWindowsUrl(m);

      if (!url) {
        showToast(
          'Windows Installer Download Failed',
          'No download URL configured.',
          true
        );
        return;
      }

      log('downloading', url);
      showToast('Preparing download…', 'Validating installer integrity before download.', false);

      probeUrl(url, minSize)
        .then(function () {
          return fetch(url, { cache: 'no-store' });
        })
        .then(function (r) {
          if (!r.ok) throw new Error('Download failed (HTTP ' + r.status + ')');
          var ct = (r.headers.get('content-type') || '').toLowerCase();
          if (ct.indexOf('text/html') >= 0) {
            throw new Error('Server returned HTML instead of installer.');
          }
          return r.blob();
        })
        .then(function (blob) {
          if (blob.size < minSize) {
            throw new Error('Installer too small (' + blob.size + ' bytes). Please download again.');
          }
          return blob.slice(0, 2).arrayBuffer().then(function (buf) {
            var b = new Uint8Array(buf);
            if (b.length < 2 || b[0] !== 0x4d || b[1] !== 0x5a) {
              throw new Error('Installer Corrupted — please download again.');
            }
            return blob;
          });
        })
        .then(function (blob) {
          var toast = document.getElementById(TOAST_ID);
          if (toast) toast.remove();
          triggerBlobDownload(blob, fileName);
          showToast('Download started', fileName + ' (' + Math.round(blob.size / 1024 / 1024) + ' MB)', false);
          log('download OK', blob.size);
        })
        .catch(function (err) {
          log('download failed', err);
          var msg = err && err.message ? err.message : 'Unknown error';
          if (msg.indexOf('404') >= 0 || msg.indexOf('probe failed') >= 0) {
            showToast(
              'Windows Installer Download Failed',
              'Installer is not on the server yet.\n\nAsk your admin to run the deploy pipeline, or build locally:\n  .\\build-desktop.ps1',
              true
            );
          } else if (msg.indexOf('Corrupted') >= 0) {
            showToast('Installer Corrupted', 'Please Download Again.\n\n' + msg, true);
          } else {
            showToast('Windows Installer Download Failed', 'Please Retry.\n\n' + msg, true);
          }
        });
    });
  }

  function hookSpaNavigation() {
    if (window.__DOWNLOAD_HOOK__) return;
    window.__DOWNLOAD_HOOK__ = true;
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
      var d = document.getElementById(DROPDOWN_ID);
      if (d) d.style.display = 'none';
      return;
    }
    btn.style.display = 'flex';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '#' +
      BTN_ID +
      '{position:fixed;top:16px;right:16px;z-index:2147483646;display:none;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,255,255,.95);color:#4f46e5;border:1px solid rgba(79,70,229,.2);border-radius:12px;font:600 14px system-ui,sans-serif;cursor:pointer;pointer-events:auto;box-shadow:0 4px 14px rgba(0,0,0,.12);touch-action:manipulation}' +
      '#' +
      BTN_ID +
      ':hover{box-shadow:0 6px 20px rgba(0,0,0,.15)}' +
      '#' +
      DROPDOWN_ID +
      '{position:fixed;top:60px;right:16px;z-index:2147483646;display:none;flex-direction:column;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.1);overflow:hidden;min-width:240px}' +
      '#' +
      DROPDOWN_ID +
      ' button,#' +
      DROPDOWN_ID +
      ' a{display:flex;align-items:center;gap:12px;padding:14px 16px;color:#374151;text-decoration:none;font:500 14px system-ui,sans-serif;border:0;border-bottom:1px solid #f3f4f6;background:#fff;width:100%;text-align:left;cursor:pointer;transition:background 0.2s ease}' +
      '#' +
      DROPDOWN_ID +
      ' button:hover,#' +
      DROPDOWN_ID +
      ' a:hover{background:#f9fafb}' +
      '#' +
      DROPDOWN_ID +
      ' svg{color:#6b7280}';
    document.head.appendChild(s);
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return;
    injectStyles();

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BTN_ID;
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h176v-56a8 8 0 0 1 16 0Zm-101.66 2.34a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 116.69V24a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z"/></svg><span>Download Offline App</span>';

    var dropdown = document.createElement('div');
    dropdown.id = DROPDOWN_ID;
    dropdown.innerHTML =
      '<button type="button" id="sandra-win-download"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22L22,22L22,2L2,2M11,11L11,4L20,4L20,11M11,20L11,13L20,13L20,20M4,11L4,4L9,4L9,11M4,20L4,13L9,13L9,20Z"/></svg> Windows App (.exe)</button>' +
      '<button type="button" id="sandra-apk-download"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6,9.48L19.45,6.27L18.58,5.77L16.67,9.08C15.2,8.4 13.63,8 12,8C10.37,8 8.8,8.4 7.33,9.08L5.42,5.77L4.55,6.27L6.4,9.48C3.3,11.25 1.25,14.46 1,18.25H23C22.75,14.46 20.7,11.25 17.6,9.48M7,15.25C6.31,15.25 5.75,14.69 5.75,14C5.75,13.31 6.31,12.75 7,12.75C7.69,12.75 8.25,13.31 8.25,14C8.25,14.69 7.69,15.25 7,15.25M17,15.25C16.31,15.25 15.75,14.69 15.75,14C15.75,13.31 16.31,12.75 17,12.75C17.69,12.75 18.25,13.31 18.25,14C18.25,14.69 17.69,15.25 17,15.25Z"/></svg> Android App (.apk)</button>';

    dropdown.querySelector('#sandra-win-download').addEventListener('click', downloadWindows);
    dropdown.querySelector('#sandra-apk-download').addEventListener('click', downloadAndroid);

    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var d = document.getElementById(DROPDOWN_ID);
      d.style.display = d.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', function (ev) {
      if (!btn.contains(ev.target) && !dropdown.contains(ev.target)) {
        dropdown.style.display = 'none';
      }
    });

    (document.body || document.documentElement).appendChild(btn);
    (document.body || document.documentElement).appendChild(dropdown);
    updateButton();
  }

  function boot() {
    hookSpaNavigation();
    injectButton();
    loadManifest();
    checkInstallerAvailability();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  log('controller v8 loaded (validated download)');
})();
