import {newTripForm} from "../app2.js";

// Check if the date is invalid
export function checkDateInvalid(date) {
  // Check that date is not null
  if (!date) {
    newTripForm.reset();
    // As date is invalid, we return true
    return true;
  }
  // Else
  return false;
}