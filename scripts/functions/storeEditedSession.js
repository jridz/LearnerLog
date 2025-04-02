import {getAllStoredSessions} from "./getAllStoredSessions.js";
import {STORAGE_KEY} from "../app.js";

// Store the new session in our client-side storage
export function storeEditedSession(index, date, startTime, endTime, duration, startLocation, endLocation) {
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