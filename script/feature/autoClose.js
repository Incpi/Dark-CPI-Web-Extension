sap.ui.define([],function() {
	return {
		retryAutocloseNavButton:async () => {
			"use strict";
			try {
				const navigationList = sap.ui.getCore().byId("shell--navigationList");
				const sideNavToggleButton = sap.ui.getCore().byId("container-app---app--sideNavigationToggleButton");
				if (navigationList && navigationList.getProperty("expanded")) {
					const navButton = sap.ui.getCore().byId("__button0");
					if (navButton) {
						navButton.firePress();
						console.info("Navigation button successfully closed.");
						return true;
					}
				} else if (sideNavToggleButton && sideNavToggleButton.getProperty("expanded")) {
					sideNavToggleButton.firePress();
					console.info("Side navigation button successfully closed.");
					return true;
				} else {
					console.warn("Navigation button closure condition not met.");
				}
			} catch (error) {
				console.error(`Retry: Failed to execute retryAutocloseNavButton. Error: ${error.message}`);
			}
		},
	};
});
