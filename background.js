"use strict";

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const regexPatterns = [
      /^https:\/\/.*\.hana\.ondemand\.com\/itspaces\/shell\/.*/,
      /^https:\/\/.*\.hana\.ondemand\.com\/shell\/.*/,
      /^https:\/\/.*\.platform\.sapcloud\.cn\/itspaces\/shell\/.*/,
      /^https:\/\/.*\.platform\.sapcloud\.cn\/shell\/.*/,
    ];

    const isMatch = regexPatterns.some((pattern) => pattern.test(tab.url));

    if (isMatch) {
      try {
        // Send a message to check if the script is already injected
        await browser.tabs.sendMessage(tabId, { action: "checkInjected" });
      } catch (error) {
        console.log("Injecting files...");

        try {
          // Inject the scripts using browser.scripting (compatible with Firefox)
          await browser.scripting.executeScript({
            target: { tabId },
            files: ["script/OnInit.js"],
          });

          await browser.scripting.executeScript({
            target: { tabId },
            files: ["script/main_script.js"],
            world: "MAIN", // Optional: define the execution world
          });
        } catch (error) {
          console.log("Error injecting scripts:", error);
        }
      }
    }
  }
});
