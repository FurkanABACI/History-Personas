// ======================================================
// TRANSLATIONS STORAGE
// Tüm dil çevirilerini saklamak için obje
let translations = {};

// ======================================================
// SET LANGUAGE
// Dil değişikliği yap, JSON dosyasını yükle ve çevirileri uygula
async function setLanguage(lang, preventReload = false) {
    if (!(window.location.pathname === "/settings" && preventReload)) {
        localStorage.setItem("siteLanguage", lang);
    }

    const response = await fetch(`/Locales/${lang}.json`);
    if (!response.ok) throw new Error('JSON dosyası bulunamadı');

    translations[lang] = await response.json();
    applyTranslations();

    if (!preventReload && window.location.pathname === '/settings') {}
}

// ======================================================
// APPLY TRANSLATIONS
// Sayfadaki data-i18n ve data-i18n-placeholder öğelerine çevirileri uygula
function applyTranslations() {
    const lang = localStorage.getItem("siteLanguage") || "tr";
    const currentTranslations = translations[lang];

    if (!currentTranslations) {
        return;
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (currentTranslations[key]) element.textContent = currentTranslations[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (currentTranslations[key]) element.placeholder = currentTranslations[key];
    });

    const titleKey = "pageTitle";
    if (currentTranslations[titleKey]) document.title = currentTranslations[titleKey];
}

// ======================================================
// INITIALIZE LANGUAGE
// İlk yüklemede localStorage'dan dil al, yoksa varsayılanı ayarla
function initializeLanguage() {
    let lang = localStorage.getItem("siteLanguage");
    if (!lang) {
        lang = "tr";
        localStorage.setItem("siteLanguage", lang);
    }
    return lang;
}

// ======================================================
// DOMCONTENTLOADED EVENT
// Sayfa yüklendiğinde dili uygula ve dil butonlarını ata
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

// ======================================================
// GLOBAL EXPORTS
// Diğer sayfalardan erişim için fonksiyonları window'a ata
window.applyTranslationsToNewPage = applyTranslations;
window.setLanguage = setLanguage;