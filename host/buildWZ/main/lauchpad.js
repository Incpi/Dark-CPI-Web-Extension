function iframetheme(newTheme) {
    document.querySelectorAll("iframe").forEach((iframe) => {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
            var scriptTag = iframeDoc.querySelector("script");
            if (scriptTag) {
                scriptTag.setAttribute("data-sap-ui-theme", newTheme);
                iframe.contentWindow.location.reload();
            }
        }
    });
}
setTimeout(() => {
    setTimeout(() => {
        if (sap.ui.getCore().getConfiguration().getTheme() === "sap_fiori_3_dark") {
            iframetheme(sap.ui.getCore().getConfiguration().getTheme());
        }
    }, 50);
}, 600);

setInterval(() => {
    console.log(sap.ui.getCore().getConfiguration().getTheme())
}, 100);