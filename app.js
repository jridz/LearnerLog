export const STORAGE_KEY = "learnerlog";

export function toast(message, color) {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#e3e3e3\">" +
    "<path d=\"M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\"/>" +
    "</svg>" + `<p>${message}</p>`;
  toast.style.backgroundColor = color;

  // Add to DOM
  document.body.appendChild(toast);

  // Add entrance animation class (define this in your CSS)
  toast.classList.add("toast-enter");

  // Set a timeout to remove the toast
  setTimeout(() => {
    // Add exit animation class (define this in your CSS)
    toast.classList.add("toast-exit");

    // Remove from DOM after animation completes
    toast.addEventListener('animationend', () => {
      document.body.removeChild(toast);
    });
  }, 3000); // Adjust the duration as needed
}

export function convertTo12HourFormat(timeString) {
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

export function formatDate(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Format the date into a locale-specific string
  return date.toLocaleDateString();
}

export function showConfirmationDialog(message, callback) {
  const userConfirmed = confirm(message);
  callback(userConfirmed);
}

export function getAllStoredSessions() {
  // Get the string of session data from localStorage
  const data = window.localStorage.getItem(STORAGE_KEY);

  // If no sessions were stored, default to an empty array
  // Otherwise, return the stored data as parsed JSON
  return data ? JSON.parse(data) : [];
}

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/LearnerLog/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}