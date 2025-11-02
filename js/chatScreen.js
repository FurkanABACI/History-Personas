let selectedFigure = null;

function initChatScreen() {
    loadSelectedFigure();
    setupEventListeners();
    updateUI();
}

function loadSelectedFigure() {
    const figureId = localStorage.getItem('selectedFigure');
    if (!figureId) {
        window.history.pushState({}, "", "/");
        urlLocationHandler();
        return;
    }

    const figures = JSON.parse(localStorage.getItem('historicalFigures') || '[]');
    selectedFigure = figures.find(f => f.id === figureId);
    
    if (!selectedFigure) {
        window.history.pushState({}, "", "/");
        urlLocationHandler();
        return;
    }
}

function setupEventListeners() {
    const newChatBtn = document.getElementById('newChatBtn');
    const changePersonaBtn = document.getElementById('changePersonaBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);
    if (changePersonaBtn) changePersonaBtn.addEventListener('click', changePersona);
    if (settingsBtn) settingsBtn.addEventListener('click', goToSettings);
}

function updateUI() {
    if (!selectedFigure) return;

    const lang = localStorage.getItem('siteLanguage') || 'tr';
    
    const figureImg = document.getElementById('selectedFigureImg');
    const figureName = document.getElementById('selectedFigureName');
    const figureLifeSpan = document.getElementById('selectedFigureLifeSpan');
    const figureCutoff = document.getElementById('selectedFigureCutoff');
    const figureStyle = document.getElementById('selectedFigureStyle');

    if (figureImg) figureImg.src = selectedFigure.img;
    if (figureImg) figureImg.alt = selectedFigure.name[lang];
    if (figureName) figureName.textContent = selectedFigure.name[lang];
    if (figureLifeSpan) figureLifeSpan.textContent = selectedFigure.life_span;
    if (figureCutoff) figureCutoff.textContent = selectedFigure.cutoff_year;
    if (figureStyle) figureStyle.textContent = selectedFigure.style[lang];

//          Üst panel
//     const topSideFigureImg = document.getElementById('topSideSelectedFigureImg');
//     const topSideFigureName = document.getElementById('topSideSelectedFigureName');
//     const topSideFigureLifeSpan = document.getElementById('topSideSelectedFigureLifeSpan');

//     if (topSideFigureImg) topSideFigureImg.src = selectedFigure.img;
//     if (topSideFigureImg) topSideFigureImg.alt = selectedFigure.name[lang];
//     if (topSideFigureName) topSideFigureName.textContent = selectedFigure.name[lang];
//     if (topSideFigureLifeSpan) topSideFigureLifeSpan.textContent = selectedFigure.life_span;

}

function startNewChat() {
    if (confirm('Yeni sohbet başlatmak istediğinizden emin misiniz? Mevcut sohbet kaybolacak.')) {
        localStorage.removeItem('currentChat');
        window.location.reload();
    }
}

function changePersona() {
    window.history.pushState({}, "", "/");
    urlLocationHandler();
}

function goToSettings() {
    window.history.pushState({}, "", "/settings");
    urlLocationHandler();
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/chat') {
        setTimeout(initChatScreen, 100);
    }
});

window.initChatScreen = initChatScreen;