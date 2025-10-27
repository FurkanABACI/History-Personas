// Temayı uygula
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Başlangıçta kaydedilmiş temayı uygula
setTheme(localStorage.getItem("theme") || "system");

// SPA için event delegation: Dinamik yüklense bile butonlar çalışır
document.addEventListener("click", (e) => {
  if (e.target.id === "lightThemeBtn") setTheme("light");
  if (e.target.id === "darkThemeBtn") setTheme("dark");
  if (e.target.id === "autoThemeBtn") setTheme("system");
});
