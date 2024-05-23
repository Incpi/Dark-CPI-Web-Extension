'use strict';
const logger = new Logger("CPI_Dark_mode");
const themeMap = {
  "0": { name: "sap_horizon", label: "Morning Horizon" },
  "1": { name: "sap_horizon_dark", label: "Evening Horizon" },
  "2": { name: "sap_fiori_3", label: "Quartz Light" }
};
const urlParams = new URLSearchParams(window.location.search);
const DarkSAPCPIParam = urlParams.get('darksapcpi');


logger.log("Initializing...");
let defaultTheme = getlocalTheme() || "1";
let interval = 3000;
let counter = 0;
let countloop = 5;


if (themeMap[DarkSAPCPIParam] || themeMap[defaultTheme]) {
  defaultTheme = DarkSAPCPIParam ? DarkSAPCPIParam : defaultTheme;
} else {
  logger.warn(`Invalid theme parameter: ${DarkSAPCPIParam}`);
}

logger.log("Future Applying theme...",themeMap[defaultTheme]);
function getThemeByValue(value) {
  try {
    return Object.keys(themeMap).find(key => themeMap[key].name === value);
  } catch (error) {
    logger.error("Error in getThemeByValue:", error);
  }
}

function getSAPTheme() {
  try {
    logger.log("Getting SAP theme...");
    return sap.ui.getCore().getConfiguration().getTheme();
  } catch (error) {
    logger.error("Error in getSAPTheme:", error);
  }
}
function getlocalTheme() {
  return localStorage.getItem("sap-DarkSAPCPI-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches === true ? '1' : '0');
}

function setlocalTheme(newTheme) {
  localStorage.setItem("sap-DarkSAPCPI-theme", newTheme);
}

async function applyTheme(key) {
  try {
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

const executeFunction = async () => {
  try {
    logger.log("Executing function...");
    await applyTheme(defaultTheme)
    counter++;
    if (counter >= countloop) {
      logger.log("Clearing interval...");
      clearInterval(intervalId);
      interval = 300000;
      logger.log("New interval set:", interval);
    }
  } catch (error) {
    logger.error("Error in executeFunction:", error);
  }
};

let intervalId = setInterval(executeFunction, interval);