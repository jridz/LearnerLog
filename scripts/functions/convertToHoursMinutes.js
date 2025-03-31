export function convertToHoursMinutes(ms) {
  let totalMinutes = ms / (1000 * 60); // Convert to minutes
  let hours = Math.floor(totalMinutes / 60);
  let minutes = Math.floor(totalMinutes % 60);

  if (hours > 0 && minutes > 0) {
    if (hours === 1 && minutes === 1) {
      return `${hours} hour and ${minutes} minute`;
    } else if (hours === 1) {
      return `${hours} hour and ${minutes} minutes`;
    } else if (minutes === 1) {
      return `${hours} hours and ${minutes} minute`;
    } else return `${hours} hours and ${minutes} minutes`;
  } else if (hours > 0) {
    if (hours === 1) {
      return `${hours} hour`;
    } else return `${hours} hours`;
  } else {
    if (minutes === 1) {
      return `${minutes} minute`;
    } else return `${minutes} minutes`;
  }
}