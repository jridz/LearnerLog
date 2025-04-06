import {convertToHoursMinutes, getAllStoredSessions} from "../app.js";

const requiredHours = 120;
const sessions = getAllStoredSessions();

const totalTime = document.getElementById("totalTime")
const averageSessionLength = document.getElementById("averageSessionLength")
const numberOfSessions = document.getElementById("numberOfSessions")
const totalDaysActive = document.getElementById("totalDaysActive")
const averageSessionsPerDay = document.getElementById("averageSessionsPerDay")
const longestSession = document.getElementById("longestSession")

function renderTotalTime() {
  let totalMilliseconds = 0;
  sessions.forEach(session => {
    totalMilliseconds += session.duration;
  });

  totalTime.innerText = `${convertToHoursMinutes(totalMilliseconds)} of ${requiredHours} hours`;
  const totalTimeInHours = totalMilliseconds / (1000 * 60 * 60);
  const percentageTotalTime = (totalTimeInHours / requiredHours) * 100;
  totalTime.style.background = `linear-gradient(100deg, #fad522 0%, #fad522 ${percentageTotalTime}%, #fff ${percentageTotalTime}%, #fff 100%)`
}

function renderAverageSessionLength() {
  let total = 0;
  sessions.forEach(session => {
    total += session.duration;
  });
  const average = total / sessions.length;

  if (isNaN(average)) {
    averageSessionLength.innerText = "0 minutes";
    return
  }

  averageSessionLength.innerText = convertToHoursMinutes(average);
}

function renderNumberOfSessions() {
  numberOfSessions.innerText = `${sessions.length} sessions`;
}

function renderTotalDaysActive() {
  const days = new Set();
  sessions.forEach(session => {
    days.add(session.date);
  });
  totalDaysActive.innerText = `${days.size} active days`;
}

function renderAverageSessionsPerDay() {
  const days = new Set();
  sessions.forEach(session => {
    days.add(session.date);
  });
  const average = sessions.length / days.size;
  console.log(average)
  if (isNaN(average)) {
    averageSessionsPerDay.innerText = "0 sessions per day";
    return
  }

  averageSessionsPerDay.innerText = `${Math.round(average)} sessions per day`;
}

function renderLongestSession() {
  let longest = 0;
  sessions.forEach(session => {
    if (session.duration > longest) {
      longest = session.duration;
    }
  });
  longestSession.innerText = convertToHoursMinutes(longest);
}

function renderStatistics() {
  renderTotalTime()
  renderAverageSessionLength()
  renderNumberOfSessions()
  renderTotalDaysActive()
  renderAverageSessionsPerDay()
  renderLongestSession()
}

window.onload = function () {
  renderStatistics();
}