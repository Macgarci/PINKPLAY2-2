// IndexedDB 

const Storage = (function () {
  const DB_NAME = 'MusicPINKDB';
  const DB_VERSION = 1;
  const STORE_METRICS = 'metrics';
  const STORE_PLAYLISTS = 'playlists';
  let db = null;
  let useLocal = false;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        useLocal = true;
        return resolve(null);
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(STORE_METRICS)) {
          idb.createObjectStore(STORE_METRICS, { keyPath: 'id', autoIncrement: true });
        }
        if (!idb.objectStoreNames.contains(STORE_PLAYLISTS)) {
          idb.createObjectStore(STORE_PLAYLISTS, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function init() {
    await openDB();
  }

  function withStore(storeName, mode, fn) {
    return new Promise((resolve, reject) => {
      if (useLocal) return resolve(fn(null)); 
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const result = fn(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = (e) => reject(e.target.error);
    });
  }


  async function addMetric(metric) {
    
    if (useLocal) {
      const arr = JSON.parse(localStorage.getItem('mp_metrics') || '[]');
      arr.push(metric);
      localStorage.setItem('mp_metrics', JSON.stringify(arr));
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METRICS, 'readwrite');
      const store = tx.objectStore(STORE_METRICS);
      const req = store.add(metric);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllMetrics() {
    if (useLocal) {
      const arr = JSON.parse(localStorage.getItem('mp_metrics') || '[]');
      return Promise.resolve(arr);
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METRICS, 'readonly');
      const store = tx.objectStore(STORE_METRICS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function clearMetrics() {
    if (useLocal) {
      localStorage.removeItem('mp_metrics');
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METRICS, 'readwrite');
      const store = tx.objectStore(STORE_METRICS);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // Playlists API (example)
  async function addPlaylist(playlist) {
    if (useLocal) {
      const arr = JSON.parse(localStorage.getItem('mp_playlists') || '[]');
      arr.push(playlist);
      localStorage.setItem('mp_playlists', JSON.stringify(arr));
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PLAYLISTS, 'readwrite');
      const store = tx.objectStore(STORE_PLAYLISTS);
      const req = store.add(playlist);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllPlaylists() {
    if (useLocal) return Promise.resolve(JSON.parse(localStorage.getItem('mp_playlists') || '[]'));
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PLAYLISTS, 'readonly');
      const store = tx.objectStore(STORE_PLAYLISTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  return {
    init,
    addMetric,
    getAllMetrics,
    clearMetrics,
    addPlaylist,
    getAllPlaylists,
    _isUsingLocal: () => useLocal, 


    async exportMetricsJSON() {
      const metrics = await getAllMetrics();
      return JSON.stringify(metrics, null, 2);
    },

    async exportMetricsCSV() {
      const metrics = await getAllMetrics();
      if (!metrics || metrics.length === 0) return '';
    
      const headers = ['id','timestamp','value','type','meta'];
      const escape = (v) => {
        if (v === null || typeof v === 'undefined') return '';
        const s = (typeof v === 'object') ? JSON.stringify(v) : String(v);
     
        return `"${s.replace(/"/g, '""')}"`;
      };
      const lines = [headers.join(',')];
      metrics.forEach(m => {
        const row = [
          m.id ?? '',
          m.timestamp ?? '',
          m.value ?? '',
          m.type ?? '',
          (m.meta ? JSON.stringify(m.meta) : '')
        ].map(escape).join(',');
        lines.push(row);
      });
      return lines.join('\r\n');
    }
  };
})();


if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
} else {
  window.MPStorage = Storage;
}
