/**
 * FOQUE - Script Universal Final
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ HAMBURGUESA (Cierre automático tras clic) ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        // Abrir y cerrar con el botón
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('mobile-active');
            mobileMenu.classList.toggle('is-active');
        });

        // CERRAR AUTOMÁTICAMENTE AL DARLE A UN BOTÓN/ENLACE
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                mobileMenu.classList.remove('is-active');
            });
        });

        // Cerrar al pulsar fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
                mobileMenu.classList.remove('is-active');
            }
        });
    }

    // --- 2. PANEL INTELIGENTE Y PESTAÑA ---
    const toggleTab = document.getElementById('toggleTab');
    const slidingPanel = document.getElementById('slidingPanel');
    const heroSection = document.querySelector('.hero');
    let isInteracting = false;

    const updateTabVisibility = () => {
        if (!heroSection || !toggleTab || isInteracting) return;
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollY > (heroHeight * 0.4)) {
            toggleTab.style.opacity = "0";
            toggleTab.style.pointerEvents = "none";
            if(slidingPanel) slidingPanel.classList.remove('active');
            if(toggleTab) toggleTab.classList.remove('active');
        } else {
            toggleTab.style.opacity = "1";
            toggleTab.style.pointerEvents = "auto";
        }
    };

    if (toggleTab && slidingPanel) {
        toggleTab.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            isInteracting = true;
            slidingPanel.classList.toggle('active');
            toggleTab.classList.toggle('active');
            setTimeout(() => { isInteracting = false; }, 400);
        });
        window.addEventListener('scroll', updateTabVisibility);
    }

    // --- 3. CARRUSEL DE RESEÑAS (Carga instantánea) ---
    const reviewItems = document.querySelectorAll('.review-item');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let reviewIndex = 0;

    if (reviewItems.length > 0) {
        const showReview = (index) => {
            reviewItems.forEach(item => item.classList.remove('active'));
            reviewItems[index].classList.add('active');
        };

        showReview(0); 

        if (nextBtn) nextBtn.addEventListener('click', () => { reviewIndex = (reviewIndex + 1) % reviewItems.length; showReview(reviewIndex); });
        if (prevBtn) prevBtn.addEventListener('click', () => { reviewIndex = (reviewIndex - 1 + reviewItems.length) % reviewItems.length; showReview(reviewIndex); });

        setInterval(() => {
            reviewIndex = (reviewIndex + 1) % reviewItems.length;
            showReview(reviewIndex);
        }, 6000);
    }

    // --- 4. MODAL DE LA CARTA ---
    const pdfModal = document.getElementById('pdfModal');
    const closeCarta = document.getElementById('closeCarta');
    const triggers = [document.getElementById('openCartaNav'), document.getElementById('openCartaPanel')];

    const abrirCarta = (e) => {
        if (e) e.preventDefault();
        if (pdfModal) {
            pdfModal.classList.add('active');
            document.body.classList.add('modal-open');
            if (slidingPanel) slidingPanel.classList.remove('active');
            if (toggleTab) { 
                toggleTab.classList.remove('active');
                toggleTab.style.opacity = "0"; 
                toggleTab.style.pointerEvents = "none"; 
            }
        }
    };

    const cerrarCarta = () => {
        if (pdfModal) {
            pdfModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            updateTabVisibility(); 
        }
    };

    triggers.forEach(t => t && t.addEventListener('pointerdown', abrirCarta));
    if (closeCarta) closeCarta.addEventListener('pointerdown', cerrarCarta);

    // --- 5. CARRUSEL HISTORIA ---
    const historyImages = document.querySelectorAll('.history-img');
    let historyIndex = 0;
    if (historyImages.length > 0) {
        setInterval(() => {
            historyImages[historyIndex].classList.remove('active');
            historyIndex = (historyIndex + 1) % historyImages.length;
            historyImages[historyIndex].classList.add('active');
        }, 4000);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const imageColumns = document.querySelectorAll('.nosotros-image-col');

    imageColumns.forEach(col => {
        // Saltamos bloqueos de ratón globales
        col.style.pointerEvents = "auto";
        const imgInside = col.querySelector('.zoom-image');
        if(imgInside) imgInside.style.pointerEvents = "none"; 

        // 1. Ampliar imagen al hacer click
        col.addEventListener('click', function(e) {
            if(this.classList.contains('fullscreen-mode')) return;

            const parentRow = this.closest('.nosotros-row');
            parentRow.classList.add('has-fullscreen');
            this.classList.add('fullscreen-mode');
        });
    });

    // Función global para cerrar cualquier imagen expandida
    const resetFullscreenImage = () => {
        const activeFullscreen = document.querySelector('.nosotros-image-col.fullscreen-mode');
        if (activeFullscreen) {
            const parentRow = activeFullscreen.closest('.nosotros-row');
            parentRow.classList.remove('has-fullscreen');
            activeFullscreen.classList.remove('fullscreen-mode');
        }
    };

    // 2. DETECTOR DE SCROLL MOUSE: Cualquier movimiento de rueda cierra el modo pantalla completa
    window.addEventListener('wheel', () => {
        resetFullscreenImage();
    }, { passive: true });

    // 3. DETECTOR DE SCROLL TÁCTIL (Móviles/Trackpads): Al deslizar el dedo en cualquier dirección, se cierra
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        let touchEndY = e.touches[0].clientY;
        // Si el movimiento vertical supera los 20px (arriba o abajo), cerramos la imagen
        if (Math.abs(touchStartY - touchEndY) > 20) { 
            resetFullscreenImage();
        }
    }, { passive: true });
});