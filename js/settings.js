// ======================================================
// ✅ BASİT AYARLAR SAYFASI
// ======================================================

function initSettingsPage() {
    console.log("⚙️ Settings page init ediliyor...");

    // Butonları bul
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

    // PROFİL GÜNCELLEME BUTONU
    if (profileUpdateBtn) {
        profileUpdateBtn.addEventListener('click', openProfileDialog);
    }
    
    // DIALOG BUTONLARI
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    
    if (cancelDialogBtn) {
        cancelDialogBtn.addEventListener('click', closeProfileDialog);
    }

    // TEMA BUTONLARI
    if (lightBtn) lightBtn.addEventListener("click", () => selectTheme('light'));
    if (darkBtn) darkBtn.addEventListener("click", () => selectTheme('dark'));
    if (autoBtn) autoBtn.addEventListener("click", () => selectTheme('system'));

    // DİL BUTONLARI
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });

    // AYARLARI KAYDET BUTONU
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // GEÇMİŞİ TEMİZLE BUTONU
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearChatHistory);
    }

    console.log("✅ Settings page hazır.");
}

// ======================================================
// PROFİL GÜNCELLEME FONKSİYONLARI
// ======================================================

function openProfileDialog() {
    console.log("📝 Profil dialog açılıyor...");
    
    // Mevcut kullanıcı bilgilerini al
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const currentUser = users.find(u => u.email === currentUserEmail);

    if (!currentUser) {
        alert('❌ Kullanıcı bilgileri bulunamadı! Lütfen tekrar giriş yapın.');
        return;
    }

    // Form alanlarını doldur
    document.getElementById('dialogFirstName').value = currentUser.firstName || '';
    document.getElementById('dialogLastName').value = currentUser.lastName || '';
    document.getElementById('dialogEmail').value = currentUser.email || '';
    document.getElementById('dialogPhoto').value = '';

    // Dialog'u göster
    document.getElementById('profileDialog').showModal();
}

function closeProfileDialog() {
    console.log("❌ Profil dialog kapatılıyor...");
    document.getElementById('profileDialog').close();
}

function saveProfile() {
    console.log("💾 Profil kaydediliyor...");
    
    const firstName = document.getElementById('dialogFirstName').value.trim();
    const lastName = document.getElementById('dialogLastName').value.trim();
    const email = document.getElementById('dialogEmail').value.trim();
    const photoFile = document.getElementById('dialogPhoto').files[0];
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    // Validasyon
    if (!firstName || !lastName || !email) {
        alert('❌ Lütfen tüm alanları doldurun!');
        return;
    }

    if (!email.includes('@')) {
        alert('❌ Geçerli bir email adresi girin!');
        return;
    }

    // Kullanıcıları güncelle
    let users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    
    if (userIndex === -1) {
        alert('❌ Kullanıcı bulunamadı!');
        return;
    }

    // Email değişti mi kontrol et
    if (email !== currentUserEmail) {
        const emailExists = users.find(u => u.email === email && u.email !== currentUserEmail);
        if (emailExists) {
            alert('❌ Bu email adresi zaten kullanılıyor!');
            return;
        }
    }

    // Fotoğraf işleme
    if (photoFile) {
        // Dosya boyutu kontrolü (max 5MB)
        if (photoFile.size > 5 * 1024 * 1024) {
            alert('❌ Dosya boyutu 5MB\'dan küçük olmalı!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            completeProfileUpdate(e.target.result);
        };
        reader.onerror = function() {
            alert('❌ Dosya okunurken hata oluştu!');
        };
        reader.readAsDataURL(photoFile);
    } else {
        // Fotoğraf değişmedi, mevcut fotoğrafı koru
        completeProfileUpdate(users[userIndex].profilePhoto);
    }

    function completeProfileUpdate(profilePhoto) {
        // Kullanıcı bilgilerini güncelle
        users[userIndex].firstName = firstName;
        users[userIndex].lastName = lastName;
        users[userIndex].email = email;
        users[userIndex].profilePhoto = profilePhoto;

        // localStorage'ı güncelle
        localStorage.setItem('kullanicilar', JSON.stringify(users));
        
        // Email değiştiyse currentUserEmail'i de güncelle
        if (email !== currentUserEmail) {
            localStorage.setItem('currentUserEmail', email);
            console.log('📧 Email güncellendi:', email);
        }

        console.log('✅ Profil güncellendi:', { firstName, lastName, email });
        alert('✅ Profil başarıyla güncellendi!');
        
        closeProfileDialog();
        
        // Navbar'ı güncelle
        setTimeout(() => {
            if (typeof updateNavbarUI === 'function') {
                updateNavbarUI();
            }
        }, 500);
    }
}

// ======================================================
// DİĞER AYAR FONKSİYONLARI
// ======================================================

function selectTheme(theme) {
    console.log('🎨 Tema seçildi:', theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    showToast('Tema değiştirildi: ' + theme);
}

function selectLanguage(lang) {
    console.log('🌐 Dil seçildi:', lang);
    localStorage.setItem('siteLanguage', lang);
    
    // Çevirileri güncelle
    if (typeof setLanguage === 'function') {
        setLanguage(lang, true);
    }
    
    showToast('Dil değiştirildi: ' + lang.toUpperCase());
}

function saveSettings() {
    console.log('💾 Ayarlar kaydediliyor...');
    showToast('✅ Ayarlar başarıyla kaydedildi!');
}

function clearChatHistory() {
    console.log('🗑️ Sohbet geçmişi temizleniyor...');
    
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (currentUserEmail) {
        // Kullanıcının sohbet geçmişini temizle
        const users = JSON.parse(localStorage.getItem('kullanicilar')) || [];
        const userIndex = users.findIndex(u => u.email === currentUserEmail);
        
        if (userIndex !== -1) {
            // conversations alanını temizle (eğer varsa)
            if (users[userIndex].conversations) {
                users[userIndex].conversations = [];
                localStorage.setItem('kullanicilar', JSON.stringify(users));
            }
        }
    }
    
    // Global sohbet geçmişini de temizle
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('conversations');
    
    showToast('✅ Sohbet geçmişi temizlendi!');
}

function showToast(message) {
    const toast = document.getElementById('settingsToast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'settings-toast show';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else {
        // Toast yoksa alert göster
        alert(message);
    }
}

// ======================================================
// SAYFA YÜKLEME
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, settings page kontrolü...');
    if (window.location.pathname === '/settings') {
        initSettingsPage();
    }
});

// Router için global fonksiyon
window.initSettingsPage = initSettingsPage;