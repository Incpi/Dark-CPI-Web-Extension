$(document).ready(() =>{
    const url = document.location.href + 'readme/README.md';
    $.get(url, function(markdown) {
        const htmlContent = marked.parse(markdown);
        $('#content').html(htmlContent);
        $('#content img:first').remove();
    }).fail(function() {
        console.error('Error fetching the README');
    });
});