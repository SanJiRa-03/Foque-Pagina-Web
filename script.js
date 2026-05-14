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