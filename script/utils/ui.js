const baseURL = $.sap.DarkCPI.url;
let paths = ["script/component/codeEditor", "script/utils/const_new", "script/component/ExToast", "script/component/formatCode", "script/component/model", "script/component/RequestQueue", "script/feature/autoClose", "script/utils/constants", "script/utils/timeConvert", "script/utils/common", "script/utils/apiCall", "script/utils/link", "script/feature/newPopupEvent", "script/feature/eventHandlers", "script/feature/powerTraceHandler"];
let updatedPaths = {};
paths.forEach((path) => {
  const lastSegment = path.substring(path.lastIndexOf("/") + 1);
  updatedPaths[lastSegment] = `${baseURL}${path}`;
});

// Configure the loader with the updated paths
sap.ui.loader.config({ paths: updatedPaths });
sap.ui.define(["eventHandlers", "RequestQueue", "autoClose", "newPopupEvent", "constants", "sap/m/Button", "sap/ui/core/IconPool"], function (eventHandlers, RequestQueue, autoClose, newPopupEvent, constants, Button, IconPool) {
  "use strict";
  const core = sap.ui.getCore();
  const storedTheme = localStorage.getItem(`${constants.prefixId}Theme`) || "sap_horizon";
  const DarkCPIVersion = localStorage.getItem(`${constants.prefixId}Version`) || 0;
  // let intervalId = null;
  const onetime = () => {
    core.applyTheme(storedTheme);
    autoClose.retryAutocloseNavButton();
    IconPool.addIcon("logo-icon", "darkcpi", "darkcpi", "e0001");
    IconPool.addIcon("logo-icon-2", "darkcpi", "darkcpi", "e0003");
  };
  const header = async (id) => {
    let idSpacer = "__spacer0";
    if (core.byId(`${constants.prefixId}header`)) return;
    const toolHeader = core.byId(id);
    const indexContent = toolHeader.indexOfContent(core.byId(idSpacer));
    if (core.byId(`${constants.prefixId}ExtButton`)) return;

    const ExtensionButton = new Button(`${constants.prefixId}ExtButton`, {
      icon: "sap-icon://darkcpi/logo-icon",
      type: "Default",
      text: "DC",
      tooltip: "Dark CPI Control Panel",
      press: async () => await newPopupEvent.popup_settings(),
    });

    toolHeader.insertContent(ExtensionButton, indexContent + 1);
    if (DarkCPIVersion !== $.sap.DarkCPI.version) {
      setTimeout(async () => {
        const theme = await RequestQueue.getData("theme");
        if (theme) {
          core.applyTheme(theme);
          localStorage.setItem(`${constants.prefixId}Theme`, theme);
        }
        await newPopupEvent.popup_settings("whatsNew");
      }, 1000);
    }
  };
  const addButtonsIflowDesigner = () => {
    let id = document.querySelector("[id$='--iflowObjectPageHeader']")?.id;
    if (id) {
      const pageHeader = core.byId(id);
      const buttonConfigs = [
        {
          id: "info", // text:"info",
          icon: "sap-icon://message-information",
          pressHandler: eventHandlers.infoButton,
          type: "Transparent",
          tooltip: "Object Information",
        },
        {
          id: `message`, // text:`message`,
          icon: "sap-icon://message-popup",
          pressHandler: eventHandlers.messageButton,
          type: "Transparent",
          tooltip: "Quick Messages view",
        },
        {
          buttonType: 0,
          id: `trace`, // text:`trace`,
          icon: "sap-icon://text",
          pressHandler: eventHandlers.powerTrace,
          type: "Transparent",
          tooltip: "Enable auto Trace",
        },
      ];
      buttonConfigs.forEach((config) => {
        const Id = `${constants.prefixId}_${config.id}_Button`;
        if (!core.byId(Id)) {
          try {
            if (config.buttonType === 0) {
              const button = new sap.m.ToggleButton(Id, {
                icon: config.icon,
                text: config.text,
                type: config.type,
                press: config.pressHandler,
                tooltip: config.tooltip,
              });
              pageHeader.insertAction(button);
            }

            const button = new Button(Id, {
              icon: config.icon,
              text: config.text,
              type: config.type,
              press: config.pressHandler,
              tooltip: config.tooltip,
            });
            pageHeader.insertAction(button);
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  };
  return {
    onetime,
    header,
    addButtonsIflowDesigner,
  };
});
