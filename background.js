"use strict";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const regexPatterns = [
      /^https:\/\/.*\.hana\.ondemand\.com\/itspaces\/shell\/.*/,
      /^https:\/\/.*\.hana\.ondemand\.com\/shell\/.*/,
      /^https:\/\/.*\.platform\.sapcloud\.cn\/itspaces\/shell\/.*/,
      /^https:\/\/.*\.platform\.sapcloud\.cn\/shell\/.*/,
    ];
    const isMatch = regexPatterns.some(pattern => pattern.test(tab.url));
    if (isMatch) {
      try {
        await chrome.tabs.sendMessage(tabId, { action: "checkInjected" });
      } catch (error) {
        console.log("injecting files...");
        try {
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ["script/OnInit.js"],
          });
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ["script/main_script.js"],
            world: "MAIN",
          });
        } catch (error) {
          console.log(error);
        }

      }
    }
  }
});