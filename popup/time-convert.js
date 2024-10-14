"use strict";

function updateTime() {
  const localTime = new Date();
  const utcTime = new Date(localTime.toISOString());

  document.getElementById("local-time").innerText = localTime.toLocaleString().toUpperCase();
  document.getElementById("utc-time").innerText = utcTime.toLocaleString("en-US", { timeZone: "UTC" });
}

function convertTimestamp() {
  const input = document.getElementById("time-input").value.trim();
  const outputTextElement = document.getElementById("output-text");
  const localTimeDisplay = document.getElementById("local-time");
  const utcTimeDisplay = document.getElementById("utc-time");
  if (!input) {
    outputTextElement.innerText = "";
    updateTime();
    return;
  }

  let date;
  let timeType = "Error";
  // Check if the input is a valid Unix timestamp (e.g., all digits).
  if (/^\d+$/.test(input)) {
    const unixTimestamp = parseInt(input, 10);
    date = new Date(unixTimestamp * 1000); // Convert to milliseconds.
    outputTextElement.innerText = `${date.toISOString()}`;
    timeType = "ISO";
  }
  // Check if the input is a valid ISO string.
  else if (!isNaN(Date.parse(input))) {
    date = new Date(input);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    timeType = "Unix";
    outputTextElement.innerText = `${unixTimestamp}`;
  } else {
    showToast("Invalid Unix or ISO timestamp", "error");
    return;
  }
  document.getElementById("time-type").innerHTML = timeType;
  // Display the local time and UTC time derived from the date.
  localTimeDisplay.innerText = date.toLocaleString();
  utcTimeDisplay.innerText = date.toLocaleString("en-US", { timeZone: "UTC" });
}

// Copy the output to clipboard when the icon is clicked.
document.getElementById("copy-icon").addEventListener("click", function () {
  const outputText = document.getElementById("output-text").innerText;

  if (outputText) {
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        showToast("Copied Stamp");
      })
      .catch(() => {
        showToast("Failed to Copy", "error");
      });
  }
});

// Function to show the toast message
function showToast(message, type = "success", toast = document.getElementById("toast")) {
  toast.querySelector("span").innerText = message;
  toast.style.display = "block";
  toast.querySelector(".alert").classList = "alert alert-" + type;
  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.style.display = "none";
    console.log("closed");
  }, 3000);
}

// Add event listener for input change.
document.getElementById("time-input").addEventListener("input", convertTimestamp);

// Update the time every second.
setInterval(updateTime, 1000);
