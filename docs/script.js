$(document).ready(function () {
  const url = document.location.href + "readme/README.md";
  $.get(url, function (markdown) {
    const htmlContent = marked.parse(
      markdown
        .replace("[!IMPORTANT]", "<b> IMPORTANT </b>")
        .replace("[!WARNING]", "<b> WARNING </b>")
    );
    $("#content").html(htmlContent);
    $("#content img:first").attr("src", "./res/Black_full.png");
    generateToc();
  }).fail(function () {
    console.error("Error fetching the README");
  });

  function generateToc() {
    const toc = $("#toc ul");
    $("#content")
      .find("h1, h2, h3, h4")
      .each(function () {
        const header = $(this);
        const id = header
          .text()
          .replace(/\s+/g, "-")
          .replace(/\./g, "-")
          .toLowerCase();
        header.attr("id", id);

        const li = $("<li></li>").addClass(
          header.prop("tagName").toLowerCase()
        );
        const link = $("<a></a>")
          .attr("href", "#" + encodeURIComponent(id))
          .text(header.text());
        link.on("click", function (event) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: $("#" + id).offset().top,
            },
            500
          );
        });
        li.append(link);
        toc.append(li);
      });
  }
});
