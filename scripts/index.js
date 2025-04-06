import {
  STORAGE_KEY,
  toast,
  convertTo12HourFormat,
  convertToHoursMinutes,
  formatDate,
  getAllStoredSessions,
  sanitize
} from "../app.js";

const newSessionModal = document.getElementById("newSessionModal");
const newSessionForm = document.getElementById("newSessionForm");
const editSessionModal = document.getElementById("editSessionModal");
const editSessionForm = document.getElementById("editSessionForm");

function dateValid(date) {
  const newSessionDateError = document.getElementById('newSessionDateError');
  const editSessionDateError = document.getElementById('editSessionDateError');

  // Check that date is not null
  if (!date) {
    newSessionDateError.style.display = "flex";
    editSessionDateError.style.display = "flex";
    return false;
  }

  return true;
}

function timeValid(startTime, endTime) {
  const newSessionStartTimeError = document.getElementById('newSessionStartTimeError');
  const newSessionEndTimeError = document.getElementById('newSessionEndTimeError');
  const editSessionStartTimeError = document.getElementById('editSessionStartTimeError');
  const editSessionEndTimeError = document.getElementById('editSessionEndTimeError');

  // Check that end time is after start time and neither is null
  if (!startTime || !endTime || startTime > endTime) {
    if (!startTime) {
      newSessionStartTimeError.style.display = "flex";
      editSessionStartTimeError.style.display = "flex";
    }
    if (!endTime) {
      newSessionEndTimeError.style.display = "flex";
      editSessionEndTimeError.style.display = "flex";
    }
    if (startTime > endTime) {
      newSessionStartTimeError.style.display = "flex";
      editSessionStartTimeError.style.display = "flex";
      newSessionStartTimeError.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"15px\" viewBox=\"0 -960 960 960\" width=\"15px\"\n" +
        "                         fill=\"#e3e3e3\">\n" +
        "                        <path d=\"M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\"/>\n" +
        "                    </svg> Error: Start time must be before end time";
      editSessionStartTimeError.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"15px\" viewBox=\"0 -960 960 960\" width=\"15px\"\n" +
        "                         fill=\"#e3e3e3\">\n" +
        "                        <path d=\"M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\"/>\n" +
        "                    </svg> Error: Start time must be before end time";
    }

    return false;
  }

  return true;
}

function resetErrors() {
  const newSessionDateError = document.getElementById('newSessionDateError');
  const newSessionStartTimeError = document.getElementById('newSessionStartTimeError');
  const newSessionEndTimeError = document.getElementById('newSessionEndTimeError');

  const editSessionDateError = document.getElementById('editSessionDateError');
  const editSessionStartTimeError = document.getElementById('editSessionStartTimeError');
  const editSessionEndTimeError = document.getElementById('editSessionEndTimeError');

  newSessionDateError.style.display = "none";
  newSessionStartTimeError.style.display = "none";
  newSessionEndTimeError.style.display = "none";

  editSessionDateError.style.display = "none";
  editSessionStartTimeError.style.display = "none";
  editSessionEndTimeError.style.display = "none";
}

function createPastSessionItem(session, index) {
  const sessionItemContainer = document.createElement("li");
  const pastSessionList = document.getElementById("pastSessionsList");
  sessionItemContainer.classList.add("sessionItemContainer");

  const sessionInfo = document.createElement("div");

  sessionInfo.classList.add("sessionInfo");

  const sessionDuration = document.createElement("p");
  sessionDuration.textContent = `${convertToHoursMinutes(session.duration)}`;

  const sessionLocations = document.createElement("p");
  sessionLocations.textContent = `${session.startLocation} -> ${session.endLocation}`;

  sessionInfo.appendChild(sessionDuration);
  sessionInfo.appendChild(sessionLocations);

  const sessionDate = document.createElement("p");
  sessionDate.textContent = formatDate(session.date);
  const sessionTimes = document.createElement("p");
  sessionTimes.textContent = `from ${convertTo12HourFormat(session.startTime)} to ${convertTo12HourFormat(session.endTime)}`;

  const editButton = document.createElement("button");
  editButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#e3e3e3\">" +
    "<path d=\"M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z\"/>" +
    "</svg>";
  editButton.classList.add("sessionEditButton");
  editButton.onclick = () => {
    openEditSessionModal(index)
  }

  sessionInfo.appendChild(sessionDate);
  sessionInfo.appendChild(sessionTimes);
  sessionInfo.appendChild(editButton);

  sessionItemContainer.dataset.index = index;

  sessionItemContainer.appendChild(sessionInfo);

  pastSessionList.appendChild(sessionItemContainer);
}

function renderPastSessions() {
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

function openEditSessionModal(index) {
  const editSessionDateInput = document.getElementById("editSessionDateInput");
  const editSessionStartTimeInput = document.getElementById("editSessionStartTimeInput");
  const editSessionEndTimeInput = document.getElementById("editSessionEndTimeInput");
  const editSessionStartLocationInput = document.getElementById("editSessionStartLocation");
  const editSessionEndLocationInput = document.getElementById("editSessionEndLocation");

  const sessions = getAllStoredSessions();

  editSessionDateInput.value = sessions[index].date;
  editSessionStartTimeInput.value = sessions[index].startTime;
  editSessionEndTimeInput.value = sessions[index].endTime;
  editSessionStartLocationInput.value = sanitize(sessions[index].startLocation);
  editSessionEndLocationInput.value = sanitize(sessions[index].endLocation);

  document.getElementById("editSessionModal").dataset.index = index;
  document.getElementById("editSessionModal").showModal()
}

function deleteSession() {
  const index = document.getElementById("editSessionModal").dataset.index;

  // Get data from storage
  const sessions = getAllStoredSessions();

  // Remove the session at the specified index
  sessions.splice(Number(index), 1);

  // Sort the array so that sessions are ordered by date, from newest to oldest
  sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Store the updated array back in the storage
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  renderPastSessions();
  editSessionForm.reset();
  editSessionModal.close();

  // Show a toast message
  toast("Session deleted", "#ff0000");
}

function storeNewSession(date, startTime, endTime, duration, startLocation, endLocation) {
  // Get data from storage
  const sessions = getAllStoredSessions();

  // Add the new session object to the end of the array of session objects
  sessions.push({date, startTime, endTime, duration, startLocation, endLocation});

  // Sort the array so that sessions are ordered by date, from newest to oldest
  sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Store the updated array back in the storage
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function storeEditedSession(index, date, startTime, endTime, duration, startLocation, endLocation) {
  // Get data from storage
  const sessions = getAllStoredSessions();

  sessions[index].date = date;
  sessions[index].startTime = startTime;
  sessions[index].endTime = endTime;
  sessions[index].duration = duration;
  sessions[index].startLocation = startLocation;
  sessions[index].endLocation = endLocation;

  // Sort the array so that sessions are ordered by date, from newest to oldest
  sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Store the updated array back in the storage
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

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

window.onload = () => {
  renderPastSessions();
  resetErrors();
};

window.deleteSession = deleteSession;