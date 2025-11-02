<<<<<<< HEAD
=======
// ======================================================
// THEME MANAGEMENT
// Tema uygulama ve buton eventleri

// Temayı uygula ve localStorage'a kaydet
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

<<<<<<< HEAD
const savedTheme = localStorage.getItem("theme") || "system";
setTheme(savedTheme);

=======
// Sayfa yüklendiğinde kaydedilmiş temayı uygula (varsayılan: system)
setTheme(localStorage.getItem("theme") || "system");

// ======================================================
// SPA EVENT DELEGATION
// Dinamik yüklense bile butonlar çalışır
>>>>>>> d11ad00b90b2cb0569f15173d5d16297bd54d1ee
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
