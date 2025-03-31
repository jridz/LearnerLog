import {dateValid} from "./functions/dateValid.js";
import {timeValid} from "./functions/timeValid.js";
import {storeNewSession} from "./functions/storeNewSession.js";
import {getAllStoredSessions} from "./functions/getAllStoredSessions.js";
import {resetErrors} from "./functions/resetErrors.js";
import {createPastSessionItem} from "./components/pastSessionItem.js";

export const STORAGE_KEY = "learnerlog";
const newTripForm = document.getElementById("newTripForm");
const dateInput = document.getElementById("date");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
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

newTripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetErrors();

  const date = dateInput.value;
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  const startLocation = document.getElementById("startLocation").value;
  const endLocation = document.getElementById("endLocation").value
  const duration = (endTimeInput.valueAsNumber - startTimeInput.valueAsNumber);

  if (!dateValid(date)) {
    return;
  }

  if (!timeValid(startTime, endTime)) {
    return;
  }

  storeNewSession(date, startTime, endTime, duration, startLocation, endLocation);
  renderPastSessions();
  newTripForm.reset();
});

function renderPastSessions() {
  const sessions = getAllStoredSessions();

  if (sessions.length === 0) {
    return;
  }

  sessions.forEach((session) => {
    createPastSessionItem(session);
  });
}

window.onload = () => {
  renderPastSessions();
  resetErrors();
};