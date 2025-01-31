sap.ui.define([], function () {
  "use strict";

  return {
    setData: (key, value) =>
      new Promise((resolve, reject) => {
        console.log("Main Script: Dispatching storeData event");
        window.dispatchEvent(new CustomEvent("storeData", { detail: { key, value } }));

        const timeout = setTimeout(() => reject(new Error("storeDataResponse timeout")), 2000);
        window.addEventListener(
          "storeDataResponse",
          (event) => {
            clearTimeout(timeout);
            const { success, message } = event.detail;
            success ? resolve(message) : reject(new Error(message));
          },
          { once: true }
        );
      }),

    getData: (key) =>
      new Promise((resolve, reject) => {
        console.log("Main Script: Dispatching getData event");
        window.dispatchEvent(new CustomEvent("getData", { detail: { key } }));

        const timeout = setTimeout(() => reject(new Error("getDataResponse timeout")), 2000);
        window.addEventListener(
          "getDataResponse",
          (event) => {
            clearTimeout(timeout);
            const { success, value, message } = event.detail;
            resolve(success ? value : null);
          },
          { once: true }
        );
      }),

    getManifest: () =>
      new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timeout: Failed to get Chrome extension URL")), 200);
        const listener = (event) => {
          window.removeEventListener("getManifest", listener);
          clearTimeout(timeout);
          resolve(event.detail.version);
        };
        window.addEventListener("getManifest", listener);
        window.dispatchEvent(new CustomEvent("getManifest", { detail: { request: "getManifest" } }));
      }),
  };
});