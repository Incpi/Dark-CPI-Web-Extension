"use strict";
window.sapui5Check = () => {
  return this.sap;
};

window.askChromeExtensionURL = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("resposeDataChromeApi", (event) => {
      window.removeEventListener("resposeDataChromeApi", this);
      resolve(event.detail.url);
    });
    let detail = {};
    detail.request = "chromeExtensionURL";
    window.dispatchEvent(new CustomEvent("requestDataChromeApi", { detail }));
    setTimeout(() => reject("Cannot get chrome extension URL"), 200);
  });
};

window.startProcess = () => {
  askChromeExtensionURL()
    .then((chromeExtensionURL) => {
      sap.ui
        .getCore()
        .ready()
        .then(() => {
          $.sap.chromeExtensionURL = chromeExtensionURL;
          sap.ui.loader.config({
            paths: {
              ui: `${$.sap.chromeExtensionURL}utils/ui`,
            },
          });
          sap.ui.require(["ui"], function(ui) {
            const process = () => {
              if (sap.ui.getCore().byId("shell--toolHeader")) {
                ui.header("shell--toolHeader");
              }
              setTimeout(() => process(), 250);
            };
            setTimeout(() => process(), 500);
          });
        });
    })
    .catch((message) => {
      console.log(message);
      window.startProcess();
    });
};

//this is the start execute script
setTimeout(() => {
  console.log("Start check sapui5");
  if (window.sapui5Check() == undefined) setTimeout(() => window.sapui5Check(), 200); else window.startProcess();
}, 200);
