const urlPageTitle = "HISTORY PERSONAS";

document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a");
  if (anchor && anchor.href.startsWith(window.location.origin) && !anchor.target) {
    e.preventDefault();
    urlRoute(e, anchor);
  }
});

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
    if (typeof applyTranslationsToNewPage === 'function') {
      applyTranslationsToNewPage();
    }
  }, 50);

  setTimeout(() => {
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
    } else if (location === "/chat") {
      if (typeof initChatScreen === 'function') {
        initChatScreen();
      }
    } else if (location === "/404") {
      if (typeof init404Page === 'function') {
        init404Page();
      }
    }
  }, 150);

  updateNavbarUI();

  document.title = route.title;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description);
};

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

function applyUserSettings() {

  const userSettings = getCurrentUserSettings();
  const savedLang = localStorage.getItem("siteLanguage");
  const savedTheme = localStorage.getItem("theme");


  if (userSettings) {
    if (userSettings.theme) {
      document.documentElement.setAttribute("data-theme", userSettings.theme);
      localStorage.setItem("theme", userSettings.theme);
    }
    if (userSettings.language) {
      localStorage.setItem("siteLanguage", userSettings.language);
    }
  } else {
    const theme = savedTheme || 'light';
    const lang = savedLang || 'tr';

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("siteLanguage", lang);
  }
}

let toggleInitialized = false;
function updateNavbarUI() {
  const navbar = document.getElementById("navbar");
  const currentPath = window.location.pathname;



  if (!navbar) {

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

  if (currentUser) {
    if (authDropdown) authDropdown.style.display = "none";
    if (userDropdown) userDropdown.style.display = "flex";

    if (navUserAvatar) {
      const firstName = currentUser.firstName || '';
      const lastName = currentUser.lastName || '';
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();


      if (currentUser.profilePhoto && currentUser.profilePhoto.trim() !== "") {

        navUserAvatar.style.backgroundImage = `url(${currentUser.profilePhoto})`;
        navUserAvatar.style.backgroundSize = "cover";
        navUserAvatar.style.backgroundPosition = "center";
        navUserAvatar.textContent = "";
        navUserAvatar.style.backgroundColor = "transparent";
      } else {

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


  const toggle = document.getElementById('modeToggle');
  const slider = document.querySelector('.slider');

  if (toggle && !toggleInitialized) {
    toggleInitialized = true;

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

window.onpopstate = urlLocationHandler;

window.urlRoute = urlRoute;
window.updateNavbarUI = updateNavbarUI;
window.getCurrentUserSettings = getCurrentUserSettings;

document.addEventListener('DOMContentLoaded', () => {
  urlLocationHandler();
});

window.addEventListener('load', () => {
});
