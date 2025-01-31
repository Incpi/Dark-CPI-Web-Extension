"use strict";

if (!window.DarkCPIApp) {
  const DarkCPIApp = {
    urlDetectType: (url) => {
      let cpiCollectionURIRegexp = /\/contentpackage\/(?<artifactId>[0-9a-zA-Z_\-.]+)/;
      const cpiArtifactURIRegexp = [
        //Artifacts
        [/\/integrationflows\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "IFlow"],
        [/\/odataservices\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "ODATA_API"],
        [/\/restapis\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "REST_API"],
        [/\/soapapis\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "SOAP_API"],
        [/\/valuemappings\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "Value_Mapping"],
        [/\/scriptcollections\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "Script_Collection"],
        [/\/messagemappings\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "Message_Mapping"], //resources
        [/\/resources\/mapping\/(?<artifactId>[0-9a-zA-Z_\-.]+\.mmap?)/, "M_Mapping"],
        [/\/resources\/mapping\/(?<artifactId>[0-9a-zA-Z_\-.]+\.opmap?)/, "Operation_Mapping"],
        [/\/resources\/script\/(?<artifactId>[0-9a-zA-Z_\-.]+)/, "Script"],
        [/\/resources\/mapping\/(?<artifactId>[0-9a-zA-Z_\-.]+\.xslt?)/, "XSLT"], //packages
        [/\/contentpackage\/(?<artifactId>[0-9a-zA-Z_\-.]+)\/?(\?.*)?$/, "Package"],
      ];
      let groups, result, artifactType, packageId;
      for (const dataRegexp of cpiArtifactURIRegexp) {
        if (dataRegexp[0].test(url) === true) {
          let groupIds = url.match(dataRegexp[0]).groups;
          if (cpiCollectionURIRegexp.test(url) === true) packageId = url.match(cpiCollectionURIRegexp).groups.artifactId;
          return {
            packageId: packageId,
            artifactId: groupIds.artifactId,
            artifactType: dataRegexp[1],
          };
        }
      }
    }, // Check if SAPUI5 is available
    isSapui5Available: () => typeof sap !== "undefined" && sap.ui,

    // Fetch the Chrome extension URL
    getChromeExtensionURL: () =>
      new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject("Cannot get Chrome extension URL"), 200);
        const listener = (event) => {
          window.removeEventListener("responseDataChromeApi", listener);
          clearTimeout(timeout);
          resolve(event.detail);
        };
        window.addEventListener("responseDataChromeApi", listener);
        window.dispatchEvent(new CustomEvent("requestDataChromeApi", { detail: { request: "chromeExtensionURL" } }));
      }),

    // Handle URL change logic
    handleURLChange: ({ newURL = window.location.href, ui = null }) => {
      // Call the function to get the DarkCPIData based on the new URL
      let DarkCPIData = DarkCPIApp.urlDetectType(newURL);
      if (ui) {
        ui.onetime();
        const functionRegistry = {
          IFlow: (ui) => ui.addButtonsIflowDesigner(),
          ODATA_API: (ui) => ui.addButtonsIflowDesigner(),
          REST_API: (ui) => ui.addButtonsIflowDesigner(),
          SOAP_API: (ui) => ui.addButtonsIflowDesigner(), // Value_Mapping: (ui) => console.log("Handling Value Mapping"),
          // Script_Collection: (ui) => console.log("Handling Script Collection"),
          // Message_Mapping: (ui) => console.log("Handling Message Mapping"),
          // M_Mapping: (ui) => console.log("Handling M Mapping"),
          // Operation_Mapping: (ui) => console.log("Handling Operation Mapping"),
          // Script: (ui) => console.log("Handling Script"),
          // XSLT: (ui) => console.log("Handling XSLT"),
          // Package: (ui) => console.log("Handling Package"),
        };
        // Check if DarkCPIData has the artifactType and it exists in the function registry
        const artifactType = DarkCPIData?.artifactType;
        console.log(artifactType);
        if (artifactType && functionRegistry[artifactType]) {
          const interval = setInterval(() => {
            try {
              functionRegistry[artifactType](ui);
            } catch (error) {
              console.error("Error during retry: handleURLChange:", error);
            }
          }, 500);
          setTimeout(() => {
            clearInterval(interval);
            //console.log("Retry logic stopped after 7 seconds");
          }, 7000);
        } else {
          console.warn(`No handler found for artifact type: ${artifactType}`);
        }
      }
    },
    monitorURLChanges: () => {
      let currentURL = window.location.href;
      new MutationObserver(() => {
        const newURL = window.location.href;
        if (newURL !== currentURL) {
          currentURL = newURL;
          try {
            DarkCPIApp.handleURLChange({ newURL: newURL });
          } catch (error) {
            DarkCPIApp.handleURLChange({ newURL: newURL });
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    },
    startProcess: () => {
      DarkCPIApp.getChromeExtensionURL()
        .then((chromeExtensionURL) => {
          sap.ui
            .getCore()
            .ready()
            .then(() => {
              $.sap.DarkCPI = {
                url: chromeExtensionURL.url,
                version: chromeExtensionURL.version,
                _settings: {
                  _lastmessages: 10,
                },
              };
              sap.ui.loader.config({ paths: { ui: `${$.sap.DarkCPI.url}script/utils/ui` } });
              sap.ui.require(["ui"], async (ui) => {
                // await ui.init();
                const setupProcess = () => {
                  const header = sap.ui.getCore().byId("shell--toolHeader");
                  if (header) {
                    ui.header("shell--toolHeader");
                    DarkCPIApp.handleURLChange({ ui });
                  } else {
                    requestAnimationFrame(setupProcess);
                  }
                };
                requestAnimationFrame(setupProcess);
              });
            });
        })
        .catch((error) => {
          console.error("Error initializing process:", error);
          const retryProcess = () => {
            DarkCPIApp.startProcess();
          };
          requestAnimationFrame(retryProcess);
        });
    },
    init: () => {
      function checkAvailability() {
        if (DarkCPIApp.isSapui5Available()) {
          DarkCPIApp.startProcess();
          DarkCPIApp.monitorURLChanges();
        } else {
          console.warn("SAPUI5 not available. Retrying...");
          requestAnimationFrame(checkAvailability);
        }
      }

      requestAnimationFrame(checkAvailability);
    },
  };

  DarkCPIApp.init();
}
