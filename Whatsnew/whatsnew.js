function loadDynamicContent() {
  const contentDiv = document.getElementById("dynamicContent");
  contentDiv.innerHTML = "<br>";

  for (const [key, title] of Object.entries(data_sections)) {
    if (data_updates[key] && data_updates[key].length > 0) {
      const section = document.createElement("div");
      const sectionTitle = document.createElement("h3");
      sectionTitle.className = "text-xl font-semibold py-2";
      sectionTitle.innerHTML = title;

      const list = document.createElement("ol");
      list.className = "list-disc list-inside ml-4";

      data_updates[key].forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = item.description;

        if (item.author) {
          listItem.insertAdjacentHTML('beforeend', ` by <a class="link link-primary" href="${data_authors[item.author] || "#"}">(${item.author})</a>`);
        }

        list.appendChild(listItem);
      });
      section.appendChild(sectionTitle);
      section.appendChild(document.createElement("br"));
      section.appendChild(list);
      section
        .appendChild(document.createElement("div"))
        .classList.add("divider");
      contentDiv.appendChild(section);
    }
  }
}
