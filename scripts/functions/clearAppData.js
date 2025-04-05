import {showConfirmationDialog} from "./showConfirmationDialog.js";
import {toast} from "../components/toast.js";

export async function clearAppData() {
  showConfirmationDialog("Are you sure you want to clear all app data? THIS CANNOT BE UNDONE.", function (confirmed) {
    if (confirmed) {
      window.localStorage.clear()
      toast("All app data cleared", "green");
    } else {
      toast("Cancelled action", "red");
    }
  });
}