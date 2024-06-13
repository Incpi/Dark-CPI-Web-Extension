function getCurrentSAPTheme() {
    console.log(sap.ui.getCore().getConfiguration().getTheme() || lunchpadtheme[getLocalTheme()]);
    return sap.ui.getCore().getConfiguration().getTheme() || lunchpadtheme[getLocalTheme()];
}

function extrathings(newTheme) {
    if (location.pathname === "/comsapuitheming.themedesigner/") {
        if (newTheme !== String(1)) {
            document.querySelectorAll('head > [href*="sap_horizon_dark"]')?.forEach((link) => {
                link.href = link.href.replace("sap_horizon_dark", "sap_horizon");
            });
            logger.log("sap_horizon is active");
        } else {
            document
                .querySelectorAll('head > [href*="sap_horizon"]:not([href*="sap_horizon_dark"])')
                ?.forEach((link) => {
                    link.href = link.href.replace("sap_horizon", "sap_horizon_dark");
                });
            logger.log("sap_horizon_dark is active");
        }
    }
}

function extrachecks(newTheme) {
    document.querySelectorAll("iframe").forEach((iframe) => {
        document
            .querySelector("html")
            .setAttribute("data-sap-ui-theme", sap.ui.getCore().getConfiguration().getTheme());
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (
            iframeDoc.querySelector("html").getAttribute("data-sap-theme") !==
            sap.ui.getCore().getConfiguration().getTheme()
        )
            if (iframeDoc) {
                var scriptTag = iframeDoc.querySelector("script");
                if (scriptTag) {
                    scriptTag.setAttribute("data-sap-ui-theme", sap.ui.getCore().getConfiguration().getTheme());
                    iframe.contentWindow.location.reload();
                }
            }
    });
}
