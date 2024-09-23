"use strict";
const lunchpadtheme = {
  1: { name: "sap_fiori_3_dark", label: "Quartz Dark" },
  2: { name: "sap_fiori_3", label: "Quartz Light" },
};

const cpithemes = {
  0: { name: "sap_horizon", label: "Morning Horizon" },
  1: { name: "sap_horizon_dark", label: "Evening Horizon" },
  2: { name: "sap_fiori_3", label: "Quartz Light" },
};

const hostmap = [
  [/(.*)launchpad\.cfapps.*\.hana\.ondemand\.com/, "launchpad"],
  [/(.*)\.(hci|integrationsuite(-trial)?).*shell/, "cpi"],
  [/.*(pimas|intas){1}.*\.cfapps.*\.hana\.ondemand\.com/, "cpi_app"],
]

const executionInterval = 4000;

// Logger instance for logging messages
const logger = new Logger("CPI_Dark_mode");
logger.log("Initializing...");
const application = () => {
  groups = "";
  let artifactType = "";
  const url = location.hostname;
  for (const dataRegexp of hostmap) {
    if (dataRegexp[0].test(url) === true) {
      var groups = url.match(dataRegexp[0]);
      artifactType = dataRegexp[1];
    }
  }
  return artifactType || undefined;
};

// Theme configuration
const themeConfig = getThemeConfig(application());
function setMetaTag(themeKey) {
  const existingMetaTag = document.querySelector(
    'meta[name="SapDarkCPITheme"]'
  );
  if (!existingMetaTag) {
    const newMetaTag = document.createElement("meta");
    newMetaTag.name = "SapDarkCPITheme";
    newMetaTag.content = themeKey;
    document.head.appendChild(newMetaTag);
  }
}

function getThemeKeyByName(themeName) {
  return Object.keys(themeConfig).find(
    (key) => themeConfig[key].name === themeName
  );
}

function getLocalTheme() {
  const storedTheme = localStorage.getItem("SapDarkCPITheme");
  if (storedTheme && themeConfig[storedTheme]) {
    return storedTheme;
  } else {
    return "0"; // default theme
  }
}

function setLocalTheme(themeKey) {
  localStorage.setItem("SapDarkCPITheme", themeKey);
}
function getThemeConfig(key) {
  if (key === "launchpad") {
    return lunchpadtheme;
  } else if (key.toLowerCase().startsWith("cpi")) {
    return cpithemes;
  } else {
    return undefined;
  }
}

// Apply the selected theme
async function applyTheme(themeKey) {
  try {
    setMetaTag(themeKey);
    logger.log(
      "Setting theme:",
      themeConfig[getThemeKeyByName(themeConfig[themeKey].name)].label
    );
    const currentSAPTheme = getCurrentSAPTheme(); // this is needed for application to get the currenttheme from site
    if (
      currentSAPTheme !== themeConfig[themeKey].name ||
      themeKey !== getLocalTheme()
    ) {
      extrathings(themeKey); // This need to implement what you want application to add and behave differently.
      setLocalTheme(themeKey);
    }
    if (window["extrachecks"] !== undefined) {
      extrachecks(themeKey);
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

async function handleStorageChange(event) {
  if (event.storageArea === localStorage) {
    console.log("localStorage changed:", event);
    if (event.key === "SapDarkCPITheme") {
      await setProperty("SapDarkCPITheme", event.newValue);
      console.log(
        "Value of SapDarkCPITheme has changed:",
        await getProperty("SapDarkCPITheme")
      );
    }
  }
}

function addStorageEventListener() {
  window.addEventListener("storage", handleStorageChange);
}
addStorageEventListener();

let functionsToCheck = ["getCurrentSAPTheme", "extrathings"];

function waitForFunctions(funcNames) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      logger.log("Checking for functions:", funcNames);
      const allFunctionsLoaded = funcNames.every((funcName) => {
        const functionExists = typeof window[funcName] === "function";
        logger.log(`${funcName} exists: ${functionExists}`);
        return functionExists;
      });
      if (allFunctionsLoaded) {
        clearInterval(interval);
        logger.log("All required functions are loaded");
        resolve();
      }
    }, 100);
  });
}

waitForFunctions(functionsToCheck).then(() =>
  setInterval(executeMainFunction, executionInterval)
);
