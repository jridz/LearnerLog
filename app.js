import {dateValid} from "./scripts/functions/dateValid.js";
import {timeValid} from "./scripts/functions/timeValid.js";
import {storeNewSession} from "./scripts/functions/storeNewSession.js";
import {storeEditedSession} from "./scripts/functions/storeEditedSession.js";
import {getAllStoredSessions} from "./scripts/functions/getAllStoredSessions.js";
import {resetErrors} from "./scripts/functions/resetErrors.js";
import {createPastSessionItem} from "./scripts/components/pastSessionItem.js";
import {deleteSession} from "./scripts/components/editSessionModal.js";

export const STORAGE_KEY = "learnerlog";

function newSessionFormSubmit(event) {
  event.preventDefault();
  resetErrors();

  const newSessionForm = document.getElementById("newSessionForm");
  const newSessionModal = document.getElementById("newSessionModal");

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
}

function editSessionFormSubmit(event) {
  event.preventDefault();
  resetErrors();

  const editSessionForm = document.getElementById("editSessionForm");
  const editSessionModal = document.getElementById("editSessionModal");

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