async function getSyncValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[key]);
            }
        });
    }).catch(error => console.error('Error getting sync value:', error));
}

async function setSyncValue(key,value) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(key, (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[key]);
            }
        });
    }).catch(error => console.error('Error getting sync value:', error));
}

function tagCreate(value = 0) {
    const metaTag = document.createElement('meta');
    metaTag.name = 'SapDarkCPITheme';
    metaTag.content = value;
    document.head.appendChild(metaTag);
}

setInterval(() => {
    let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
    if (!metaTag) {
        getSyncValue('SapDarkCPITheme').then(value => tagCreate(value));
    }
}, 3000);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        if (key === 'SapDarkCPITheme') {
            const storageChange = changes[key];
            console.log('Value of SapDarkCPITheme has changed:', storageChange.newValue);
            let metaTag = document.querySelector('meta[name="SapDarkCPITheme"]');
            try {
                if (!metaTag) {
                    tagCreate(storageChange.newValue);
                } else {
                    metaTag.content = storageChange.newValue;
                }
            } catch (error) {
                console.error('Error updating meta tag:', error);
            }
        }
    }
});