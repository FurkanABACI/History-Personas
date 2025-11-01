let translations = {};

async function setLanguage(lang, preventReload = false) {

        console.log("🌍 Dil değiştiriliyor:", lang);

        if (window.location.pathname === "/settings" && preventReload) {
            console.log("⚠️ Settings sayfasında geçici dil değişimi - localStorage yazılmayacak");
        } else {
            localStorage.setItem("siteLanguage", lang);
            console.log("💾 Dil kaydedildi:", lang);
        }



        const response = await fetch(`/Locales/${lang}.json`);
        if (!response.ok) throw new Error('JSON dosyası bulunamadı');

        translations[lang] = await response.json();
        applyTranslations();


        if (!preventReload && window.location.pathname === '/settings') {
            console.log("🔄 Settings sayfası yenileniyor...");

        }

        console.log(`✅ Dil değiştirildi: ${lang}`);
}

function applyTranslations() {
    const lang = localStorage.getItem("siteLanguage") || "tr";
    console.log("🔠 Çeviriler uygulanıyor, dil:", lang);

    const currentTranslations = translations[lang];

    if (!currentTranslations) {
        console.warn('⚠️ Çeviriler yüklenmedi:', lang);
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
        console.log("🔄 Varsayılan dil ayarlandı:", lang);
    }

    console.log("🎯 Başlangıç dili:", lang);
    return lang;
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 i18n: DOM loaded");

    const initialLang = initializeLanguage();
    await setLanguage(initialLang, true);

    document.querySelectorAll(".lang-btn, [data-i18n-button]").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const langToSet = btn.getAttribute("data-lang") || btn.getAttribute("data-i18n-button");
            console.log("🖱️ Dil butonuna tıklandı:", langToSet);

            await setLanguage(langToSet, true);
        });
    });
});

window.applyTranslationsToNewPage = applyTranslations;
window.setLanguage = setLanguage;