// settings.js - DÜZELTİLMİŞ DİL KISMI

let hasUnsavedChanges = false;
let selectedTheme = '';
let selectedLanguage = '';

function initSettingsPage() {
    const lightBtn = document.getElementById("lightThemeBtn");
    const darkBtn = document.getElementById("darkThemeBtn");
    const autoBtn = document.getElementById("autoThemeBtn");
    const langButtons = document.querySelectorAll('.lang-btn'); // DEĞİŞTİ
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // Mevcut ayarları yükle
    loadCurrentSettings();

    // Tema butonları (mevcut kod)
    lightBtn.addEventListener("click", () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme !== 'light') {
            selectedTheme = 'light';
            document.documentElement.setAttribute("data-theme", "light");
            hasUnsavedChanges = true;
            updateSaveButton();
            showTempChange('Light theme selected - UNSAVED');
        }
    });

    darkBtn.addEventListener("click", () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme !== 'dark') {
            selectedTheme = 'dark';
            document.documentElement.setAttribute("data-theme", "dark");
            hasUnsavedChanges = true;
            updateSaveButton();
            showTempChange('Dark theme selected - UNSAVED');
        }
    });

    autoBtn.addEventListener("click", () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme !== 'system') {
            selectedTheme = 'system';
            document.documentElement.setAttribute("data-theme", "system");
            hasUnsavedChanges = true;
            updateSaveButton();
            showTempChange('System theme selected - UNSAVED');
        }
    });

    // Dil butonları - DÜZELTİLDİ
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const currentLang = localStorage.getItem('siteLanguage') || 'tr';
            
            if (currentLang !== lang) {
                selectedLanguage = lang;
                hasUnsavedChanges = true;
                updateSaveButton();
                updateLanguageButtons();
                showTempChange(lang.toUpperCase() + ' language selected - UNSAVED');
            }
        });
    });

    // Ayarları Kaydet butonu
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // Sayfadan çıkış kontrolü (mevcut kod)
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });

    // SPA yönlendirme kontrolü (mevcut kod)
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
        if (hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
                return;
            }
        }
        return originalPushState.apply(this, arguments);
    };
}

function loadCurrentSettings() {
    // Cookie'den mevcut ayarları yükle
    const userSettings = getCurrentUserSettings();
    
    if (userSettings) {
        selectedTheme = userSettings.theme;
        selectedLanguage = userSettings.language;
        
        // LocalStorage'ı da güncelle
        localStorage.setItem('theme', userSettings.theme);
        localStorage.setItem('siteLanguage', userSettings.language);
        
        // Temayı hemen uygula
        document.documentElement.setAttribute("data-theme", userSettings.theme);
    } else {
        // Cookie yoksa localStorage'dan al
        selectedTheme = localStorage.getItem('theme') || 'light';
        selectedLanguage = localStorage.getItem('siteLanguage') || 'tr';
    }
    
    // Butonları güncelle
    updateThemeButtons();
    updateLanguageButtons();
    
    console.log('Loaded settings:', { theme: selectedTheme, language: selectedLanguage });
}

function updateThemeButtons() {
    const lightBtn = document.getElementById("lightThemeBtn");
    const darkBtn = document.getElementById("darkThemeBtn");
    const autoBtn = document.getElementById("autoThemeBtn");
    
    // Tüm tema butonlarını resetle
    [lightBtn, darkBtn, autoBtn].forEach(btn => {
        btn.classList.remove('active');
    });

    // Seçili temayı vurgula
    const currentTheme = selectedTheme || localStorage.getItem('theme') || 'light';
    if (currentTheme === 'light') lightBtn.classList.add('active');
    else if (currentTheme === 'dark') darkBtn.classList.add('active');
    else if (currentTheme === 'system') autoBtn.classList.add('active');
}

function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Tüm dil butonlarını resetle
    langButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Seçili dili vurgula
    const currentLang = selectedLanguage || localStorage.getItem('siteLanguage') || 'tr';
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        }
    });
}

function saveSettings() {
    // Seçili değerleri kontrol et
    const themeToSave = selectedTheme || localStorage.getItem('theme') || 'light';
    const langToSave = selectedLanguage || localStorage.getItem('siteLanguage') || 'tr';
    
    console.log('Saving settings:', { theme: themeToSave, language: langToSave });

    // 1. Önce LocalStorage'a kaydet
    localStorage.setItem('theme', themeToSave);
    localStorage.setItem('siteLanguage', langToSave);
    
    // 2. Temayı uygula
    document.documentElement.setAttribute("data-theme", themeToSave);
    
    // 3. Cookie'ye kaydet
    const success = saveCurrentUserSettings(langToSave, themeToSave);
    
    if (success) {
        hasUnsavedChanges = false;
        updateSaveButton();
        showSettingsToast('✅ Settings saved successfully!', 'success');
        
        // Sayfayı yenile
        setTimeout(() => {
            location.reload();
        }, 1500);
        
    } else {
        showSettingsToast('❌ Failed to save settings', 'error');
    }
}

function updateSaveButton() {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        if (hasUnsavedChanges) {
            saveSettingsBtn.style.display = 'block';
            saveSettingsBtn.textContent = 'Save Changes';
            saveSettingsBtn.style.background = '#ff9800';
        } else {
            saveSettingsBtn.style.display = 'none';
        }
    }
}

function showTempChange(message) {
    const toast = document.getElementById('settingsToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'settings-toast show temp';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function showSettingsToast(message, type = 'info') {
    const toast = document.getElementById('settingsToast');
    if (toast) {
        toast.textContent = message;
        toast.className = `settings-toast show ${type}`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Sayfa yüklendiğinde kaydet butonunu gizle
document.addEventListener('DOMContentLoaded', function() {
    updateSaveButton();
});