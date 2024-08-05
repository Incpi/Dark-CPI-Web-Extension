// Helper functions
async function modal() {
  loadDynamicContent();
  updates.showModal();
  document
    .getElementById("darkcpiglobal")
    .setAttribute("data-condition", "false");
  document
    .querySelector("#DarkCPI_Navbutton .cpiBadgeIndicator")
    ?.classList.remove("cpiBadgeIndicator");
  await setProperty(
    "readupdates",
    chrome.runtime.getManifest().version.toString()
  );
}

const interval = setInterval(async () => {
  const element = document.getElementById("darkcpiglobal");
  if (element && element.getAttribute("data-condition") === "true") {
    await modal();
  }
}, 500);

async function ifupdate() {
  const silentversions = ["1.3.4"];
  if (
    (await getProperty("readupdates")) !==
    chrome.runtime.getManifest().version.toString()
  ) {
    const btn = document.querySelector("#DarkCPI_Navbutton");
    if (
      btn &&
      document.querySelectorAll("#DarkCPI_Navbutton .cpiBadgeIndicator")
        .length === 0
    ) {
      const badge = document.createElement("span");
      badge.className = "cpiBadgeIndicator";
      btn.appendChild(badge);
      if (
        !silentversions.includes(
          chrome.runtime.getManifest().version.toString()
        )
      ) {
        await modal();
      }
    }
  } else {
    if (
      document.querySelectorAll("#DarkCPI_Navbutton .cpiBadgeIndicator")
        .length !== 0
    ) {
      document
        .querySelector("#DarkCPI_Navbutton .cpiBadgeIndicator")
        .classList.remove("cpiBadgeIndicator");
    }
  }
}

const intervalId = setInterval(async () => await ifupdate(), 500);
setTimeout(() => clearInterval(intervalId), 60000);
