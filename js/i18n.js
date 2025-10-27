let translations = {};

/**
  @param {string} lang
 */
async function setLanguage(lang) {
     localStorage.setItem("siteLanguage", lang);

     const response = await fetch(`../Locales/${lang}.json`);

     translations[lang] = await response.json();

     const currentTranslations = translations[lang];

     const translatableElements = document.querySelectorAll(
          'h1, h2, h3, h4, h5, h6, ' +
          'p, i, label, ' +
          'button:not([data-i18n-button]),a'
     );

     translatableElements.forEach(element => {
          const key = element.textContent.trim();

          if (currentTranslations && currentTranslations[key]) {
               element.textContent = currentTranslations[key];
          }
     });
}



document.addEventListener("DOMContentLoaded", async () => {

     const initialLang = localStorage.getItem("siteLanguage") || "tr";

     await setLanguage(initialLang);

     document.querySelectorAll("[data-i18n-button]").forEach(btn => {
          btn.addEventListener("click", async () => {
               const langToSet = btn.getAttribute("data-i18n-button");

               await setLanguage(langToSet);
          });
     });
});
