import {formatTime} from "./functions/formatTime.js";
import {formatDate} from "./functions/formatDate.js";
import {dateValid} from "./functions/dateValid.js";
import {timeValid} from "./functions/timeValid.js";
import {storeNewSession} from "./functions/storeNewSession.js";
import {getAllStoredSessions} from "./functions/getAllStoredSessions.js";
import {resetErrors} from "./functions/resetErrors.js";

export const STORAGE_KEY = "learnerlog";
const newTripForm = document.getElementById("newTripForm");
const dateInput = document.getElementById("date");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const pastSessionContainer = document.getElementById("past-sessions");

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

newTripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetErrors();

  const date = dateInput.value;
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (!dateValid(date)) {
    return;
  }

  if (!timeValid(startTime, endTime)) {
    return;
  }

  storeNewSession(date, startTime, endTime);
  renderPastSessions();
  newTripForm.reset();
});

function renderPastSessions() {
  const sessions = getAllStoredSessions();

  if (sessions.length === 0) {
    return;
  }

  pastSessionContainer.textContent = "";
  const pastSessionList = document.createElement("ul");

  sessions.forEach((session) => {
    const sessionEl = document.createElement("li");
    sessionEl.textContent = `${formatDate(session.date)} from ${formatTime(session.startTime)} to ${formatTime(session.endTime)}`;
    pastSessionList.appendChild(sessionEl);
  });

  pastSessionContainer.appendChild(pastSessionList);
}

window.onload = () => {
  renderPastSessions();
  resetErrors();
};