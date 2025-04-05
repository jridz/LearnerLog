export function showConfirmationDialog(message, callback) {
  const userConfirmed = confirm(message);
  callback(userConfirmed);
}