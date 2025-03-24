// Format the date string into a locale-specific string
export function formatDate(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Format the date into a locale-specific string
  return date.toLocaleDateString();
}