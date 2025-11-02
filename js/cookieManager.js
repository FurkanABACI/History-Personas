// ======================================================
// COOKIE HELPER FUNCTIONS
// Cookie oluştur, oku ve sil

// Cookie oluştur
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  return true;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ======================================================
// USER SETTINGS VIA COOKIE
// Kullanıcı ayarlarını kaydet ve yükle

// Belirli kullanıcı için ayarları kaydet
function saveUserSettings(email, language, theme) {
  if (!email) return false;
  const data = JSON.stringify({ language, theme });
  return setCookie("user_" + email, data);
}

// Belirli kullanıcı için ayarları yükle
function loadUserSettings(email) {
  const data = getCookie("user_" + email);
  return data ? JSON.parse(data) : null;
}

// ======================================================
// CURRENT USER SETTINGS
// LocalStorage'daki geçerli kullanıcıya göre ayarları getir/kaydet

function getCurrentUserSettings() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return null;
  return loadUserSettings(email);
}

function saveCurrentUserSettings(language, theme) {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return false;
  return saveUserSettings(email, language, theme);
}