// ======================================================
// HISTORICAL FIGURES STORAGE
// Tüm tarihi figürleri saklamak için dizi
let figures = [];

// ======================================================
// LOAD HISTORICAL FIGURES
// figures.json dosyasını yükle, kartları oluştur ve sayfaya ekle
async function loadHistoricalFigures() {
    const lang = localStorage.getItem("siteLanguage") || "tr";
    const response = await fetch("/data/figures.json");
    figures = await response.json();
    const container = document.getElementById("figuresCards");

    if (!container) {
        console.error("figuresCards container bulunamadı!");
        return;
    }

    container.innerHTML = figures.map(f => `
        <div class="figureCard" data-id="${f.id}">
            <img class="figureImg" src="${f.img}" alt="${f.name[lang]}">
            <p class="figureName">${f.name[lang]}</p>
            <p class="figureTitle">${f.title[lang]}</p>
        </div>
    `).join("");

    addCardClickEvents();
    setupSearchBox(lang);
}

// ======================================================
// CARD CLICK EVENTS
// Her kart tıklamasında dialog aç
function addCardClickEvents() {
    const cards = document.querySelectorAll(".figureCard");

    cards.forEach(card => {
        card.addEventListener("click", function() {
            const id = this.dataset.id;
            const selectedFigure = figures.find(f => f.id === id);
            if (selectedFigure) openFigureDialog(selectedFigure);
        });
    });
}

// ======================================================
// SEARCH BOX SETUP
// Input ile figürleri filtrele ve sayfayı güncelle
function setupSearchBox(lang) {
    const searchBox = document.querySelector(".searchBox");

    if (searchBox) {
        searchBox.addEventListener("input", function() {
            const term = this.value.toLowerCase();
            const container = document.getElementById("figuresCards");
            const filtered = figures.filter(f =>
                f.name[lang].toLowerCase().includes(term) ||
                f.title[lang].toLowerCase().includes(term)
            );

            container.innerHTML = filtered.map(f => `
                <div class="figureCard" data-id="${f.id}">
                    <img class="figureImg" src="${f.img}" alt="${f.name[lang]}">
                    <p class="figureName">${f.name[lang]}</p>
                    <p class="figureTitle">${f.title[lang]}</p>
                </div>
            `).join("");

            addCardClickEvents();
        });
    }
}

// ======================================================
// FIGURE DIALOG
// Seçilen figürün detaylarını dialogda göster
function openFigureDialog(figure) {
    const figureDialog = document.getElementById("figureDialog");
    const lang = localStorage.getItem("siteLanguage") || "tr";

    console.log("Dialog açılıyor, figure:", figure); // Debug

    document.getElementById("dialogImg").src = figure.img;
    document.getElementById("dialogName").textContent = figure.name[lang];
    document.getElementById("dialogMeta").textContent = `${figure.life_span} • ${figure.category}`;
    document.getElementById("dialogCutoff").textContent = figure.cutoff_year;
    document.getElementById("dialogStyle").textContent = figure.style[lang];

    const sourcesHTML = figure.sources
        .map(s => `<a href="${s.url}" target="_blank">${s.name}</a>`)
        .join(" • ");
    document.getElementById("dialogSources").innerHTML = sourcesHTML;

    // Figure ID'yi dialog elementine kaydet - BU SATIR ÖNEMLİ
    figureDialog.dataset.figureId = figure.id;
    console.log("Dialog dataset.figureId:", figureDialog.dataset.figureId); // Debug

    figureDialog.classList.remove("hidden");
}

// ======================================================
// CLOSE FIGURE DIALOG
// Dialogu gizle
function closeFigureDialog() {
    const figureDialog = document.getElementById("figureDialog");
    figureDialog.classList.add("hidden");
}

// ======================================================
// INIT HOME PAGE EVENTS
// Dialog kapatma, Escape tuşu, start chat butonu ve overlay click
function initHomePageEvents() {
    const closeDialogBtn = document.getElementById("closeDialogBtn");
    const startChatBtn = document.getElementById("startChatBtn");
    const figureDialog = document.getElementById("figureDialog");

    if (closeDialogBtn) {
        closeDialogBtn.addEventListener("click", closeFigureDialog);
    }

if (startChatBtn) {
    startChatBtn.addEventListener("click", function () {
        console.log("Start Chat butonuna tıklandı"); // Debug
        const selectedFigureId = document.getElementById("figureDialog").dataset.figureId;
        console.log("Seçilen Figure ID:", selectedFigureId); // Debug
        
        if (selectedFigureId) {
            // Seçilen kişiliği localStorage'a kaydet
            localStorage.setItem('selectedFigure', selectedFigureId);
            // Tarihi kişilikleri de kaydet
            localStorage.setItem('historicalFigures', JSON.stringify(figures));
            console.log("LocalStorage'a kaydedildi, chat sayfasına yönlendiriliyor..."); // Debug
            
            // Chat sayfasına yönlendir
            window.history.pushState({}, "", "/chat");
            urlLocationHandler();
        } else {
            console.error("Figure ID bulunamadı!"); // Debug
        }
        closeFigureDialog();
    });
}

    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && figureDialog && !figureDialog.classList.contains("hidden")) {
            closeFigureDialog();
        }
    });

    if (figureDialog) {
        figureDialog.addEventListener("click", function (e) {
            if (e.target === figureDialog) {
                closeFigureDialog();
            }
        });
    }
}

// ======================================================
// INIT HOME PAGE
// Figürleri yükle ve eventleri başlat
function initHomePage() {
    loadHistoricalFigures();
    initHomePageEvents();
}

// ======================================================
// RELOAD HOME PAGE ON LANGUAGE CHANGE
// Dil değiştiğinde sayfayı yeniden yükle
function reloadHomePageOnLanguageChange() {
    const lang = localStorage.getItem("siteLanguage") || "tr";
    loadHistoricalFigures();
}

// ======================================================
// GLOBAL EXPORTS
// Fonksiyonları diğer scriptlerden erişim için window'a ata
window.initHomePage = initHomePage;
window.openFigureDialog = openFigureDialog;
window.closeFigureDialog = closeFigureDialog;
window.reloadHomePageOnLanguageChange = reloadHomePageOnLanguageChange;