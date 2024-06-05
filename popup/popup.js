"use strict";
async function getHost() {
    return new Promise((resolve, reject) => {
        var query = { active: true, currentWindow: true };
        function callback(tabs) {
            var currentTab = tabs[0]; // there will be only one in this array
            console.log(currentTab); // also has properties like currentTab.id
            let core = currentTab.url
                .split("/")[2]
                .match(/.*(\.integrationsuite(-trial)?.*)/);
            let tempHost = String(core[0]).replaceAll(String(core[1]), "");
            console.log("Temp Host:", tempHost);
            resolve(tempHost);
        }
        chrome.tabs.query(query, callback);
    });
}
const internalHostname = await getHost();
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
        console.log(data);
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

async function main() {
    console.log("Host:", internalHostname);
    const buttons = document.querySelectorAll(".btn");
    const versionElements = document.querySelectorAll(".version");
    const activetheme = document.querySelector(".activetheme");
    let theme = (await getProperty("SapDarkCPITheme")) || 1;
    console.log("Theme:", theme);
    const selectedButton = document.querySelector(
        `.btn[data-value="${theme}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
        activetheme.textContent = selectedButton.textContent;
        document.body.className = "";
        if (theme === "1") {
            document.body.classList.add("dark-theme");
        } else if (theme === "2") {
            document.body.classList.add("old-theme");
        }
    }
    // Set the version in all elements with class 'version'
    versionElements.forEach((e) => {
        e.innerHTML = chrome.runtime.getManifest().version;
    });

    // Event listener for button clicks
    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            activetheme.textContent = button.textContent;
            const selectedValue = button.getAttribute("data-value");
            await setProperty("SapDarkCPITheme", selectedValue);
            document.body.classList = "";
            if (selectedValue === "1") {
                document.body.classList.add("dark-theme");
            } else if (selectedValue === "2") {
                document.body.classList.add("old-theme");
            }
        });
    });
}

main().catch((err) => console.error(err));
