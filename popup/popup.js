document.getElementById('options').addEventListener('change', function () {
    var value = this.options[this.selectedIndex].value;
    chrome.storage.sync.set({ 'SapDarkCPITheme': value }, function () {
        if (chrome.runtime.lastError) {
            console.error('Error setting option:', chrome.runtime.lastError);
        } else {
            console.log('Option set to:', value);
        }
    });
});

chrome.storage.sync.get(["SapDarkCPITheme"], (result) => {
    document.getElementById('options').value = result["SapDarkCPITheme"] || 0;
});