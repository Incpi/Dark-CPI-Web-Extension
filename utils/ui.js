sap.ui.loader.config({
  paths: {
    eventHandlers: `${$.sap.chromeExtensionURL}utils/eventHandlers`,
    constants: `${$.sap.chromeExtensionURL}utils/constants`,
    autoClose: `${$.sap.chromeExtensionURL}utils/autoClose`,
  },
});
sap.ui.define(["eventHandlers", "autoClose", "constants", "sap/m/Button", "sap/ui/core/IconPool"], function(eventHandlers, autoClose, constants, Button, IconPool) {
  "use strict";
  console.log("Start ui script");
  const core = sap.ui.getCore();
  const storedTheme = localStorage.getItem(`${constants.prefixId}Theme`) || "sap_horizon";
  const DarkCPIVersion = localStorage.getItem(`${constants.prefixId}Version`) || 0;
  // Apply the theme and run retry logic
  const interval = setInterval(() => {
    core.applyTheme(storedTheme);
    autoClose.retryAutocloseNavButton();
  }, 500);
  setTimeout(() => clearInterval(interval), 7000);
  IconPool.addIcon("logo-icon", "darkcpi", "darkcpi", "e0001");
  // IconPool.addIcon("logo-icon-1", "darkcpi", "darkcpi", "e0002");
  IconPool.addIcon("logo-icon-2", "darkcpi", "darkcpi", "e0003");
  return {
    header: async (id) => {
      let idSpacer = "__spacer0";
      if (core.byId(`${constants.prefixId}header`)) return;
      const toolHeader = core.byId(id);
      const indexContent = toolHeader.indexOfContent(core.byId(idSpacer));
      if (core.byId(`${constants.prefixId}ExtButton`)) return;
      const ExtensionButton = new Button(`${constants.prefixId}ExtButton`, {
        icon: "sap-icon://darkcpi/logo-icon", type: "Default", text: "DC", tooltip: "Dark CPI Control Panel",
        press: () => eventHandlers.new_theme(),
      });

      toolHeader.insertContent(ExtensionButton, indexContent + 1);
      if (DarkCPIVersion !== constants.manifestVersion) {
        setTimeout(() => eventHandlers.new_theme("whatsNew"), 1000);
      }
    },
  };
});
