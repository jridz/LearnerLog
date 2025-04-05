import {dateValid} from "./scripts/functions/dateValid.js";
import {timeValid} from "./scripts/functions/timeValid.js";
import {storeNewSession} from "./scripts/functions/storeNewSession.js";
import {storeEditedSession} from "./scripts/functions/storeEditedSession.js";
import {getAllStoredSessions} from "./scripts/functions/getAllStoredSessions.js";
import {resetErrors} from "./scripts/functions/resetErrors.js";
import {createPastSessionItem} from "./scripts/components/pastSessionItem.js";
import {deleteSession} from "./scripts/components/editSessionModal.js";
import {clearAppData} from "./scripts/functions/clearAppData.js";
import {clearAppCache} from "./scripts/functions/clearAppCache.js";
import {toast} from "./scripts/components/toast.js";
import {showConfirmationDialog} from "./scripts/functions/showConfirmationDialog.js";

const newSessionForm = document.getElementById("newSessionForm");
const newSessionModal = document.getElementById("newSessionModal");
const editSessionForm = document.getElementById("editSessionForm");
const editSessionModal = document.getElementById("editSessionModal");

export const STORAGE_KEY = "learnerlog";

if (newSessionForm) {
  newSessionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    resetErrors();

    const date = document.getElementById("newSessionDateInput").value;
    const startTime = document.getElementById("newSessionStartTimeInput");
    const endTime = document.getElementById("newSessionEndTimeInput");
    const startLocation = document.getElementById("newSessionStartLocation").value;
    const endLocation = document.getElementById("newSessionEndLocation").value

    const duration = (endTime.valueAsNumber - startTime.valueAsNumber);

    if (!dateValid(date)) {
      return;
    }

    if (!timeValid(startTime.value, endTime.value)) {
      return;
    }

    storeNewSession(date, startTime.value, endTime.value, duration, startLocation, endLocation);
    renderPastSessions();
    newSessionForm.reset();
    newSessionModal.close();
  });
}

if (editSessionForm) {
  editSessionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    resetErrors();

    const index = document.getElementById("editSessionModal").dataset.index;

    const date = document.getElementById("editSessionDateInput").value;
    const startTime = document.getElementById("editSessionStartTimeInput");
    const endTime = document.getElementById("editSessionEndTimeInput");
    const startLocation = document.getElementById("editSessionStartLocation").value;
    const endLocation = document.getElementById("editSessionEndLocation").value

    const duration = (endTime.valueAsNumber - startTime.valueAsNumber);

    if (!dateValid(date)) {
      return;
    }

    if (!timeValid(startTime.value, endTime.value)) {
      return;
    }

    storeEditedSession(index, date, startTime.value, endTime.value, duration, startLocation, endLocation);
    renderPastSessions();
    editSessionForm.reset();
    editSessionModal.close();
  });
}

export function renderPastSessions() {
  const pastSessionList = document.getElementById("pastSessionsList");

  pastSessionList.innerHTML = "";

  const sessions = getAllStoredSessions();

  if (sessions.length === 0) {
    return;
  }

  let index = 0;
  sessions.forEach((session) => {
    createPastSessionItem(session, index);
    index++;
  });
}

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

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/LearnerLog/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

window.clearAppCache = clearAppCache;
window.clearAppData = clearAppData;
window.renderPastSessions = renderPastSessions;
window.resetErrors = resetErrors;
window.deleteSession = deleteSession;
window.clearAppData = clearAppData;
window.clearAppCache = clearAppCache;
window.exportData = exportData;
window.importData = importData;
window.exportData = exportData;