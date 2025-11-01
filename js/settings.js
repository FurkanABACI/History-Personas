// ======================================================
// INIT SETTINGS PAGE
// Sayfa yüklendiğinde butonları ata ve eventleri başlat
function initSettingsPage() {
    const profileUpdateBtn = document.getElementById('profileUpdateBtn');
    const profileDialog = document.getElementById('profileDialog');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelDialogBtn = document.getElementById('cancelDialogBtn');
    
    const lightBtn = document.getElementById("lightThemeBtn");
    const darkBtn = document.getElementById("darkThemeBtn");
    const autoBtn = document.getElementById("autoThemeBtn");
    const langButtons = document.querySelectorAll('.lang-btn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (profileUpdateBtn) profileUpdateBtn.addEventListener('click', openProfileDialog);
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);
    if (cancelDialogBtn) cancelDialogBtn.addEventListener('click', closeProfileDialog);

    if (lightBtn) lightBtn.addEventListener("click", () => selectTheme('light'));
    if (darkBtn) darkBtn.addEventListener("click", () => selectTheme('dark'));
    if (autoBtn) autoBtn.addEventListener("click", () => selectTheme('system'));

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });

    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearChatHistory);
}

// ======================================================
// PROFILE MANAGEMENT
// Profil dialog aç, kaydet ve kapat fonksiyonları
function openProfileDialog() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const currentUser = users.find(u => u.email === currentUserEmail);
    if (!currentUser) { alert('❌ Kullanıcı bilgileri bulunamadı!'); return; }

    document.getElementById('dialogFirstName').value = currentUser.firstName || '';
    document.getElementById('dialogLastName').value = currentUser.lastName || '';
    document.getElementById('dialogEmail').value = currentUser.email || '';
    document.getElementById('dialogPhoto').value = '';

    document.getElementById('profileDialog').showModal();
}

function closeProfileDialog() {
    document.getElementById('profileDialog').close();
}

function saveProfile() {
    const firstName = document.getElementById('dialogFirstName').value.trim();
    const lastName = document.getElementById('dialogLastName').value.trim();
    const email = document.getElementById('dialogEmail').value.trim();
    const photoFile = document.getElementById('dialogPhoto').files[0];
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (!firstName || !lastName || !email) { alert('❌ Lütfen tüm alanları doldurun!'); return; }
    if (!email.includes('@')) { alert('❌ Geçerli bir email girin!'); return; }

    let users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex === -1) { alert('❌ Kullanıcı bulunamadı!'); return; }

    if (email !== currentUserEmail && users.find(u => u.email === email && u.email !== currentUserEmail)) {
        alert('❌ Bu email zaten kullanılıyor!'); return;
    }

    if (photoFile) {
        if (photoFile.size > 5 * 1024 * 1024) { alert('❌ Dosya 5MB’dan küçük olmalı!'); return; }
        const reader = new FileReader();
        reader.onload = function(e) { completeProfileUpdate(e.target.result); };
        reader.onerror = function() { alert('❌ Dosya okunurken hata!'); };
        reader.readAsDataURL(photoFile);
    } else {
        completeProfileUpdate(users[userIndex].profilePhoto);
    }

    function completeProfileUpdate(profilePhoto) {
        users[userIndex].firstName = firstName;
        users[userIndex].lastName = lastName;
        users[userIndex].email = email;
        users[userIndex].profilePhoto = profilePhoto;

        localStorage.setItem('kullanicilar', JSON.stringify(users));
        if (email !== currentUserEmail) localStorage.setItem('currentUserEmail', email);

        alert('✅ Profil başarıyla güncellendi!');
        closeProfileDialog();
        setTimeout(() => { if (typeof updateNavbarUI === 'function') updateNavbarUI(); }, 500);
    }
}

// ======================================================
// OTHER SETTINGS FUNCTIONS
// Tema ve dil seçimi, ayar kaydetme ve geçmiş temizleme
function selectTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    showToast('Tema değiştirildi: ' + theme);
}

function selectLanguage(lang) {
    localStorage.setItem('siteLanguage', lang);
    if (typeof setLanguage === 'function') setLanguage(lang, true);
    showToast('Dil değiştirildi: ' + lang.toUpperCase());
}

function saveSettings() {
    showToast('✅ Ayarlar başarıyla kaydedildi!');
}

function clearChatHistory() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
        const userIndex = users.findIndex(u => u.email === currentUserEmail);
        if (userIndex !== -1 && users[userIndex].conversations) {
            users[userIndex].conversations = [];
            localStorage.setItem('kullanicilar', JSON.stringify(users));
        }
    }
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('conversations');
    showToast('✅ Sohbet geçmişi temizlendi!');
}

// ======================================================
// TOAST MESSAGE
// Ayarlar sayfası bildirimleri
function showToast(message) {
    const toast = document.getElementById('settingsToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'settings-toast show';
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    } else {
        alert(message);
    }
}

// ======================================================
// DOMCONTENTLOADED
// Sayfa yüklendiğinde settings init
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/settings') initSettingsPage();
});

// Router için global fonksiyon
window.initSettingsPage = initSettingsPage;
