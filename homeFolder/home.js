// home/home.js
document.addEventListener("DOMContentLoaded", function () {
    // Eğer toast yoksa atla
    const toast = document.getElementById("toast");

    function showToast(message, duration = 3000, callback) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
            if (callback) callback();
        }, duration);
    }

    // SPA uyumlu exit/settings butonları
    const exitBtn = document.querySelector("#exitBtn");
    const settingsBtn = document.querySelector("#settingsBtn");

    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            history.pushState(null, null, "/settings");
            loadPage("/settings");
        });
    }

    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
            history.pushState(null, null, "/login");
            loadPage("/login");
        });
    }
});
