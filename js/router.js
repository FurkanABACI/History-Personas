<<<<<<< HEAD
const urlPageTitle = "HISTORY PERSONAS";

=======
// ======================================================
// GLOBAL AYARLAR

const { title } = require("process");

// Site başlığı ve temel değişkenler
const urlPageTitle = "HISTORY PERSONAS";

// ======================================================
// SPA LINK TIKLAMALARI
// Sayfa yenilenmeden link tıklamalarını yakala ve yönlendir
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a");
  if (anchor && anchor.href.startsWith(window.location.origin) && !anchor.target) {
    e.preventDefault();
    urlRoute(e, anchor);
  }
});

<<<<<<< HEAD
=======
// ======================================================
// ROUTE HARİTASI
// URL ve sayfa eşleştirmeleri, özel action fonksiyonları
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
const urlRoutes = {
  404: {
    template: "/pages/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found"
  },
  "/": {
    template: "/pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the Home page"
  },
  "/home": {
    template: "/pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the Home page"
  },
  "/conversations": {
    template: "/pages/conversations.html",
    title: "Conversations | " + urlPageTitle,
    description: "This is the Conversations Page"
  },
  "/chatScreen":{
    template:"/pages/chatScreen.html",
    title:"Chat Screen | "+urlPageTitle,
        description: "This is the Chat Screen Page"
  },
  "/settings": {
    template: "/pages/settings.html",
    title: "Settings | " + urlPageTitle,
    description: "This is the Settings Page"
  },
  "/login": {
    template: "/pages/login.html",
    title: "Login | " + urlPageTitle,
    description: "This is the Login Page"
  },
  "/signup": {
    template: "/pages/login.html",
    title: "Sign Up | " + urlPageTitle,
    description: "This is the Sign Up Page"
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

<<<<<<< HEAD
=======
// ======================================================
// URL YÖNLENDİRME FONKSİYONU
// Link tıklamalarında doğru route'u uygular
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
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

<<<<<<< HEAD
=======
// ======================================================
// ROUTING MEKANİZMASI
// Sayfa yükleme, template fetch, çeviri ve init fonksiyonları
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
const urlLocationHandler = async () => {
  let location = window.location.pathname;
  if (location.length === 0) location = "/";

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

  if (location === "/settings" && typeof getCurrentUserSettings === "function") {
    setTimeout(() => {
      const cookieSettings = getCurrentUserSettings();
      if (cookieSettings && cookieSettings.language && cookieSettings.theme) {
        localStorage.setItem("siteLanguage", cookieSettings.language);
        localStorage.setItem("theme", cookieSettings.theme);
        document.documentElement.setAttribute("data-theme", cookieSettings.theme);
      }
    }, 200);
  }

  applyUserSettings();

  setTimeout(() => {
<<<<<<< HEAD
    if (typeof applyTranslationsToNewPage === 'function') {
      applyTranslationsToNewPage();
    }
=======
    if (typeof applyTranslationsToNewPage === 'function') { }
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
  }, 50);

  setTimeout(() => {
    if (location === "/" || location === "/home") {
      if (typeof initHomePage === 'function') initHomePage();
      else if (typeof loadHistoricalFigures === 'function') loadHistoricalFigures();
    } else if (location === "/settings") {
      if (typeof initSettingsPage === 'function') initSettingsPage();
    } else if (location === "/login" || location === "/signup") {
      if (typeof initLoginPage === 'function') initLoginPage();
    } else if (location === "/conversations") {
<<<<<<< HEAD
      if (typeof loadConversations === 'function') {
        loadConversations();
      }
    } else if (location === "/chat") {
      if (typeof initChatScreen === 'function') {
        initChatScreen();
      }
=======
      if (typeof loadConversations === 'function') loadConversations();
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
    } else if (location === "/404") {
      if (typeof init404Page === 'function') init404Page();
    }
  }, 150);

  updateNavbarUI();

  document.title = route.title;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description);
};

<<<<<<< HEAD
=======
// ======================================================
// USER SETTINGS (COOKIE + localStorage)
// Kullanıcının dil ve tema ayarlarını al
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
function getCurrentUserSettings() {
  const currentUserEmail = localStorage.getItem("currentUserEmail");
  if (!currentUserEmail) return null;

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

<<<<<<< HEAD
function applyUserSettings() {

=======
// ======================================================
// applyUserSettings
// Kullanıcı ayarlarını sayfaya uygular
function applyUserSettings() {
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
  const userSettings = getCurrentUserSettings();
  const savedLang = localStorage.getItem("siteLanguage");
  const savedTheme = localStorage.getItem("theme");

<<<<<<< HEAD

=======
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
  if (userSettings) {
    if (userSettings.theme) {
      document.documentElement.setAttribute("data-theme", userSettings.theme);
      localStorage.setItem("theme", userSettings.theme);
    }
<<<<<<< HEAD
    if (userSettings.language) {
      localStorage.setItem("siteLanguage", userSettings.language);
    }
=======
    if (userSettings.language) localStorage.setItem("siteLanguage", userSettings.language);
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
  } else {
    const theme = savedTheme || 'light';
    const lang = savedLang || 'tr';
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("siteLanguage", lang);
  }
}

<<<<<<< HEAD
=======
// ======================================================
// NAVBAR GÖRÜNÜRLÜK VE TOGGLE
// Navbar elemanlarını göster/gizle ve tema toggle
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
let toggleInitialized = false;
function updateNavbarUI() {
  const navbar = document.getElementById("navbar");
  const currentPath = window.location.pathname;
<<<<<<< HEAD



  if (!navbar) {

    return;
  }
=======
  if (!navbar) return;
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee

  if (currentPath === "/login" || currentPath === "/signup") {
    navbar.style.display = "none";
    return;
  } else navbar.style.display = "flex";

  const authDropdown = document.querySelector(".authDropdown");
  const userDropdown = document.querySelector(".userDropdown");
  const navUserAvatar = document.getElementById("navUserAvatar");
  const currentUserEmail = localStorage.getItem("currentUserEmail");
  const users = JSON.parse(localStorage.getItem("kullanicilar") || "[]");
  const currentUser = users.find(u => u.email === currentUserEmail);

  if (currentUser) {
    if (authDropdown) authDropdown.style.display = "none";
    if (userDropdown) userDropdown.style.display = "flex";

    if (navUserAvatar) {
      const firstName = currentUser.firstName || '';
      const lastName = currentUser.lastName || '';
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

<<<<<<< HEAD

      if (currentUser.profilePhoto && currentUser.profilePhoto.trim() !== "") {

=======
      if (currentUser.profilePhoto && currentUser.profilePhoto.trim() !== "") {
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
        navUserAvatar.style.backgroundImage = `url(${currentUser.profilePhoto})`;
        navUserAvatar.style.backgroundSize = "cover";
        navUserAvatar.style.backgroundPosition = "center";
        navUserAvatar.textContent = "";
        navUserAvatar.style.backgroundColor = "transparent";
      } else {
<<<<<<< HEAD

=======
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
        navUserAvatar.style.backgroundImage = "none";
        navUserAvatar.textContent = initials || 'U';
        navUserAvatar.style.backgroundColor = "#4CAF50";
      }

      navUserAvatar.title = `${firstName} ${lastName}`;
    }
  } else {
    if (authDropdown) authDropdown.style.display = "flex";
    if (userDropdown) userDropdown.style.display = "none";
  }

<<<<<<< HEAD

=======
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
  const toggle = document.getElementById('modeToggle');
  const slider = document.querySelector('.slider');

  if (toggle && !toggleInitialized) {
    toggleInitialized = true;
<<<<<<< HEAD

=======
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
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

<<<<<<< HEAD
window.onpopstate = urlLocationHandler;

=======
// ======================================================
// TARAYICI GERİ/İLERİ DESTEĞİ
// onpopstate ile SPA navigasyonunu yönet
window.onpopstate = urlLocationHandler;

// ======================================================
// DIŞA AKTARIM
// Global erişim için fonksiyonları window'a ata
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
window.urlRoute = urlRoute;
window.updateNavbarUI = updateNavbarUI;
window.getCurrentUserSettings = getCurrentUserSettings;

<<<<<<< HEAD
=======
// ======================================================
// İLK YÜKLEME
// Sayfa yüklendiğinde route handler çalıştır
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
document.addEventListener('DOMContentLoaded', () => {
  urlLocationHandler();
});

<<<<<<< HEAD
window.addEventListener('load', () => {
});
=======
window.addEventListener('load', () => { });
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
