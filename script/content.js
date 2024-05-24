// Handle data without any misses
'use strict';
const logger = new Logger("CPI_Dark_mode");

// Define constants
const themeMap = {
  "0": { name: "sap_horizon", label: "Morning Horizon" },
  "1": { name: "sap_horizon_dark", label: "Evening Horizon" },
  "2": { name: "sap_fiori_3", label: "Quartz Light" }
};
const urlParams = new URLSearchParams(window.location.search);
const DarkCPIParam = urlParams.get('DarkCPI');

// Initialize variables
logger.log("Initializing...");
let defaultTheme = getlocalTheme() || "1";
let interval = 3000;

// Set default theme
if (themeMap[DarkCPIParam] || themeMap[defaultTheme]) {
  defaultTheme = DarkCPIParam ? DarkCPIParam : defaultTheme;
} else {
  logger.warn(`Invalid theme parameter: ${DarkCPIParam}`);
}

logger.log("Future Applying theme...", themeMap[defaultTheme]);

// Helper functions
function metaTag(key) {
  const metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
  if (!metaTag) {
    const newMetaTag = document.createElement('meta');
    newMetaTag.name = 'SapDarkCPITheme';
    newMetaTag.content = key;
    document.head.appendChild(newMetaTag);
  }
}

function getThemeByValue(value) {
  return Object.keys(themeMap).find(key => themeMap[key].name === value);
}

function getSAPTheme() {
  logger.log("Getting SAP theme...");
  return sap.ui.getCore().getConfiguration().getTheme();
}

function getlocalTheme() {
  return localStorage.getItem("SapDarkCPITheme") || (window.matchMedia("(prefers-color-scheme: dark)").matches === true ? '1' : '0');
}

function setlocalTheme(newTheme) {
  localStorage.setItem("SapDarkCPITheme", newTheme);
}

// Apply theme function
async function applyTheme(key) {
  try {
    metaTag(key)
    logger.log("Setting theme with key:", themeMap[getThemeByValue(themeMap[key].name)].label);
    if (getSAPTheme() !== themeMap[key].name || themeMap[key] !== getlocalTheme()) {
      document.querySelector('#shellcontent').setAttribute('data-cpi-dark', themeMap[key].name);
      sap.ui.getCore().attachInit(() => sap.ui.getCore().applyTheme(themeMap[key].name));
      setlocalTheme(key);
      logger.log("Current theme:", themeMap[getThemeByValue(getSAPTheme())].label);
    }
  } catch (error) {
    logger.error("Error in applyTheme:", error);
  }
}

// Execute function
const executeFunction = async () => {
  try {
    logger.log("Executing function...");
    defaultTheme = document.querySelector('meta[name="SapDarkCPITheme"]').content || defaultTheme;
    await applyTheme(defaultTheme)
  }
  catch (error) {
    logger.error("Error in executeFunction:", error);
  }
};

// Set interval for executing function
let intervalId = setInterval(executeFunction, interval);
