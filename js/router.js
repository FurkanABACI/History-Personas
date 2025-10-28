// ======================================================
// ✅ 1) GLOBAL AYARLAR
// ------------------------------------------------------
const urlPageTitle = "HISTORY PERSONAS";
// Sayfa başlıklarında ortak kullanılacak ana başlık
// ======================================================



// ======================================================
// ✅ 2) LİNK TIKLAMALARINI YÖNETEN EVENT - SPA Hijacker
// ------------------------------------------------------
// Amaç: <a> tıklandığında sayfa yenilenmesini engellemek
// ve SPA yönlendirmesini devreye almak
document.addEventListener("click", (e) => {
  const anchor = e.target.closest('a'); // tıklananın <a> olup olmadığını bul

  if (
    anchor && anchor.href.startsWith(window.location.origin) && // Site içi link mi?
    !anchor.target // Yeni sekmede açılacak linkleri engelleme
  ) {
    e.preventDefault(); // Normal sayfa yenilemesini engelle
    urlRoute(e, anchor); // SPA yönlendirmesine devret
  }
});
// ======================================================



// ======================================================
// ✅ 3) ROUTE HARİTASI (URL - Page Mapping)
// ------------------------------------------------------
// Hangi URL → hangi HTML → hangi başlık → hangi açıklama?
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
  "/conversations": {
    template: "/pages/conversations.html",
    title: "Conversations | " + urlPageTitle,
    description: "This is the Conversations Page"
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
};
// ======================================================



// ======================================================
// ✅ 4) TARAYICI TARAFINDAN TETİKLENEN URL DEĞİŞİMİ
// ------------------------------------------------------
// Kullanıcı <a> tıkladığında çağrılır → URL güncellenir
// Ama sayfa yenilenmez!
const urlRoute = (event, anchorElement) => {
  event = event || window.event;
  const target = anchorElement || event.target;
  window.history.pushState({}, "", target.href); // URL çubuğunu değiştirir
  urlLocationHandler(); // Yeni URL’ye göre içeriği güncelle
};
// ======================================================



// ======================================================
// ✅ 5) ANA ROUTING MEKANİZMASI (Controller)
// ------------------------------------------------------
// URL'ye göre ilgili HTML sayfasını getirir → DOM'a yerleştirir
const urlLocationHandler = async () => {
  let location = window.location.pathname;
  if (location.length == 0) location = "/"; // Eğer boşsa → anasayfa

  // 404 KONTROLÜ
  if (!urlRoutes[location]) {
    window.history.pushState({}, "", "/404");
    location = "/404"; // location'ı güncelle ki 404 sayfası render edilsin
  }
  const route = urlRoutes[location] || urlRoutes[404]; // Bulunamazsa → 404

  const html = await fetch(route.template).then((Response) => Response.text());
  document.getElementById("content").innerHTML = html; // Sayfa içeriğini doldur

  applyUserSettings();

  // -Cookies- Kullanıcı giriş yapmışsa ayarlarını uygula
  const userSettings = getCurrentUserSettings();
  if (userSettings) {
    if (!localStorage.getItem('siteLanguage')) {
      localStorage.setItem('siteLanguage', userSettings.language);
    }
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', userSettings.theme);
      document.documentElement.setAttribute("data-theme", userSettings.theme);
    }
  }

  // Eğer settings sayfası yüklendiyse → JS eventlerini DOM’dan sonra yükle
  if (location === "/settings") {
    setTimeout(() => {
      initSettingsPage();
    }, 100);
  } else if (location === "/login") {
    initLoginPage();
  }

  // Sekme başlığı ve meta description güncelle
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
};
// ======================================================

function applyUserSettings() {
  const userSettings = getCurrentUserSettings();
  console.log("Router: Applying user settings", userSettings);

  if (userSettings) {
    // COOKIE'DEN GELEN AYARLARI HER ZAMAN KULLAN
    if (userSettings.language) {
      localStorage.setItem('siteLanguage', userSettings.language);
      console.log("Router: Language applied from cookie:", userSettings.language);
    }

    if (userSettings.theme) {
      localStorage.setItem('theme', userSettings.theme);
      document.documentElement.setAttribute("data-theme", userSettings.theme);
      console.log("Router: Theme applied from cookie:", userSettings.theme);
    }
  } else {
    // Cookie yoksa localStorage'dan al
    const theme = localStorage.getItem('theme') || 'light';
    const language = localStorage.getItem('siteLanguage') || 'tr';
    document.documentElement.setAttribute("data-theme", theme);
    console.log("Router: Settings applied from localStorage:", { theme, language });
  }

  // Dil değişikliğini uygula
  applyLanguage();
}

function applyLanguage() {
  const language = localStorage.getItem('siteLanguage') || 'tr';
  console.log("Applying language:", language);

  // Burada i18n.js'deki dil değiştirme fonksiyonunu çağırabilirsiniz
  if (window.changeLanguage) {
    window.changeLanguage(language);
  }
}


// ======================================================
// ✅ 6) TARAYICI GERİ/İLERİ BUTONU DESTEĞİ
// ------------------------------------------------------
window.onpopstate = urlLocationHandler;
// ======================================================



// ======================================================
// ✅ 7) DIŞARDAN DA ULAŞILABİLMESİ İÇİN FUNKTA İHRACI
// ------------------------------------------------------
window.urlRoute = urlRoute;
// ======================================================



// ======================================================
// ✅ 8) SAYFA AÇILIŞTA İLK ROUTING
// ------------------------------------------------------
urlLocationHandler();
// ======================================================
