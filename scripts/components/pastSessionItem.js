import {formatDate} from "../functions/formatDate.js";
import {convertTo12HourFormat} from "../functions/convertTo12HourFormat.js";
import {convertToHoursMinutes} from "../functions/convertToHoursMinutes.js";
import {pastSessionList} from "../app.js";

export function createPastSessionItem(session) {
  const sessionItemContainer = document.createElement("li");
  sessionItemContainer.classList.add("sessionItemContainer");

  const sessionInfoAbove = document.createElement("div");
  const sessionInfoBelow = document.createElement("div");

  sessionInfoAbove.classList.add("sessionInfoAbove");
  sessionInfoBelow.classList.add("sessionInfoBelow");

  const sessionDuration = document.createElement("p");
  sessionDuration.textContent = `${convertToHoursMinutes(session.duration)}`;

  const sessionStartLocation = document.createElement("p");
  sessionStartLocation.textContent = session.startLocation;
  const sessionEndLocation = document.createElement("p");
  sessionEndLocation.textContent = session.endLocation;

  sessionInfoAbove.appendChild(sessionDuration);
  sessionInfoAbove.appendChild(sessionStartLocation);
  sessionInfoAbove.appendChild(sessionEndLocation);

  const sessionDate = document.createElement("p");
  sessionDate.textContent = formatDate(session.date);
  const sessionTimes = document.createElement("p");
  sessionTimes.textContent = `from ${convertTo12HourFormat(session.startTime)} to ${convertTo12HourFormat(session.endTime)}`;

  sessionInfoBelow.appendChild(sessionDate);
  sessionInfoBelow.appendChild(sessionTimes);

  sessionItemContainer.appendChild(sessionInfoAbove);
  sessionItemContainer.appendChild(sessionInfoBelow);

  pastSessionList.appendChild(sessionItemContainer);
}