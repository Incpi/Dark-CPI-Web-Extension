const executionInterval = 3000;

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
