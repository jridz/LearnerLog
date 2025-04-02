import {getAllStoredSessions} from "../functions/getAllStoredSessions.js";

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