
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get("name"),
        phone: params.get("phone"),
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const { name, phone } = getQueryParams();

    if (name && phone) {
        document.getElementById("contact-name").textContent = name;
        document.getElementById("contact-phone").textContent = phone;
    } else {
        document.body.innerHTML = "<h2>Contact details not found.</h2>";
    }
});
