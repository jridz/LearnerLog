export const newSessionDateError = document.getElementById('newSessionDateError');
export const newSessionStartTimeError = document.getElementById('newSessionStartTimeError');
export const newSessionEndTimeError = document.getElementById('newSessionEndTimeError');

export const editSessionDateError = document.getElementById('editSessionDateError');
export const editSessionStartTimeError = document.getElementById('editSessionStartTimeError');
export const editSessionEndTimeError = document.getElementById('editSessionEndTimeError');

// Hide all the errors
export function resetErrors() {
  newSessionDateError.style.display = "none";
  newSessionStartTimeError.style.display = "none";
  newSessionEndTimeError.style.display = "none";

  editSessionDateError.style.display = "none";
  editSessionStartTimeError.style.display = "none";
  editSessionEndTimeError.style.display = "none";
}