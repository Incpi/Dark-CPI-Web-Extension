async function getSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[key]);
            }
        });
    });
}

async function setSyncValue(key, value) {
    return new Promise((resolve, reject) => {
        const data = {};
        data[key] = value;
        chrome.storage.sync.set(data, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                syncTheme();
                resolve();
            }
        });
    });
}

function tagCreate(value = 0) {
    const metaTag = document.createElement('meta');
    metaTag.name = 'SapDarkCPITheme';
    metaTag.content = value;
    document.head.appendChild(metaTag);
}

tagCreate(async ()=> await getSyncValue('SapDarkCPITheme'));

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        if (key === 'SapDarkCPITheme') {
            const storageChange = changes[key];
            console.log('Value of SapDarkCPITheme has changed:', storageChange.newValue);
            let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
            if (!metaTag) {
                tagCreate(storageChange.newValue);
            } else {
                metaTag.content = storageChange.newValue;
            }
        }
    }
});
