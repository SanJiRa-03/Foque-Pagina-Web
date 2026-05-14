const toggleTab = document.getElementById('toggleTab');
const slidingPanel = document.getElementById('slidingPanel');
const items = document.querySelectorAll('.review-item');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// ELEMENTOS PARA EL MODAL DE LA CARTA
const pdfModal = document.getElementById('pdfModal');
const openCartaNav = document.getElementById('openCartaNav');
const openCartaPanel = document.getElementById('openCartaPanel');
const closeCarta = document.getElementById('closeCarta');

// ELEMENTOS PARA EL CARRUSEL DE LA HISTORIA (NOSOTROS)
const historyImages = document.querySelectorAll('.history-img');

let currentIndex = 0;
let historyIndex = 0;

// Variable de control para evitar que el scroll cierre el panel mientras se interactúa en móvil
let isInteracting = false;

// 1. Panel Desplegable optimizado para pantallas táctiles y PC
if (toggleTab && slidingPanel) {
    // Usamos 'pointerdown' que unifica el clic de ratón y el toque táctil al instante
    toggleTab.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        isInteracting = true;
        slidingPanel.classList.toggle('active');
        toggleTab.classList.toggle('active');
        
        // Liberamos el control tras la transición
        setTimeout(() => { isInteracting = false; }, 400);
    });
}

// 2. Visibilidad de la Pestaña y Cierre Automático al hacer Scroll (Solo si existe el Hero)
const heroSection = document.querySelector('.hero');
if (heroSection && toggleTab && slidingPanel) {
    window.addEventListener('scroll', () => {
        // Si el usuario está tocando el botón en móvil, ignoramos temporalmente este chequeo
        if (isInteracting) return; 

        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollY > (heroHeight * 0.4)) {
            toggleTab.style.opacity = "0";
            toggleTab.style.pointerEvents = "none";
            
            // Cierra el panel si está abierto al bajar
            slidingPanel.classList.remove('active');
            toggleTab.classList.remove('active');
        } else {
            toggleTab.style.opacity = "1";
            toggleTab.style.pointerEvents = "auto";
        }
    });
}

// 3. Lógica del Carrusel de Reseñas (Solo si hay testimonios en el HTML)
if (items.length > 0) {
    function showReview(index) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
    }

    showReview(currentIndex);

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            showReview(currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showReview(currentIndex);
        });
    }

    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        showReview(currentIndex);
    }, 6000);
}

// 4. Lógica del Carrusel de la Historia (Solo si hay imágenes de historia)
if (historyImages.length > 0) {
    setInterval(() => {
        historyImages[historyIndex].classList.remove('active');
        historyIndex = (historyIndex + 1) % historyImages.length;
        historyImages[historyIndex].classList.add('active');
    }, 4000);
}

// 5. Control del Modal de la Carta (Funciona de forma global)
function abrirCarta(e) {
    e.preventDefault(); // Evita saltos bruscos de ancla
    if (pdfModal) pdfModal.classList.add('active');
    document.body.classList.add('modal-open'); // Bloquea scroll de fondo
    
    // Cierra el panel y la pestaña del index si estuvieran abiertos
    if (slidingPanel) slidingPanel.classList.remove('active');
    if (toggleTab) toggleTab.classList.remove('active');
}

function cerrarCarta() {
    if (pdfModal) pdfModal.classList.remove('active');
    document.body.classList.remove('modal-open'); // Devuelve el scroll a la página
}

// Eventos para abrir la carta con soporte inmediato para móviles ('pointerdown')
if (openCartaNav) openCartaNav.addEventListener('pointerdown', abrirCarta);
if (openCartaPanel) openCartaPanel.addEventListener('pointerdown', abrirCarta);

// Evento para cerrar la carta
if (closeCarta) closeCarta.addEventListener('pointerdown', cerrarCarta);

// 6. Evitar atajos de teclado comunes (Protección de código/imágenes)
document.onkeydown = function(e) {
    if(e.keyCode == 123) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
};