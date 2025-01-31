"use strict";
console.log("Initializing OnInit.js...");

function setupChromeApiListener() {
	window.addEventListener("requestDataChromeApi",(event) => {
		if (event.detail?.request === "chromeExtensionURL") {
			try {
				const responseEvent = new CustomEvent("responseDataChromeApi",{
					detail:{ success:true,url:chrome.runtime.getURL("/"),version:chrome.runtime.getManifest().version },
				});
				window.dispatchEvent(responseEvent);
			} catch (error) {
				console.error("Error fetching Chrome extension URL:",error);
				const responseEvent = new CustomEvent("responseDataChromeApi",{
					detail:{ success:false,message:error.message },
				});
				window.dispatchEvent(responseEvent);
			}
		}
	});
	window.addEventListener("getManifest",(event) => {
		if (event.detail?.request === "getManifest") {
			try {
				const responseEvent = new CustomEvent("getManifest",{
					detail:{
						success:true,
						version:chrome.runtime.getManifest().version,
					},
				});
				window.dispatchEvent(responseEvent);
			} catch (error) {
				console.error("Error fetching Chrome extension Version:",error);
				const responseEvent = new CustomEvent("getManifest",{
					detail:{ success:false,message:error.message },
				});
				window.dispatchEvent(responseEvent);
			}
		}
	});
}

function getSubstringBeforeDot(url) {
	return url.substring(0,url.indexOf("."));
}

function setupStorageListener() {
	const id = getSubstringBeforeDot(window.location.hostname);

	window.addEventListener("storeData",(event) => {
		const { key,value } = event.detail;
		// console.log("Content Script: Storing data for key:", key);

		try {
			chrome.storage.sync.get([id],(result) => {
				const storageData = result[id] || {}; // Ensure object exists
				storageData[key] = JSON.stringify(value); // Store data

				chrome.storage.sync.set({ [id]:storageData },() => {
					const responseEvent = new CustomEvent("storeDataResponse",{
						detail:{ success:true,message:`Key "${key}" stored successfully.` },
					});
					window.dispatchEvent(responseEvent);
				});
			});
		} catch (error) {
			console.error("Content Script: Error storing data",error);
			const responseEvent = new CustomEvent("storeDataResponse",{
				detail:{ success:false,message:error.message },
			});
			window.dispatchEvent(responseEvent);
		}
	});

	window.addEventListener("getData",(event) => {
		const { key } = event.detail;
		// console.log("Content Script: Retrieving data for key:", key);

		chrome.storage.sync.get([id],(result) => {
			const storageData = result[id] || {}; // Ensure object exists
			const value = storageData[key] ? JSON.parse(storageData[key]) : null;

			const responseEvent = new CustomEvent("getDataResponse",{
				detail:{ success:value !== null,value },
			});
			window.dispatchEvent(responseEvent);
		});
	});
}

setupChromeApiListener();
setupStorageListener();
