"use strict";
console.log("Start auxiliary_script script");

window.addEventListener("requestDataChromeApi", (event) => {
  if (event.detail.request == "chromeExtensionURL") {
    let detail = {};
    try {
      detail.url = chrome.runtime.getURL("/");
      window.dispatchEvent(new CustomEvent("resposeDataChromeApi", { detail }));
    } catch (error) {
      console.log(error);
    }
  }
});
