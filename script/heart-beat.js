'use strict';

// Logger instance for logging messages
const logger = new Logger("CPI_Dark_mode");

// Theme configuration
const themeConfig = {
  "0": { name: "sap_horizon", label: "Morning Horizon" },
  "1": { name: "sap_horizon_dark", label: "Evening Horizon" },
  "2": { name: "sap_fiori_3", label: "Quartz Light" }
};

// URL parameters
const urlParams = new URLSearchParams(window.location.search);
const darkCPIParam = urlParams.get('darkcpi');
let retryCount = 0;

// Initialize variables
logger.log("Initializing...");
let selectedTheme = getLocalTheme() || "1";
const executionInterval = 3000;

// Set the default theme based on URL parameter or local theme
if (themeConfig[darkCPIParam]) {
  selectedTheme = darkCPIParam;
} else if (themeConfig[selectedTheme]) {
} else {
  logger.warn(`Invalid theme parameter: ${darkCPIParam}`);
}

logger.log("Applying theme...", themeConfig[selectedTheme]);

// Helper functions
function setMetaTag(themeKey) {
  const existingMetaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
  if (!existingMetaTag) {
    const newMetaTag = document.createElement('meta');
    newMetaTag.name = 'SapDarkCPITheme';
    newMetaTag.content = themeKey;
    document.head.appendChild(newMetaTag);
  }
}

function getThemeKeyByName(themeName) {
  return Object.keys(themeConfig).find(key => themeConfig[key].name === themeName);
}

function getCurrentSAPTheme() {
  logger.log("Retrieving SAP theme...");
  return sap.ui.getCore().getConfiguration().getTheme();
}

function getLocalTheme() {
  const storedTheme = localStorage.getItem("SapDarkCPITheme");
  if (storedTheme && themeConfig[storedTheme]) {
    return storedTheme;
  } else {
    return '0'; // default theme
  }
}

function setLocalTheme(themeKey) {
  localStorage.setItem("SapDarkCPITheme", themeKey);
}

function retryAutocloseNavButton() {
  try {
    const navigationList = sap.ui.getCore().byId('shell--navigationList');
    if (navigationList && navigationList.mProperties.expanded) {
      sap.ui.getCore().byId("__button0").firePress();
      logger.info("Navigation button closed");
    }
  } catch (e) {
    logger.error(`Failed to execute retryAutocloseNavButton on attempt ${retryCount + 1}: ${e.message}`);
  } finally {
    retryCount++;
    if (retryCount <= 5) {
      setTimeout(retryAutocloseNavButton, 500);
    }
  }
}

retryAutocloseNavButton();

// Apply the selected theme
async function applyTheme(themeKey) {
  try {
    setMetaTag(themeKey);
    logger.log("Setting theme:", themeConfig[getThemeKeyByName(themeConfig[themeKey].name)].label);
    const currentSAPTheme = getCurrentSAPTheme();
    if (currentSAPTheme !== themeConfig[themeKey].name || themeConfig[themeKey] !== getLocalTheme()) {
      document.querySelector('#shellcontent').setAttribute('data-cpi-dark', themeConfig[themeKey].name);
      sap.ui.getCore().attachInit(() => sap.ui.getCore().applyTheme(themeConfig[themeKey].name));
      setLocalTheme(themeKey);
      sap.ui.getCore().attachInit(() => {
        if (!sap.ui.getCore().byId('DarkCPI_Navbutton')) {
          var oButton = new sap.m.Button("DarkCPI_Navbutton", {
            text: "DARK CPI",
            press: () => { document.querySelector('#darkcpiglobal').setAttribute('data-condition', true); },
          });
          var oContainer = sap.ui.getCore().byId("shell--toolHeader"); // Replace with your container's ID
          oContainer && (typeof oContainer.insertContent === 'function') ? oContainer.insertContent(oButton, 4) : console.error("The container does not support adding items or content.");
          oContainer.attachEvent("_change", function (oEvent) {
            var sReason = oEvent.getParameter("reason");
            var oChild = oEvent.getParameter("child");
            if (sReason === "remove" && oChild && oChild.getId() === "DarkCPI_Navbutton") {
              setTimeout(function () {
                (typeof oContainer.insertContent === 'function') ? oContainer.insertContent(oButton, 4) : console.error("The container does not support adding items or content.");
              }, 10);
            }
          });
        }
      });
      logger.log("Current theme:", themeConfig[getThemeKeyByName(getCurrentSAPTheme())].label);
    }
  } catch (error) {
    logger.error("Error in applyTheme:", error);
  }
}
// Execute the main function to apply the theme
const executeMainFunction = async () => {
  try {
    logger.log("Executing main function...");
    const metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
    if (metaTag) {
      selectedTheme = metaTag.content;
    }
    await applyTheme(selectedTheme);
  } catch (error) {
    logger.error("Error in executeMainFunction:", error);
  }
};

// Set interval to repeatedly execute the main function
const intervalId = setInterval(executeMainFunction, executionInterval);
