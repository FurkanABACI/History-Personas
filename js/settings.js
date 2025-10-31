// ======================================================
// ✅ Settings.js (Cookie Entegrasyonlu)
// ======================================================

let selectedTheme = '';
let selectedLanguage = '';

function initSettingsPage() {
    console.log("⚙️ Settings page init ediliyor...");

    const lightBtn = document.getElementById("lightThemeBtn");
    const darkBtn = document.getElementById("darkThemeBtn");
    const autoBtn = document.getElementById("autoThemeBtn");
    const langButtons = document.querySelectorAll('.lang-btn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // ⚙️ Mevcut kullanıcı ayarlarını yükle (önce cookie, yoksa localStorage)
    const userSettings = getCurrentUserSettings();
    if (userSettings) {
        selectedTheme = userSettings.theme || 'light';
        selectedLanguage = userSettings.language || 'tr';
        console.log("📥 Cookie'den ayarlar yüklendi:", userSettings);
    } else {
        selectedTheme = localStorage.getItem('theme') || 'light';
        selectedLanguage = localStorage.getItem('siteLanguage') || 'tr';
    }

    updateThemeButtons(selectedTheme);
    updateLanguageButtons(selectedLanguage);
    updateSaveButton();

    // Tema butonları
    if (lightBtn) lightBtn.addEventListener("click", () => selectTheme('light'));
    if (darkBtn) darkBtn.addEventListener("click", () => selectTheme('dark'));
    if (autoBtn) autoBtn.addEventListener("click", () => selectTheme('system'));

    // Dil butonları
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });

    // Kaydet butonu
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // Geçmiş temizleme
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearChatHistory);
    }

    console.log("✅ Settings page hazır.");
}

// Tema seçimi
function selectTheme(theme) {
    selectedTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeButtons(theme);
    updateSaveButton();
    showTempChange(`Tema seçildi: ${theme} - Kaydetmek için butona basın`);
}

// Dil seçimi
function selectLanguage(lang) {
    selectedLanguage = lang;
    if (typeof setLanguage === 'function') setLanguage(lang, true);
    updateLanguageButtons(lang);
    updateSaveButton();
    showTempChange(`Dil seçildi: ${lang.toUpperCase()} - Kaydetmek için butona basın`);
}

// Kaydetme işlemi
function saveSettings() {
    console.log("💾 Ayarlar kaydediliyor:", { selectedTheme, selectedLanguage });

    // Cookie + LocalStorage kaydet
    saveCurrentUserSettings(selectedLanguage, selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    localStorage.setItem('siteLanguage', selectedLanguage);

    document.documentElement.setAttribute("data-theme", selectedTheme);
    if (typeof setLanguage === 'function') setLanguage(selectedLanguage, true);

    showSettingsToast('✅ Ayarlar başarıyla kaydedildi!', 'success');
    updateSaveButton();
}

// --- Yardımcı fonksiyonlar ---
function updateThemeButtons(theme) {
    const buttons = {
        light: document.getElementById("lightThemeBtn"),
        dark: document.getElementById("darkThemeBtn"), 
        system: document.getElementById("autoThemeBtn")
    };

    Object.values(buttons).forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    if (buttons[theme]) buttons[theme].classList.add('active');
}

function updateLanguageButtons(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

function updateSaveButton() {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (!saveSettingsBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentLanguage = localStorage.getItem('siteLanguage') || 'tr';
    const hasChanges = (selectedTheme !== currentTheme) || (selectedLanguage !== currentLanguage);

    if (hasChanges) {
        saveSettingsBtn.disabled = false;
        saveSettingsBtn.style.opacity = '1';
        saveSettingsBtn.style.cursor = 'pointer';
        saveSettingsBtn.textContent = 'Değişiklikleri Kaydet';
    } else {
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.style.opacity = '0.6';
        saveSettingsBtn.style.cursor = 'not-allowed';
        saveSettingsBtn.textContent = 'Ayarlar Kayıtlı';
    }
}

function showTempChange(message) {
    const toast = document.getElementById('settingsToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'settings-toast show temp';
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showSettingsToast(message, type = 'info') {
    const toast = document.getElementById('settingsToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `settings-toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/settings') {
        initSettingsPage();
    }
});

window.initSettingsPage = initSettingsPage;
