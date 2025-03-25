import {startTimeError} from "./resetErrors.js";
import {endTimeError} from "./resetErrors.js";

// Check if the times are invalid
export function timeValid(startTime, endTime) {
  // Check that end time is after start time and neither is null
  if (!startTime || !endTime || startTime > endTime) {
    if (!startTime) {
      startTimeError.style.display = "flex";
    }
    if (!endTime) {
      endTimeError.style.display = "flex";
    }
    if (startTime > endTime) {
      startTimeError.style.display = "flex";
      startTimeError.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"15px\" viewBox=\"0 -960 960 960\" width=\"15px\"\n" +
        "                         fill=\"#e3e3e3\">\n" +
        "                        <path d=\"M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\"/>\n" +
        "                    </svg> Error: Start time must be before end time";
    }

    return false;
  }

  return true;
}