"use strict";
const hostmap = [
  [/(.*)launchpad.cfapps.*.hana.ondemand.com/, "launchpad"],
  [/(.*)\.(hci|integrationsuite(-trial)?).*shell/, "cpi"],
  [/.*(pimas|intas){1}.*.cfapps.*.hana.ondemand.com/, "cpi_app"],
];

function application() {
  let artifactType = undefined;
  const url = location.href;
  for (const dataRegexp of hostmap) {
    if (dataRegexp[0].test(url) === true) {
      artifactType = dataRegexp[1];
    }
  }
  return artifactType;
}

function getHost() {
  let tempHost =
    location.href.match(/\/\/([A-z0-9_-]+)?./)[1] + "_" + application();
  console.log("Temp Host:", tempHost);
  return tempHost;
}
const internalHostname = getHost();
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
            <h2 class="text-2xl font-semibold text-primary mb-4">What's New in Dark CPI v:${chrome.runtime
              .getManifest()
              .version.toString()}</h2>
            <div id="dynamicContent" class="mb-4"></div>
            <div role="alert" class="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Press <kbd class="kbd kbd-sm">Esc</kbd> or Close <kbd class="kbd kbd-sm">X</kbd> Icon to Close this popup.</span>
            </div>
        </div>
    </dialog>`;
  document.body.appendChild(newElement);
}

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
    document
      .querySelector("#darkcpiglobal")
      .setAttribute(
        "data-theme",
        (await getProperty("SapDarkCPITheme")) === "1" ? "dark" : "light"
      );
  }
}, 4000);

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let key in changes) {
    if (key === internalHostname) {
      const storageChange = changes[key].newValue.SapDarkCPITheme;
      console.log("Value of SapDarkCPITheme has changed:", storageChange);
      let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
      document
        .querySelector("#darkcpiglobal")
        .setAttribute("data-theme", storageChange === "1" ? "dark" : "light");
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
