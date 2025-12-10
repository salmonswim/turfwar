let copying = false;

function copyDiscord() {
    if (!copying) {
        copying = true;
        const p = document.getElementById("discord");
        navigator.clipboard.writeText("salmonswim");
        const prevHTML = p.innerHTML;
        p.innerHTML += " copied to clipboard";
        setTimeout(function() {
            p.innerHTML = prevHTML;
            copying = false;
        }, 1000);
    }
}