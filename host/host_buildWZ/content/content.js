function main() {
    document.querySelectorAll('head > [href*="sap_horizon"]:not([href*="sap_horizon_dark"])').forEach(link => {
        link.href = link.href.replace("sap_horizon", "sap_horizon_dark");
    });
}
setTimeout(() => {
    setInterval(() => {
        main();
    }, 50);
}, 600);
