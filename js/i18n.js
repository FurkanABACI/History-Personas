let translations = {};

async function setLanguage(lang, preventReload = false) {

        if (window.location.pathname === "/settings" && preventReload) {
        } else {
            localStorage.setItem("siteLanguage", lang);
        }



        const response = await fetch(`/Locales/${lang}.json`);
        if (!response.ok) throw new Error('JSON dosyası bulunamadı');

        translations[lang] = await response.json();
        applyTranslations();


        if (!preventReload && window.location.pathname === '/settings') {

        }

}

function applyTranslations() {
    const lang = localStorage.getItem("siteLanguage") || "tr";

    const currentTranslations = translations[lang];

    if (!currentTranslations) {
        return;
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (currentTranslations[key]) {
            element.textContent = currentTranslations[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (currentTranslations[key]) {
            element.placeholder = currentTranslations[key];
        }
    });

    const titleKey = "pageTitle";
    if (currentTranslations[titleKey]) {
        document.title = currentTranslations[titleKey];
    }
}

function initializeLanguage() {
    let lang = localStorage.getItem("siteLanguage");

    if (!lang) {
        lang = "tr";
        localStorage.setItem("siteLanguage", lang);
    }

    return lang;
}

document.addEventListener("DOMContentLoaded", async () => {

    const initialLang = initializeLanguage();
    await setLanguage(initialLang, true);

    document.querySelectorAll(".lang-btn, [data-i18n-button]").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const langToSet = btn.getAttribute("data-lang") || btn.getAttribute("data-i18n-button");

            await setLanguage(langToSet, true);
        });
    });
});

window.applyTranslationsToNewPage = applyTranslations;
window.setLanguage = setLanguage;