import {newTripForm} from "../app2.js";

// Check if the times are invalid
export function checkTimesInvalid(startTime, endTime) {
  // Check that end time is after start time and neither is null
  if (!startTime || !endTime || startTime > endTime) {
    newTripForm.reset();
    alert("Times invalid");
    // As times are invalid, we return true
    return true;
  }
  // Else
  return false;
}