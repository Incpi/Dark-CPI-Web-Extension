// Helper functions
async function modal() {
    loadDynamicContent();
    updates.showModal();
    document.getElementById("darkcpiglobal").setAttribute("data-condition", "false");
    document.querySelector("#DarkCPI_Navbutton .cpiBadgeIndicator")?.classList.remove("cpiBadgeIndicator");
    await setProperty("readupdates", chrome.runtime.getManifest().version.toString());
}

const interval = setInterval(async () => {
    const element = document.getElementById("darkcpiglobal");
    if (element && element.getAttribute("data-condition") === "true") {
        await modal();
    }
}, 500);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        if (key === internalHostname) {
            const storageChange = changes[key].newValue.SapDarkCPITheme;
            console.log("Value of SapDarkCPITheme has changed:", storageChange);
            let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
            document
                .querySelector("#darkcpiglobal")
                .setAttribute("data-theme", (storageChange === "1" ? "dark" : "light"));
            try {
                if (!metaTag) {
                    console.log("Meta tag not found. Creating meta tag...");
                    tagCreate(storageChange);
                } else {
                    console.log("Updating meta tag content...");
                    metaTag.content = storageChange;
                }
            } catch (error) {
                console.error("Error updating meta tag:", error);
            }
        }
    }
});

async function ifupdate() {
    if (await getProperty("readupdates") !== chrome.runtime.getManifest().version.toString()) {
        const btn = document.querySelector("#DarkCPI_Navbutton");
        if (btn && document.querySelectorAll("#DarkCPI_Navbutton .cpiBadgeIndicator").length === 0) {
            const badge = document.createElement("span");
            badge.className = "cpiBadgeIndicator";
            btn.appendChild(badge);
            await modal();
        }
    } else {
        if (document.querySelectorAll("#DarkCPI_Navbutton .cpiBadgeIndicator").length !== 0) {
            document.querySelector("#DarkCPI_Navbutton .cpiBadgeIndicator").classList.remove("cpiBadgeIndicator");
        }
    }
}

const intervalId = setInterval(async () => await ifupdate(), 500);
setTimeout(() => clearInterval(intervalId), 60000);

async function handleStorageChange(event) {
    if (event.storageArea === localStorage) {
        console.log("localStorage changed:", event);
        if (event.key === "SapDarkCPITheme") {
            await setProperty("SapDarkCPITheme", event.newValue);
            console.log("Value of SapDarkCPITheme has changed:", await getProperty("SapDarkCPITheme"));
        }
    }
}

function addStorageEventListener() {
    window.addEventListener("storage", handleStorageChange);
}
addStorageEventListener();