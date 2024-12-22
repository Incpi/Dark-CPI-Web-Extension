"use strict";
console.log("Start initial script");

window.addEventListener("requestDataChromeApi", (event) => {
  if (event.detail.request == "DARKCPI") {
    let detail;
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
        detail = chrome.runtime.getURL("/");  // Get extension's URL in Chrome
      } else if (typeof browser !== "undefined" && browser.runtime && browser.runtime.getURL) {
        detail = browser.runtime.getURL("/");  // Get extension's URL in Firefox
      }
      window.dispatchEvent(new CustomEvent("resposeDataChromeApi", { detail }));
    } catch (error) {
      console.log("Error while fetching extension URL:", error);
    }
  }
});