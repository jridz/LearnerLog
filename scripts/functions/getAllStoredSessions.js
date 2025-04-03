import {STORAGE_KEY} from "../../app.js";

// Get all stored sessions from localStorage
export function getAllStoredSessions() {
  // Get the string of session data from localStorage
  const data = window.localStorage.getItem(STORAGE_KEY);

  // If no sessions were stored, default to an empty array
  // Otherwise, return the stored data as parsed JSON
  return data ? JSON.parse(data) : [];
}