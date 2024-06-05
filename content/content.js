// Internal hostname
let core = location.href.split("/")[2].match(/.*(\.integrationsuite(-trial)?.*)/);
const internalHostname = String(core[0]).replaceAll(String(core[1]), "");
// Storage-related functions
async function getStorageData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([internalHostname], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[internalHostname] || {});
            }
        });
    });
}

async function setStorageData(data) {
    return new Promise((resolve, reject) => {
        let storageData = {};
        storageData[internalHostname] = data;
        chrome.storage.sync.set(storageData, function () {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

// Getter function to get specific property for the internal hostname
async function getProperty(property) {
    try {
        const data = await getStorageData();
        return data[property];
    } catch (error) {
        console.error("Error getting property:", error);
    }
}

// Setter function to set specific property for the internal hostname
async function setProperty(property, value) {
    try {
        const data = await getStorageData();
        data[property] = value;
        await setStorageData(data);
    } catch (error) {
        console.error("Error setting property:", error);
    }
}

// Helper functions
function tagCreate(value = 0) {
    const metaTag = document.createElement("meta");
    metaTag.name = "SapDarkCPITheme";
    metaTag.content = value;
    document.head.appendChild(metaTag);
}
function insertElementWithId(id, classname = "") {
    const newElement = document.createElement("div");
    newElement.id = id;
    newElement.className = classname;
    newElement.innerHTML = `<dialog id="updates" class="modal">
        <div class="modal-box">
            <form method="dialog"><button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
            <h2 class="text-2xl font-semibold text-primary mb-4">What's New in Dark CPI v:${chrome.runtime.getManifest().version.toString()}</h2>
            <div id="dynamicContent" class="mb-4"></div>
            <div role="alert" class="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Press <kbd class="kbd kbd-sm">Esc</kbd> or Close <kbd class="kbd kbd-sm">X</kbd> Icon to Close this popup.</span>
            </div>
        </div>
    </dialog>`;
    document.body.appendChild(newElement);
}

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

setInterval(async () => {
    let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
    let global = document.querySelector("#darkcpiglobal");

    if (!metaTag) {
        console.log("Meta tag not found. Getting sync value...");
        getProperty("SapDarkCPITheme").then((value) => tagCreate(value));
    }

    if (!global) {
        console.log("Global element not found. Inserting element...");
        insertElementWithId("darkcpiglobal", "darkcpiglobal");
        document.querySelector("#darkcpiglobal").setAttribute("data-theme", (await getProperty("SapDarkCPITheme")) === "1" ? "dark" : "light");
    }
}, 3000);

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

const intervalId = setInterval(async () => await ifupdate(), 100);
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