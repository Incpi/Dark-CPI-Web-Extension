"use strict";

// Cache DOM elements for performance
const localTimeElement = document.getElementById("local-time");
const utcTimeElement = document.getElementById("utc-time");
const outputTextElement = document.getElementById("output-text");
const convertedOutputElement = document.querySelector("#converted-output");
const timeTypeElement = document.getElementById("time-type");
const copyIcon = document.getElementById("copy-icon");
const timeInput = document.getElementById("time-input");
const toast = document.getElementById("toast");

function formatDate(date) {
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}, ${date.toLocaleString(undefined, options)}`;
}

function updateTime() {
  const localTime = new Date();
  localTimeElement.innerText = formatDate(localTime);
  const utcTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60000);
  utcTimeElement.innerText = formatDate(utcTime);
}

function convertTimestamp() {
  const input = timeInput.value.trim();
  if (!input) {
    convertedOutputElement.classList.add("hidden");
    return;
  }

  let date;
  let timeType = "Error";
  convertedOutputElement.classList.add("hidden");
  // Check if the input is a valid Unix timestamp
  if (/^\d+$/.test(input)) {
    const unixTimestamp = parseInt(input, 10);
    date = new Date(unixTimestamp * 1000);
    outputTextElement.innerText = date.toISOString();
    timeType = "ISO";
  }
  // Check if the input is a valid ISO string
  else if (!isNaN(Date.parse(input))) {
    date = new Date(input);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    outputTextElement.innerText = unixTimestamp;
    timeType = "Unix";
  } else {
    showToast("Invalid Unix or ISO timestamp", "error");
    return;
  }

  convertedOutputElement.classList.remove("hidden");
  timeTypeElement.innerHTML = timeType;
}

const copyOutputToClipboard = () => {
  const outputText = outputTextElement.innerText;

  if (outputText) {
    navigator.clipboard
      .writeText(outputText)
      .then(() => showToast("Copied Stamp"))
      .catch(() => showToast("Failed to Copy", "error"));
  }
};

// Show toast message
function showToast(message, type = "success") {
  toast.querySelector("span").innerText = message;
  toast.style.display = "block";
  toast.querySelector(".alert").className = `alert alert-${type}`;

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.style.display = "none";
    console.log("closed");
  }, 3000);
}

// Event listeners
timeInput.addEventListener("input", convertTimestamp);
copyIcon.addEventListener("click", copyOutputToClipboard);

// Update the time every second
setInterval(updateTime, 1000);
