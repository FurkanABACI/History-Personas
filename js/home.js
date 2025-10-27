document.addEventListener("DOMContentLoaded", function () {
    const toast = document.getElementById("toast");

    function showToast(message, duration = 3000, callback) {
        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
            if (callback) callback();
        }, duration);
    }

    // SPA uyumlu yönlendirme (router.js’deki urlRoute kullanılır)
    const exitBtn = document.querySelector("#exitBtn");
    const settingsBtn = document.querySelector("#settingsBtn");

    if (settingsBtn) {
        settingsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.urlRoute(e, { href: "/settings" });
        });
    }

    if (exitBtn) {
        exitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.urlRoute(e, { href: "/login" });
        });
    }
});
