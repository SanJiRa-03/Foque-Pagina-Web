document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ HAMBURGUESA ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    let modalRecienCerrado = false;

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', (e) => {
            // NUEVO: Si la carta, las bebidas o el panel inferior están abiertos, bloqueamos el menú
            const panelActivo = document.getElementById('slidingPanel')?.classList.contains('active');
            const cartaActiva = document.getElementById('pdfModalCarta')?.classList.contains('active');
            const bebidasActivas = document.getElementById('pdfModalBebidas')?.classList.contains('active');

            if (modalRecienCerrado || panelActivo || cartaActiva || bebidasActivas) { 
                e.preventDefault();
                e.stopPropagation();
                return; 
            }
            
            e.stopPropagation();
            navMenu.classList.toggle('mobile-active');
            mobileMenu.classList.toggle('is-active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                mobileMenu.classList.remove('is-active');
            });
        });

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
    let ultimoToggleFlecha = 0;

   if (toggleTab && slidingPanel) {
    toggleTab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        isInteracting = true;
        slidingPanel.classList.remove('panel-ready'); // bloqueamos los botones de inmediato
        slidingPanel.classList.toggle('active');
        toggleTab.classList.toggle('active');

        const mobileMenuBtn = document.getElementById('mobile-menu');
        if (mobileMenuBtn) mobileMenuBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            if (mobileMenuBtn) mobileMenuBtn.style.pointerEvents = 'auto';
            isInteracting = false;
        }, 650);
    });

    // Solo "encendemos" los botones cuando el deslizamiento ha terminado de verdad
    slidingPanel.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'top') return;
        if (slidingPanel.classList.contains('active')) {
            slidingPanel.classList.add('panel-ready');
        } else {
            slidingPanel.classList.remove('panel-ready');
        }
    });

    window.addEventListener('scroll', updateTabVisibility);
}

    // --- 3. CARRUSEL DE RESEÑAS ---
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

   // --- 4. CONTROL DE MODALES INDEPENDIENTES (CON FILTRO ANTI-PERFORACIÓN) ---
    const modalCarta = document.getElementById('pdfModalCarta');
    const modalBebidas = document.getElementById('pdfModalBebidas');
    
    const closeCarta = document.getElementById('closeCarta');
    const closeBebidas = document.getElementById('closeBebidas');

    const triggersCarta = [document.getElementById('openCartaNav'), document.getElementById('openCartaPanel')];
    const triggersBebidas = [document.getElementById('openBebidasNav'), document.getElementById('openBebidasPanel')];

const abrirModal = (modal, evento) => {
    if (!modal) return;

    // Bloqueamos si el click viene de la flecha, si el panel se está moviendo,
    // o si ha pasado muy poco tiempo desde que se tocó la flecha (cubre los
    // "clicks fantasma" de iOS que llegan tarde y aterrizan sobre los botones)
    if (evento && (evento.target.closest('#toggleTab') || isInteracting || (Date.now() - ultimoToggleFlecha < 700))) {
        return;
    }

    modal.classList.add('active');
        document.body.classList.add('modal-open');

        const scrollArea = modal.querySelector('.modal-scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = 0;
        }

        if (slidingPanel) slidingPanel.classList.remove('active');
        if (toggleTab) { 
            toggleTab.classList.remove('active');
            toggleTab.style.opacity = "0"; 
            toggleTab.style.pointerEvents = "none"; 
        }
    };

    const cerrarModales = () => {
        if (modalCarta) modalCarta.classList.remove('active');
        if (modalBebidas) modalBebidas.classList.remove('active');
        document.body.classList.remove('modal-open');
        updateTabVisibility();
    };

    // Pasamos el evento 'e' a la función abrirModal para poder analizarlo
    triggersCarta.forEach(t => t && t.addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalCarta, e); }));
    triggersBebidas.forEach(t => t && t.addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalBebidas, e); }));

    const cerrarConClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        cerrarModales();
        modalRecienCerrado = true;
        setTimeout(() => { modalRecienCerrado = false; }, 300);
    };
    if (closeCarta) closeCarta.addEventListener('click', cerrarConClick);
    if (closeBebidas) closeBebidas.addEventListener('click', cerrarConClick);

    [modalCarta, modalBebidas].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('selectstart', (e) => e.preventDefault());
        modal.addEventListener('contextmenu', (e) => e.preventDefault());
    });
});