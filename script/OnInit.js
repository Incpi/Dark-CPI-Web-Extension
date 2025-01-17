"use strict";

console.log("Initializing OnInit.js...");

// Set up a listener for custom events
function setupChromeApiListener() {
  window.addEventListener("requestDataChromeApi", (event) => {
    if (event.detail?.request === "chromeExtensionURL") {
      try {
        const detail = { url: chrome.runtime.getURL("/") };
        window.dispatchEvent(new CustomEvent("responseDataChromeApi", { detail }));
      } catch (error) {
        console.error("Error fetching Chrome extension URL:", error);
      }
    }
  });
}

// Initialize the listener
setupChromeApiListener();
