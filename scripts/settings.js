import {STORAGE_KEY, toast, showConfirmationDialog, getAllStoredSessions} from "../app.js";

function exportData() {
  const sessions = getAllStoredSessions();
  const dataStr = JSON.stringify(sessions);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportTime = new Date().toISOString().replace(/[:\-T]/g, '_').split('.')[0];

  const exportFileDefaultName = `learnerlog_backup_${exportTime}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();

  toast("Backup exported", "green");
}

function importData(files) {
  const file = files[0];
  if (!file) {
    toast("No file selected", "#ff0000");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const sessions = JSON.parse(event.target.result);
      if (!Array.isArray(sessions)) {
        toast("Invalid file format", "#ff0000");
        return;
      }
      // Ask to confirm the import
      showConfirmationDialog("Are you sure you want to import this backup? THIS WILL OVERWRITE YOUR CURRENT DATA.", function (confirmed) {
        // Handle confirmation
        if (confirmed) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
          toast("Backup imported", "green");
        } else {
          toast("Import cancelled", "red");
        }
      });
    } catch (error) {
      toast("Error parsing file", "#ff0000");
    }
  };

  reader.readAsText(file);
}

async function clearAppData() {
  showConfirmationDialog("Are you sure you want to clear all app data? THIS CANNOT BE UNDONE.", function (confirmed) {
    if (confirmed) {
      window.localStorage.clear()
      toast("All app data cleared", "green");
    } else {
      toast("Cancelled action", "red");
    }
  });
}

async function clearAppCache() {
  showConfirmationDialog("Are you sure you want to clear the app cache? This will remove all offline assets and pages, not your app data.", function (confirmed) {
    if (confirmed) {
      caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (cacheName) {
          caches.delete(cacheName);
        });
      });
      toast("App cache cleared", "green");
    } else {
      toast("Cancelled action", "red");
    }
  });
}

window.clearAppData = clearAppData;
window.clearAppCache = clearAppCache;
window.exportData = exportData;
window.importData = importData;
window.exportData = exportData;