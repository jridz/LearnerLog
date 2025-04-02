import {getAllStoredSessions} from "../functions/getAllStoredSessions.js";
import {STORAGE_KEY} from "../../app.js";
import {renderPastSessions} from "../../app.js";
import {toast} from "./toast.js";

const editSessionForm = document.getElementById("editSessionForm");
const editSessionModal = document.getElementById("editSessionModal");

export function openEditSessionModal(index) {
  const editSessionDateInput = document.getElementById("editSessionDateInput");
  const editSessionStartTimeInput = document.getElementById("editSessionStartTimeInput");
  const editSessionEndTimeInput = document.getElementById("editSessionEndTimeInput");
  const editSessionStartLocationInput = document.getElementById("editSessionStartLocation");
  const editSessionEndLocationInput = document.getElementById("editSessionEndLocation");

  const sessions = getAllStoredSessions();

  editSessionDateInput.value = sessions[index].date;
  editSessionStartTimeInput.value = sessions[index].startTime;
  editSessionEndTimeInput.value = sessions[index].endTime;
  editSessionStartLocationInput.value = sessions[index].startLocation;
  editSessionEndLocationInput.value = sessions[index].endLocation;

  document.getElementById("editSessionModal").dataset.index = index;
  document.getElementById("editSessionModal").showModal()
}

export function deleteSession() {
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