// ======================================================
// 1️⃣ GLOBAL AYARLAR
// ------------------------------------------------------
const urlPageTitle = "HISTORY PERSONAS";

// ======================================================
// 2️⃣ LINK TIKLAMALARINI YÖNETEN EVENT - SPA Hijacker
// ------------------------------------------------------
document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a");
  if (anchor && anchor.href.startsWith(window.location.origin) && !anchor.target) {
    e.preventDefault();
    urlRoute(e, anchor);
  }
});

// ======================================================
// 3️⃣ ROUTE HARİTASI
// ------------------------------------------------------
const urlRoutes = {
  404: {
    template: "/pages/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found",
  },
  "/": {
    template: "/pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the Home page",
  },
  "/home": {
    template: "/pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the Home page",
  },
  "/conversations": {
    template: "/pages/conversations.html",
    title: "Conversations | " + urlPageTitle,
    description: "This is the Conversations Page",
  },
  "/chat": {
    template: "/pages/chatScreen.html",
    title: "Chat | " + urlPageTitle,
    description: "This is the Chat Page",
  },
  "/settings": {
    template: "/pages/settings.html",
    title: "Settings | " + urlPageTitle,
    description: "This is the Settings Page",
  },
  "/login": {
    template: "/pages/login.html",
    title: "Login | " + urlPageTitle,
    description: "This is the Login Page",
  },
  "/signup": {
    template: "/pages/login.html",
    title: "Sign Up | " + urlPageTitle,
    description: "This is the Sign Up Page",
  },
  "/logout": {
    action: () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserEmail");
      window.history.pushState({}, "", "/login");
      urlLocationHandler();
    },
  },
};

// ======================================================
// 4️⃣ URL DEĞİŞİMİ
// ------------------------------------------------------
const urlRoute = (event, anchorElement) => {
  event = event || window.event;
  const target = anchorElement || event.target;

  if (urlRoutes[target.pathname]?.action) {
    urlRoutes[target.pathname].action();
    return;
  }

  window.history.pushState({}, "", target.href);
  urlLocationHandler();
};

// ======================================================
// 5️⃣ ROUTING MEKANİZMASI - ÇEVİRİ EKLENDİ
// ------------------------------------------------------
const urlLocationHandler = async () => {
  let location = window.location.pathname;
  if (location.length === 0) location = "/";

  // ⚠️ /home URL'sini /'a yönlendir
  if (location === "/home") {
    window.history.replaceState({}, "", "/");
    location = "/";
  }

  if (urlRoutes[location]?.action) {
    urlRoutes[location].action();
    return;
  }

  if (!urlRoutes[location]) {
    window.history.pushState({}, "", "/404");
    location = "/404";
  }

  const route = urlRoutes[location];
  const html = await fetch(route.template).then((res) => res.text());
  document.getElementById("content").innerHTML = html;

  // 🍪 Cookie'den kullanıcı ayarlarını yükle (settings sayfasında)
  if (location === "/settings" && typeof getCurrentUserSettings === "function") {
    setTimeout(() => {
      const cookieSettings = getCurrentUserSettings();
      if (cookieSettings && cookieSettings.language && cookieSettings.theme) {
        console.log("🍪 Cookie'den alınan ayarlar:", cookieSettings);
        localStorage.setItem("siteLanguage", cookieSettings.language);
        localStorage.setItem("theme", cookieSettings.theme);
        document.documentElement.setAttribute("data-theme", cookieSettings.theme);
      }
    }, 200);
  }

  // Sayfa özelleştirmeleri
  applyUserSettings();

  // ⚠️ ÇEVİRİLERİ UYGULA
  setTimeout(() => {
    if (typeof applyTranslationsToNewPage === 'function') {
      console.log("Çeviriler uygulanıyor...");
      applyTranslationsToNewPage();
    }
  }, 50);

  // SAYFA YÜKLENDİKTEN SONRA İNİT FONKSİYONLARI
  setTimeout(() => {
    console.log(`Router: ${location} sayfası init ediliyor`);

    if (location === "/" || location === "/home") {
      if (typeof initHomePage === 'function') {
        initHomePage();
      } else if (typeof loadHistoricalFigures === 'function') {
        loadHistoricalFigures();
      }
    } else if (location === "/settings") {
      if (typeof initSettingsPage === 'function') {
        initSettingsPage();
      }
    } else if (location === "/login" || location === "/signup") {
      if (typeof initLoginPage === 'function') {
        initLoginPage();
      }
    } else if (location === "/conversations") {
      if (typeof loadConversations === 'function') {
        loadConversations();
      }
    } else if (location === "/404") {
      if (typeof init404Page === 'function') {
        init404Page();
      }
    }
  }, 150);

  // Navbar UI her sayfa yüklemesinde yenilensin
  updateNavbarUI();

  document.title = route.title;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description);
};

// ======================================================
// 6️⃣ USER SETTINGS (COOKIE DESTEKLİ)
// ------------------------------------------------------
function getCurrentUserSettings() {
  const currentUserEmail = localStorage.getItem("currentUserEmail");
  if (!currentUserEmail) return null;

  // 🍪 Cookie’den oku (cookieManager.js fonksiyonlarıyla)
  if (typeof loadUserSettings === "function") {
    const cookieData = loadUserSettings(currentUserEmail);
    if (cookieData) {
      return {
        email: currentUserEmail,
        language: cookieData.language || 'tr',
        theme: cookieData.theme || 'light'
      };
    }
  }

  // Eğer cookie yoksa localStorage’dan devam et
  const users = JSON.parse(localStorage.getItem("kullanicilar") || "[]");
  const currentUser = users.find(u => u.email === currentUserEmail);

  if (!currentUser) return null;

  return {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    theme: currentUser.theme || 'light',
    language: currentUser.language || 'en'
  };
}

