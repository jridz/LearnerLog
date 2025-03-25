export const dateError = document.getElementById('dateError');
export const startTimeError = document.getElementById('startTimeError');
export const endTimeError = document.getElementById('endTimeError');

// Check if the date is invalid
export function resetErrors() {
  dateError.style.display = "none";
  startTimeError.style.display = "none";
  endTimeError.style.display = "none";
}