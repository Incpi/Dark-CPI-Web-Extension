const regexPatterns = [/^https:\/\/.*\.hana\.ondemand\.com\/itspaces\/shell\/.*/, /^https:\/\/.*\.hana\.ondemand\.com\/shell\/.*/, /^https:\/\/.*\.platform\.sapcloud\.cn\/itspaces\/shell\/.*/, /^https:\/\/.*\.platform\.sapcloud\.cn\/shell\/.*/];

// Inject scripts into a tab
async function injectScripts(tabId) {
	try {
		console.log(`Injecting scripts into tab ${tabId}...`);
		await chrome.scripting.executeScript({
			target: { tabId }, files: ["script/OnInit.js"],
		});
		await chrome.scripting.executeScript({
			target: { tabId }, files: ["script/main_script.js"], world: "MAIN",
		});
		console.log(`Scripts injected into tab ${tabId}`);
	} catch (error) {
		console.error(`Failed to inject scripts into tab ${tabId}:`, error);
	}
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url) {
		const isMatch = regexPatterns.some((pattern) => pattern.test(tab.url));
		if (isMatch) {
			try {
				// Check if scripts are already injected
				await chrome.tabs.sendMessage(tabId, { action: "checkInjected" });
			} catch {
				// Inject scripts if not already injected
				await injectScripts(tabId);
			}
		}
	}
});
