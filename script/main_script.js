"use strict";

// Check if SAPUI5 is available
window.sapui5Check = () => !!window.sap;

// Fetch the Chrome extension URL
window.askChromeExtensionURL = () => {
  return new Promise((resolve, reject) => {
    const listener = (event) => {
      window.removeEventListener("responseDataChromeApi", listener);
      resolve(event.detail.url);
    };
    window.addEventListener("responseDataChromeApi", listener);

    const detail = { request: "chromeExtensionURL" };
    window.dispatchEvent(new CustomEvent("requestDataChromeApi", { detail }));

    setTimeout(() => reject("Cannot get Chrome extension URL"), 200);
  });
};

// Start the main process
window.startProcess = async () => {
  try {
    console.log("Starting the SAPUI5 initialization process...");

    // Get the Chrome extension URL
    const chromeExtensionURL = await window.askChromeExtensionURL();

    // Wait for SAPUI5 to be ready
    await sap.ui.getCore().ready();

    // Configure SAPUI5 loader paths
    $.sap.chromeExtensionURL = chromeExtensionURL;
    sap.ui.loader.config({
      paths: {
        ui: `${chromeExtensionURL}utils/ui`,
      },
    });

    // Load and execute the "ui" module
    sap.ui.require(["ui"], (ui) => {
      const process = () => {
        const header = sap.ui.getCore().byId("shell--toolHeader");
        if (header) {
          ui.header("shell--toolHeader");
        } else {
          setTimeout(process, 250);
        }
      };
      process();
    });
  } catch (error) {
    console.error("Error in startProcess:", error);
    setTimeout(window.startProcess, 1000); // Retry with exponential backoff
  }
};

// Start execution
setTimeout(() => {
  console.log("Checking SAPUI5...");
  if (window.sapui5Check()) {
    window.startProcess();
  } else {
    setTimeout(() => window.startProcess(), 200);
  }
}, 200);
