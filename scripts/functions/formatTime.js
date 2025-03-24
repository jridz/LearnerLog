// Format the time string from 24-hour to 12-hour format
export function formatTime(timeString) {
  // Separate hour and minutes from timeString
  const [hour, minute] = timeString.split(":");

  // Convert hour from string to integer
  let intHour = parseInt(hour);

  // Determine if AM or PM
  let period = "AM";
  if (intHour > 12) {
    intHour -= 12;
    period = "PM";
  }

  // Display 0 hours as 12 AM
  if (intHour === 0) {
    intHour = 12;
  }

  // Format 12-hour time string
  return `${intHour}:${minute} ${period}`;
}