// ======================================================
// applyUserSettings - localStorage + cookie senkronizasyonu
// ------------------------------------------------------
function applyUserSettings() {
  console.log("🔧 applyUserSettings ÇALIŞIYOR");

  const userSettings = getCurrentUserSettings();
  const savedLang = localStorage.getItem("siteLanguage");
  const savedTheme = localStorage.getItem("theme");

  console.log("📊 Mevcut Durum:", { userSettings, savedLang, savedTheme });

  if (userSettings) {
    console.log("✅ Kullanıcı giriş yapmış - user settings kullanılıyor");
    if (userSettings.theme) {
      document.documentElement.setAttribute("data-theme", userSettings.theme);
      localStorage.setItem("theme", userSettings.theme);
    }
    if (userSettings.language) {
      localStorage.setItem("siteLanguage", userSettings.language);
      console.log("🔄 User'dan dil ayarlandı:", userSettings.language);
    }
  } else {
    console.log("❌ Kullanıcı giriş yapmamış - localStorage kullanılıyor");
    const theme = savedTheme || 'light';
    const lang = savedLang || 'tr';

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("siteLanguage", lang);
  }

  console.log("🎯 Son Durum:", {
    theme: localStorage.getItem("theme"),
    language: localStorage.getItem("siteLanguage")
  });
}

// ======================================================
// 🔹 NAVBAR GÖRÜNÜRLÜK
// ======================================================
let toggleInitialized = false;
function updateNavbarUI() {
  const navbar = document.getElementById("navbar");
  const currentPath = window.location.pathname;

  console.log("🔄 updateNavbarUI çalıştı, path:", currentPath);

  if (!navbar) {
    console.log("❌ Navbar element bulunamadı");
    return;
  }

  if (currentPath === "/login" || currentPath === "/signup") {
    navbar.style.display = "none";
    return;
  } else {
    navbar.style.display = "flex";
  }

  const authDropdown = document.querySelector(".authDropdown");
  const userDropdown = document.querySelector(".userDropdown");
  const navUserAvatar = document.getElementById("navUserAvatar");

  const currentUserEmail = localStorage.getItem("currentUserEmail");
  const users = JSON.parse(localStorage.getItem("kullanicilar") || "[]");
  const currentUser = users.find(u => u.email === currentUserEmail);

  console.log("👤 Kullanıcı durumu:", {
    currentUserEmail,
    currentUser: currentUser ? {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      hasProfilePhoto: !!(currentUser.profilePhoto && currentUser.profilePhoto.trim()),
      profilePhotoLength: currentUser.profilePhoto ? currentUser.profilePhoto.length : 0
    } : 'Kullanıcı yok'
  });

  if (currentUser) {
    if (authDropdown) authDropdown.style.display = "none";
    if (userDropdown) userDropdown.style.display = "flex";

    if (navUserAvatar) {
      const firstName = currentUser.firstName || '';
      const lastName = currentUser.lastName || '';
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

      console.log("🎯 Avatar güncelleniyor:", {
        firstName,
        lastName,
        initials,
        hasProfilePhoto: !!(currentUser.profilePhoto && currentUser.profilePhoto.trim())
      });

      // 📸 PROFİL FOTOĞRAFI KONTROLÜ
      if (currentUser.profilePhoto && currentUser.profilePhoto.trim() !== "") {
        console.log("✅ Profil fotoğrafı gösteriliyor");
        // Profil fotoğrafı varsa - fotoğrafı göster
        navUserAvatar.style.backgroundImage = `url(${currentUser.profilePhoto})`;
        navUserAvatar.style.backgroundSize = "cover";
        navUserAvatar.style.backgroundPosition = "center";
        navUserAvatar.textContent = ""; // Yazıyı temizle
        navUserAvatar.style.backgroundColor = "transparent"; // Arkaplan rengini kaldır
      } else {
        console.log("ℹ️ Baş harfler gösteriliyor");
        // Profil fotoğrafı yoksa - baş harfleri göster
        navUserAvatar.style.backgroundImage = "none";
        navUserAvatar.textContent = initials || 'U';
        navUserAvatar.style.backgroundColor = "#4CAF50"; // İstediğiniz bir renk
      }

      navUserAvatar.title = `${firstName} ${lastName}`;
    }
  } else {
    console.log("🚪 Kullanıcı giriş yapmamış");
    if (authDropdown) authDropdown.style.display = "flex";
    if (userDropdown) userDropdown.style.display = "none";
  }


  // ToogleSwitch
  const toggle = document.getElementById('modeToggle');
  const slider = document.querySelector('.slider');

  if (toggle && !toggleInitialized) {
    toggleInitialized = true;

    // Başlangıç durumu: localStorage'dan oku
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggle.checked = currentTheme === 'dark';
    slider.textContent = currentTheme === 'dark' ? '🌙' : '🌞';

    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      slider.textContent = newTheme === 'dark' ? '🌙' : '🌞';
    });
  }
}

// ======================================================
// 7️⃣ TARAYICI GERİ/İLERİ DESTEĞİ
// ------------------------------------------------------
window.onpopstate = urlLocationHandler;

// ======================================================
// 8️⃣ DIŞA AKTARIM
// ------------------------------------------------------
window.urlRoute = urlRoute;
window.updateNavbarUI = updateNavbarUI;
window.getCurrentUserSettings = getCurrentUserSettings;

// ======================================================
// 9️⃣ İLK YÜKLEME
// ------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log("Router: DOM loaded, initial route handling");
  urlLocationHandler();
});

window.addEventListener('load', () => {
  console.log("Router: Window loaded");
});
