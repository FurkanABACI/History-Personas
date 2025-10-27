function initSettingsPage(){
// HTML elementleri
const lightBtn = document.getElementById("lightThemeBtn");
const darkBtn = document.getElementById("darkThemeBtn");
const autoBtn = document.getElementById("autoThemeBtn");

// LocalStorage kontrolü ve başlangıçta uygula
const savedTheme = localStorage.getItem("theme") || "system";
setTheme(savedTheme);

// Temayı ayarlayan fonksiyon
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Butonlara tıklama olayları
lightBtn.addEventListener("click", () => setTheme("light"));
darkBtn.addEventListener("click", () => setTheme("dark"));
autoBtn.addEventListener("click", () => setTheme("system"));

}
