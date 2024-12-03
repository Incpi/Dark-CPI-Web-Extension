"use strict";
// URL parameters
const urlParams = new URLSearchParams(window.location.search);
const darkCPIParam = urlParams.get("darkcpi");
let retryCount = 1;

// Initialize variables
let selectedTheme = getLocalTheme() || "1";

// Set the default theme based on URL parameter or local theme
if (themeConfig[darkCPIParam]) {
  selectedTheme = darkCPIParam;
} else if (themeConfig[selectedTheme]) {
} else {
  logger.warn(`Invalid theme parameter: ${darkCPIParam}`);
}

logger.log("Applying theme...", themeConfig[selectedTheme]);

// Helper functions

function getCurrentSAPTheme() {
  logger.log("Retrieving SAP theme...");
  return sap.ui.getCore().getConfiguration().getTheme();
}
let timeoutId;
function retryAutocloseNavButton() {
  try {
    const navigationList = sap.ui.getCore().byId("shell--navigationList");
    if (navigationList && navigationList.mProperties.expanded) {
      sap.ui.getCore().byId("__button0").firePress();
      logger.info("Navigation button closed");
      clearTimeout(timeoutId);
      return;
    } else if (sap.ui.getCore().byId("__navigation0").mProperties.expanded) {
      sap.ui.getCore().byId("container-app---app--sideNavigationToggleButton").firePress();
      logger.info("Navigation button closed");
      clearTimeout(timeoutId);
      return;
    } else {
      logger.info("Navigation button closure Failed");
    }
  } catch (error) {
    logger.error(`Failed to execute retryAutocloseNavButton on attempt ${retryCount}: ${error.message}`);
  }
  retryCount++;
  if (retryCount <= 10) {
    timeoutId = setTimeout(retryAutocloseNavButton, 800);
  } else {
    clearTimeout(timeoutId);
  }
}

function extrathings(themeKey) {
  document.querySelector("html").setAttribute("data-cpi-dark", themeConfig[themeKey].name);
  sap.ui.getCore().attachInit(() => {
    sap.ui.getCore().applyTheme(themeConfig[themeKey].name);
    if (!sap.ui.getCore().byId("DarkCPI_Navbutton")) {
      var oButton = new sap.m.Button("DarkCPI_Navbutton", {
        text: "DC",
        press: () => {
          document.querySelector("#darkcpiglobal").setAttribute("data-condition", true);
        },
      });
      var oContainer = sap.ui.getCore().byId("shell--toolHeader");
      var appcpiContainer = sap.ui.getCore().byId("container-app---app--appHeader");
      if (oContainer && typeof oContainer.insertContent === "function") {
        oContainer.insertContent(oButton, 4);
      } else if (appcpiContainer && typeof appcpiContainer.insertContent === "function") {
        appcpiContainer.insertContent(oButton, 5);
        oContainer = appcpiContainer;
      } else {
        console.error("The container does not support adding items or content.");
      }
      oContainer.attachEvent("_change", function (oEvent) {
        var sReason = oEvent.getParameter("reason");
        var oChild = oEvent.getParameter("child");
        if (sReason === "remove" && oChild && oChild.getId() === "DarkCPI_Navbutton") {
          setTimeout(function () {
            typeof oContainer.insertContent === "function" ? oContainer.insertContent(oButton, 4) : console.error("The container does not support adding items or content.");
          }, 10);
        }
      });
    }
  });
}

retryAutocloseNavButton();
