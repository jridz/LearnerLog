import {getAllStoredSessions} from "./getAllStoredSessions.js";
import {STORAGE_KEY} from "../app.js";

// Store the new session in our client-side storage
export function storeNewSession(date, startTime, endTime, startLocation, endLocation) {
  // Get data from storage
  const sessions = getAllStoredSessions();

  // Add the new session object to the end of the array of session objects
  sessions.push({date, startTime, endTime, startLocation, endLocation});

  // Sort the array so that sessions are ordered by date, from newest to oldest
  sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Store the updated array back in the storage
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}