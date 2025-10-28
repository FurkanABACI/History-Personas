// cookieManager.js - TRY-CATCH'LER KALDIRILDI

// Cookie oluştur
function setCookie(name, value, days = 365) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    console.log('Cookie set:', name);
    return true;
}

// Cookie oku
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
        if (cookie.indexOf(nameEQ) === 0) {
            const value = decodeURIComponent(cookie.substring(nameEQ.length));
            console.log('Cookie found:', name, value);
            return value;
        }
    }
    console.log('Cookie not found:', name);
    return null;
}

// Kullanıcı ayarlarını kaydet
function saveUserSettings(email, language, theme) {
    const settings = JSON.stringify({
        language: language,
        theme: theme
    });
    console.log('Saving user settings:', { email: email, language: language, theme: theme });
    const success = setCookie("user_" + email, settings);
    if (success) {
        console.log('✅ User settings saved successfully');
    } else {
        console.log('❌ Failed to save user settings');
    }
    return success;
}

// Kullanıcı ayarlarını yükle
function loadUserSettings(email) {
    const settings = getCookie("user_" + email);
    if (settings) {
        const parsedSettings = JSON.parse(settings);
        console.log('✅ User settings loaded:', { email: email, settings: parsedSettings });
        return parsedSettings;
    } else {
        console.log('❌ No settings found for user:', email);
        return null;
    }
}

// Giriş yapan kullanıcının ayarlarını al
function getCurrentUserSettings() {
    const currentUser = localStorage.getItem("currentUserEmail");
    if (!currentUser) {
        console.log('No current user found in localStorage');
        return null;
    }
    console.log('Getting settings for current user:', currentUser);
    const settings = loadUserSettings(currentUser);
    return settings;
}

// Giriş yapan kullanıcının ayarlarını kaydet
function saveCurrentUserSettings(language, theme) {
    const currentUser = localStorage.getItem("currentUserEmail");
    if (!currentUser) {
        console.log('❌ No current user - cannot save settings');
        return false;
    }
    console.log('Saving current user settings:', { user: currentUser, language: language, theme: theme });
    const success = saveUserSettings(currentUser, language, theme);
    
    // Hemen kontrol et
    if (success) {
        const verifySettings = loadUserSettings(currentUser);
        console.log('Verified saved settings:', verifySettings);
    }
    
    return success;
}

// Tüm kullanıcı cookie'lerini listele (debug için)
function listAllUserCookies() {
    const cookies = document.cookie.split(';');
    const userCookies = cookies.filter(cookie => cookie.includes('user_'));
    console.log('All user cookies:', userCookies);
    return userCookies;
}

// Belirli bir kullanıcının cookie'sini sil
function deleteUserSettings(email) {
    document.cookie = "user_" + email + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    console.log('User settings deleted:', email);
    return true;
}