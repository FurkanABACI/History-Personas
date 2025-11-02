// ======================================================
// THEME MANAGEMENT
// Tema uygulama ve buton eventleri

// Temayı uygula ve localStorage'a kaydet
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Sayfa yüklendiğinde kaydedilmiş temayı uygula (varsayılan: system)
const savedTheme = localStorage.getItem("theme") || "system";
setTheme(savedTheme);

// ======================================================
// SPA EVENT DELEGATION
// Dinamik yüklense bile butonlar çalışır
document.addEventListener("click", (e) => {
  if (e.target.id === "lightThemeBtn") setTheme("light");
  if (e.target.id === "darkThemeBtn") setTheme("dark");
  if (e.target.id === "autoThemeBtn") setTheme("system");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "system") {
    setTheme("system");
  }
});