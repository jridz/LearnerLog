import {formatTime} from "./functions/formatTime.js";
import {formatDate} from "./functions/formatDate.js";
import {dateValid} from "./functions/dateValid.js";
import {timeValid} from "./functions/timeValid.js";
import {storeNewSession} from "./functions/storeNewSession.js";
import {getAllStoredSessions} from "./functions/getAllStoredSessions.js";
import {resetErrors} from "./functions/resetErrors.js";

// Create constants for the form and the form controls
export const STORAGE_KEY = "learnerlog";
export const newTripForm = document.getElementById("newTripForm");
const dateInput = document.getElementById("date");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const pastSessionContainer = document.getElementById("past-sessions");

// Listen to form submissions
newTripForm.addEventListener("submit", (event) => {
  // Prevent the form from submitting to the server since everything is client-side
  event.preventDefault();

  // Reset any previous errors
  resetErrors();

  // Get the start and end dates from the form
  const date = dateInput.value;
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  // Check if the date is invalid
  if (!dateValid(date)) {
    // If the date is invalid, exit
    return;
  }

  // Check if the times are invalid
  if (!timeValid(startTime, endTime)) {
    // If the times are invalid, exit
    return;
  }

  // Store the new session in our client-side storage
  storeNewSession(date, startTime, endTime);

  // Refresh the UI
  renderPastSessions();

  // Reset the form
  newTripForm.reset();
});

// Render past sessions to the UI
function renderPastSessions() {
  // Get the parsed string of sessions, or an empty array
  const sessions = getAllStoredSessions();

  // Exit if there are no sessions
  if (sessions.length === 0) {
    return;
  }

  // Clear the list of past sessions, since we're going to re-render it
  pastSessionContainer.textContent = "";

  const pastSessionList = document.createElement("ul");

  // Loop over all sessions and render them
  sessions.forEach((session) => {
    const sessionEl = document.createElement("li");
    sessionEl.textContent = `${formatDate(session.date)} from ${formatTime(
      session.startTime
    )} to ${formatTime(session.endTime)}`;
    pastSessionList.appendChild(sessionEl);
  });
  
  pastSessionContainer.appendChild(pastSessionList);
}

// Initial render of past sessions
window.onload = () => {
  renderPastSessions()
  resetErrors()
}