document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    const versionElements = document.querySelectorAll('.version');
    const activetheme = document.querySelector('.activetheme');
    const body = document.body;

    // Set the version in all elements with class 'version'
    versionElements.forEach((e) => {
        e.innerHTML = chrome.runtime.getManifest().version;
    });

    // Event listener for button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activetheme.textContent = this.textContent;
            const selectedValue = this.getAttribute('data-value');

            // Store the selected theme and toggle dark theme class
            chrome.storage.sync.set({ "SapDarkCPITheme": selectedValue }, function () {
                console.log('Theme selected:', selectedValue);
                if (selectedValue === "1") {
                    body.classList.add("dark-theme");
                } else {
                    body.classList.remove("dark-theme");
                }
            });
        });
    });

    // Load the selected theme from Chrome storage
    chrome.storage.sync.get(['SapDarkCPITheme'], function (result) {
        if (result.SapDarkCPITheme) {
            const selectedButton = document.querySelector(`.btn[data-value="${result.SapDarkCPITheme}"]`);
            if (selectedButton) {
                selectedButton.classList.add('active');
                activetheme.textContent = selectedButton.textContent;
                if (result.SapDarkCPITheme === "1") {
                    body.classList.add("dark-theme");
                } else {
                    body.classList.remove("dark-theme");
                }
            }
        }
    });
});
