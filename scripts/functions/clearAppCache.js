import {showConfirmationDialog} from "./showConfirmationDialog.js";
import {toast} from "../components/toast.js";

export async function clearAppCache() {
  showConfirmationDialog("Are you sure you want to clear the app cache? This will remove all offline assets and pages, not your app data.", function (confirmed) {
    if (confirmed) {
      caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (cacheName) {
          caches.delete(cacheName);
        });
      });
      toast("App cache cleared", "green");
    } else {
      toast("Cancelled action", "red");
    }
  });
}