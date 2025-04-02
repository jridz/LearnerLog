import {editSessionDateError, newSessionDateError} from "./resetErrors.js";

// Check if the date is invalid
export function dateValid(date) {
  // Check that date is not null
  if (!date) {
    newSessionDateError.style.display = "flex";
    editSessionDateError.style.display = "flex";
    return false;
  }

  return true;
}