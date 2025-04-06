import {convertToHoursMinutes, getAllStoredSessions} from "../app.js";

const requiredHours = 120;

const totalTime = document.getElementById("totalTime")

// Gets Total Time in milliseconds
function getTotalTime() {
  const sessions = getAllStoredSessions();
  let total = 0;
  sessions.forEach(session => {
    total += session.duration;
  });
  return total;
}

function renderTotalTime() {
  totalTime.innerText = `${convertToHoursMinutes(getTotalTime())} of ${requiredHours} hours`;
  const totalTimeInHours = getTotalTime() / (1000 * 60 * 60);
  const percentageTotalTime = (totalTimeInHours / requiredHours) * 100;
  totalTime.style.background = `linear-gradient(100deg, #fad522 0%, #fad522 ${percentageTotalTime}%, #fff ${percentageTotalTime}%, #fff 100%)`
}

function renderStatistics() {
  renderTotalTime()
}

window.onload = function () {
  renderStatistics();
}