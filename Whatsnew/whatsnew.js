
function loadDynamicContent() {
    const contentDiv = document.getElementById('dynamicContent');
    contentDiv.innerHTML = '';
    
    for (const [key, title] of Object.entries(data_sections)) {
        if (data_updates[key] && data_updates[key].length > 0) {
            const section = document.createElement('div');
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'text-xl font-semibold py-2';
            sectionTitle.innerHTML = title;

            const list = document.createElement('ul');
            list.className = 'list-disc list-inside ml-4';

            data_updates[key].forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = item.description;

                if (item.author) {
                    const authorLink = document.createElement('a');
                    authorLink.href = data_authors[item.author] || '#';
                    authorLink.innerHTML = ` (${item.author})`;
                    authorLink.className = 'text-blue-500 hover:underline';
                    listItem.appendChild(authorLink);
                }

                list.appendChild(listItem);
            });

            section.appendChild(sectionTitle);
            section.appendChild(list);
            contentDiv.appendChild(section);
        }
    }
}