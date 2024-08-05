"use strict"
const hostmap = [
  [/(.*)launchpad.cfapps.*.hana.ondemand.com/, "launchpad"],
  [/(.*)\.(hci|integrationsuite(-trial)?).*shell/, "cpi"],
  [/.*(pimas|intas){1}.*.cfapps.*.hana.ondemand.com/, "cpi_app"],
]

const lunchpadtheme = {
  2: { name: "sap_fiori_3", label: "Quartz Light", buttonlabel: "Default" },
  1: { name: "sap_fiori_3_dark", label: "Quartz Dark", buttonlabel: "Dark UI" },
}

const cpithemes = {
  0: { name: "sap_horizon", label: "Morning Horizon", buttonlabel: "Default" },
  1: {
    name: "sap_horizon_dark",
    label: "Evening Horizon",
    buttonlabel: "Dark UI",
  },
  2: { name: "sap_fiori_3", label: "Quartz Light", buttonlabel: "Old UI" },
}
function populateOptions(vartheme) {
  document.getElementById("options").innerHTML = Object.keys(vartheme)
    .map((key) => {
      return `<button class="btn btn-sm" data-value="${key}">${vartheme[key].buttonlabel}</button>`
    })
    .join("")
}

const application = async () => {
  groups = ""
  let artifactType = ""
  const url = await getActiveTabURL()
  for (const dataRegexp of hostmap) {
    if (dataRegexp[0].test(url) === true) {
      var groups = url.match(dataRegexp[0])
      artifactType = dataRegexp[1]
      return artifactType
    }
  }
  return artifactType || undefined
}

var getActiveTabURL = async () => {
  return new Promise((resolve, reject) => {
    var query = { active: true, currentWindow: true }
    function callback(tabs) {
      var currentTab = tabs[0]
      resolve(currentTab.url)
    }
    chrome.tabs.query(query, callback)
  })
}

var getHost = async () => {
  var url = await getActiveTabURL()
  var app = await application()
  let core = url.match(/\/\/([A-z0-9_-]+)?./)
  console.log(core, app)
  let tempHost = String(core[1]) + "_" + app
  console.log("Temp Host:", tempHost)
  return tempHost
}

const internalHostname = await getHost()
async function getStorageData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([internalHostname], function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result[internalHostname] || {})
      }
    })
  })
}

async function setStorageData(data) {
  return new Promise((resolve, reject) => {
    let storageData = {}
    storageData[internalHostname] = data
    chrome.storage.sync.set(storageData, function () {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

// Getter function to get specific property for the internal hostname
async function getProperty(property) {
  try {
    const data = await getStorageData()
    console.log(data)
    return data[property]
  } catch (error) {
    console.error("Error getting property:", error)
  }
}

// Setter function to set specific property for the internal hostname
async function setProperty(property, value) {
  try {
    const data = await getStorageData()
    data[property] = value
    await setStorageData(data)
  } catch (error) {
    console.error("Error setting property:", error)
  }
}

async function main() {
  // Set the version in all elements with class 'version'
  const versionElements = document.querySelectorAll(".version")
  versionElements.forEach((e) => {
    e.innerHTML = " Version: " + chrome.runtime.getManifest().version
  })

  const app = await application()
  if (app === undefined) {
    document.querySelector(
      "main"
    ).innerHTML = `<div role="alert" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Error! we don't support this URL.</span>
        </div>`
    return undefined
  }
  if (app.toLowerCase().startsWith("cpi")) {
    populateOptions(cpithemes)
  } else if (app.toLowerCase() === "launchpad") {
    populateOptions(lunchpadtheme)
  } else {
  }
  console.log("Host:", internalHostname)
  const buttons = document.querySelectorAll(".btn-sm")
  const activetheme = document.querySelector(".activetheme")
  const activeapp = document.querySelector(".activeapp")
  let theme = (await getProperty("SapDarkCPITheme")) || 0
  console.log("Theme:", theme)
  const selectedButton = document.querySelector(
    `.btn-sm[data-value="${theme}"]`
  )

  if (selectedButton) {
    selectedButton.classList.add("active")
    activetheme.textContent = selectedButton.textContent
    activeapp.textContent = app.toUpperCase()
    document.body.className = "darkcpiglobal"
    if (theme === "1") {
      document.body.classList.add("dark-theme")
    } else if (theme === "2") {
      document.body.classList.add("old-theme")
    }
  }
  // Event listener for button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      buttons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")
      activetheme.textContent = button.textContent
      const selectedValue = button.getAttribute("data-value")
      await setProperty("SapDarkCPITheme", selectedValue)
      document.body.className = "darkcpiglobal"
      if (selectedValue === "1") {
        document.body.classList.add("dark-theme")
      } else if (selectedValue === "2") {
        document.body.classList.add("old-theme")
      }
    })
  })
}

main().catch((err) => console.error(err))
