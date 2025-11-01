// ======================================================
// THEME MANAGEMENT
// Tema uygulama ve buton eventleri

// Temayı uygula ve localStorage'a kaydet
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Sayfa yüklendiğinde kaydedilmiş temayı uygula (varsayılan: system)
setTheme(localStorage.getItem("theme") || "system");

// ======================================================
// SPA EVENT DELEGATION
// Dinamik yüklense bile butonlar çalışır
document.addEventListener("click", (e) => {
  if (e.target.id === "lightThemeBtn") setTheme("light");
  if (e.target.id === "darkThemeBtn") setTheme("dark");
  if (e.target.id === "autoThemeBtn") setTheme("system");
});
