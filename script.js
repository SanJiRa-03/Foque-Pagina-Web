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

    if (toggleTab && slidingPanel) {
        toggleTab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            isInteracting = true;
            slidingPanel.classList.toggle('active');
            toggleTab.classList.toggle('active');
            
            // BLINDAJE: Desactivamos temporalmente los clicks en el menú hamburguesa
            const mobileMenuBtn = document.getElementById('mobile-menu');
            if (mobileMenuBtn) {
                mobileMenuBtn.style.pointerEvents = 'none';
                
                // Volvemos a activar el menú cuando el panel haya terminado de moverse (400ms)
                setTimeout(() => {
                    mobileMenuBtn.style.pointerEvents = 'auto';
                    isInteracting = false;
                }, 400);
            } else {
                setTimeout(() => { isInteracting = false; }, 400);
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

    // --- 4. CONTROL DE MODALES INDEPENDIENTES (CORREGIDO APERTURA LIMPIA) ---
    const modalCarta = document.getElementById('pdfModalCarta');
    const modalBebidas = document.getElementById('pdfModalBebidas');
    
    const closeCarta = document.getElementById('closeCarta');
    const closeBebidas = document.getElementById('closeBebidas');

    // Separamos los disparadores del menú de arriba de los botones del panel inferior
    const triggersNav = [document.getElementById('openCartaNav'), document.getElementById('openBebidasNav')];
    const btnCartaPanel = document.getElementById('openCartaPanel');
    const btnBebidasPanel = document.getElementById('openBebidasPanel');

    const abrirModal = (modal) => {
        if (!modal) return;
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

    // 1. Los enlaces del menú superior abren normal al hacer click
    if(document.getElementById('openCartaNav')) document.getElementById('openCartaNav').addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalCarta); });
    if(document.getElementById('openBebidasNav')) document.getElementById('openBebidasNav').addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalBebidas); });

    // 2. Los botones gigantes del panel SOLO se abren con un CLICK limpio y consciente (nunca con roces o pointerdown)
    if (btnCartaPanel) {
        btnCartaPanel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirModal(modalCarta);
        });
    }

    if (btnBebidasPanel) {
        btnBebidasPanel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirModal(modalBebidas);
        });
    }

    // Gestión del cierre de modales
    const cerrarConClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        cerrarModales();
        modalRecienCerrado = true;
        setTimeout(() => { modalRecienCerrado = false; }, 300);
    };
    
    if (closeCarta) closeCarta.addEventListener('click', cerrarConClick);
    if (closeBebidas) closeBebidas.addEventListener('click', cerrarConClick);

    if (modalCarta && modalBebidas) {
        [modalCarta, modalBebidas].forEach(modal => {
            if (!modal) return;
            modal.addEventListener('selectstart', (e) => e.preventDefault());
            modal.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }
});