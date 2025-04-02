import {dateValid} from "./functions/dateValid.js";
import {timeValid} from "./functions/timeValid.js";
import {storeNewSession} from "./functions/storeNewSession.js";
import {storeEditedSession} from "./functions/storeEditedSession.js";
import {getAllStoredSessions} from "./functions/getAllStoredSessions.js";
import {resetErrors} from "./functions/resetErrors.js";
import {createPastSessionItem} from "./components/pastSessionItem.js";
import {deleteSession} from "./components/editSessionModal.js";

export const STORAGE_KEY = "learnerlog";
const newSessionForm = document.getElementById("newSessionForm");
const editSessionForm = document.getElementById("editSessionForm");
const newSessionModal = document.getElementById("newSessionModal");
const editSessionModal = document.getElementById("editSessionModal");
export const pastSessionList = document.getElementById("pastSessionsList");

function toggleNav() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("visible");
}

document.addEventListener("click", (event) => {
  const navMenu = document.getElementById("navMenu");
  const navToggle = document.getElementById("navToggle");

  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    navMenu.classList.remove("visible");
  }
});

document.getElementById("navToggle").addEventListener("click", toggleNav);

newSessionForm.addEventListener("submit", (event) => {
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

editSessionForm.addEventListener("submit", (event) => {
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

document.getElementById("deleteSessionButton").addEventListener("click", () => {
  deleteSession()
});

export function renderPastSessions() {
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

window.onload = () => {
  renderPastSessions();
  resetErrors();
};

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/LearnerLog/scripts/serviceWorker.js');
      console.log('ServiceWorker registration successful with scope:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            if (confirm('A new version of this app is available. Reload to update?')) {
              // Send skip waiting message to the service worker
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });

  // Detect controller change (when skipWaiting is called)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Reload the page when the new service worker takes over
    window.location.reload();
  });
}