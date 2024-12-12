sap.ui.loader.config({
  paths: {
    eventHandlers: `${$.sap.chromeExtensionURL}utils/eventHandlers`,
    constants: `${$.sap.chromeExtensionURL}utils/constants`,
    autoClose: `${$.sap.chromeExtensionURL}utils/autoClose`,
  },
});
sap.ui.define(["eventHandlers", "autoClose", "constants", "sap/m/Button"], function(eventHandlers, autoClose, constants, Button) {
  "use strict";
  console.log("Start ui script");
  const core = sap.ui.getCore();
  const storedTheme = localStorage.getItem(`${constants.prefixId}Theme`) || "sap_horizon";
  const DarkCPIVersion = localStorage.getItem(`${constants.prefixId}Version`) || 0;
  const interval = setInterval(() => {
    core.applyTheme(storedTheme);
    autoClose.retryAutocloseNavButton();
  }, 500);
  setTimeout(() => clearInterval(interval), 5000);

  return {
    header: async (id) => {
      let idSpacer = "__spacer0";
      if (core.byId(`${constants.prefixId}header`)) return;
      const toolHeader = core.byId(id);
      const indexContent = toolHeader.indexOfContent(core.byId(idSpacer));
      if (core.byId(`${constants.prefixId}ExtButton`)) return;
      const ExtensionButton = new Button(`${constants.prefixId}ExtButton`, {
        icon: storedTheme === "sap_horizon_dark" ? "sap-icon://dark-mode" : "sap-icon://light-mode", // Default icon
        type: "Transparent", text: "DC", tooltip: "Dark CPI Control Panel", press: () => eventHandlers.new_theme(),
      });

      toolHeader.insertContent(ExtensionButton, indexContent + 1);
      if (DarkCPIVersion !== constants.manifestVersion) {
        setTimeout(() => eventHandlers.new_theme("whatsNew"), 500);
      }
    },
  };
});
