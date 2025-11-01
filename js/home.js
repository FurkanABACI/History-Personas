let figures = [];

async function loadHistoricalFigures() {
    try {
        console.log("Figürler yükleniyor...");
        const lang = localStorage.getItem("siteLanguage") || "tr";
        const response = await fetch("/data/figures.json");
        figures = await response.json();
        const container = document.getElementById("figuresCards");

        if (!container) {
            console.error("figuresCards container bulunamadı!");
            return;
        }

        console.log(`${figures.length} figür yüklendi`);


        container.innerHTML = figures.map(f => `
            <div class="figureCard" data-id="${f.id}">
                <img class="figureImg" src="${f.img}" alt="${f.name[lang]}">
                <p class="figureName">${f.name[lang]}</p>
                <p class="figureTitle">${f.title[lang]}</p>
            </div>
        `).join("");

        addCardClickEvents();
        setupSearchBox(lang);

    } catch (error) {
        console.error("Figürler yüklenirken hata:", error);
    }
}

function addCardClickEvents() {
    const cards = document.querySelectorAll(".figureCard");
    console.log(`${cards.length} kart bulundu`);

    cards.forEach(card => {
        card.addEventListener("click", function () {
            const id = this.dataset.id;
            console.log("Karta tıklandı, ID:", id);
            const selectedFigure = figures.find(f => f.id === id);
            if (selectedFigure) {
                openFigureDialog(selectedFigure);
            }
        });
    });
}

function setupSearchBox(lang) {
    const searchBox = document.querySelector(".searchBox");

    if (searchBox) {
        searchBox.addEventListener("input", function () {
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

function openFigureDialog(figure) {
    const figureDialog = document.getElementById("figureDialog");
    const lang = localStorage.getItem("siteLanguage") || "tr";

    console.log("Dialog açılıyor:", figure.name[lang]);

    document.getElementById("dialogImg").src = figure.img;
    document.getElementById("dialogName").textContent = figure.name[lang];
    document.getElementById("dialogMeta").textContent = `${figure.life_span} • ${figure.category}`;
    document.getElementById("dialogCutoff").textContent = figure.cutoff_year;
    document.getElementById("dialogStyle").textContent = figure.style[lang];

    const sourcesHTML = figure.sources
        .map(s => `<a href="${s.url}" target="_blank">${s.name}</a>`)
        .join(" • ");
    document.getElementById("dialogSources").innerHTML = sourcesHTML;

    figureDialog.classList.remove("hidden");
}

function closeFigureDialog() {
    const figureDialog = document.getElementById("figureDialog");
    figureDialog.classList.add("hidden");
}

function initHomePageEvents() {
    console.log("Home page events initializing");

    const closeDialogBtn = document.getElementById("closeDialogBtn");
    const startChatBtn = document.getElementById("startChatBtn");
    const figureDialog = document.getElementById("figureDialog");

    if (closeDialogBtn) {
        closeDialogBtn.addEventListener("click", closeFigureDialog);
    }

    if (startChatBtn) {
        startChatBtn.addEventListener("click", function () {
            alert("Sohbet başlatılıyor...");
            closeFigureDialog();
            window.location.href = "/pages/chatScreen.html";
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

function initHomePage() {
    console.log("Home page init ediliyor");
    loadHistoricalFigures();
    initHomePageEvents();
}


function reloadHomePageOnLanguageChange() {
    const lang = localStorage.getItem("siteLanguage") || "tr";
    console.log("Dil değişti, home page yenileniyor:", lang);
    loadHistoricalFigures();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded - home.js");

    if (window.location.pathname === "/") {
        setTimeout(initHomePage, 100);
    }
})
window.initHomePage = initHomePage;
window.openFigureDialog = openFigureDialog;
window.closeFigureDialog = closeFigureDialog;
window.reloadHomePageOnLanguageChange = reloadHomePageOnLanguageChange;