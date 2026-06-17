document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ HAMBURGUESA ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', (e) => {
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
        toggleTab.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            isInteracting = true;
            slidingPanel.classList.toggle('active');
            toggleTab.classList.toggle('active');
            setTimeout(() => { isInteracting = false; }, 400);
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

    // --- 4. CONTROL DE MODALES INDEPENDIENTES (Carta y Bebidas) ---
    const modalCarta = document.getElementById('pdfModalCarta');
    const modalBebidas = document.getElementById('pdfModalBebidas');
    
    const closeCarta = document.getElementById('closeCarta');
    const closeBebidas = document.getElementById('closeBebidas');

    const triggersCarta = [document.getElementById('openCartaNav'), document.getElementById('openCartaPanel')];
    const triggersBebidas = [document.getElementById('openBebidasNav'), document.getElementById('openBebidasPanel')];

    const abrirModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // FIX iOS: fuerza que el modal arranque siempre mostrando la
        // página 1 arriba del todo, sin importar el scroll previo de la
        // página o de una apertura anterior del modal. Sin esto, en
        // iPhone la carta podía aparecer "desplazada" a mitad de las
        // imágenes en vez de empezar por la primera página.
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

    triggersCarta.forEach(t => t && t.addEventListener('pointerdown', (e) => { e.preventDefault(); abrirModal(modalCarta); }));
    triggersBebidas.forEach(t => t && t.addEventListener('pointerdown', (e) => { e.preventDefault(); abrirModal(modalBebidas); }));

    // FIX iOS: el cierre se gestiona con 'touchstart' en dispositivos
    // táctiles (ver bloque de abajo) y con 'click' como fallback para
    // ratón/trackpad en escritorio. Usamos una bandera para que, si
    // 'touchstart' ya cerró el modal, el 'click' que el navegador dispara
    // después no vuelva a ejecutar nada extra.
    let cerradoPorToque = false;

    const cerrarConClick = (e) => {
        if (cerradoPorToque) { cerradoPorToque = false; return; }
        e.preventDefault();
        e.stopPropagation();
        cerrarModales();
    };
    if (closeCarta) closeCarta.addEventListener('click', cerrarConClick);
    if (closeBebidas) closeBebidas.addEventListener('click', cerrarConClick);

    // FIX iOS (causa raíz del problema reportado): el long-press / selección
    // de texto que aparece "debajo" del aspa se debe a que iOS, al levantar
    // el dedo, hace el hit-test final sobre la capa de scroll subyacente en
    // vez de sobre el botón sticky. Al actuar ya en 'touchstart' —antes de
    // que exista margen para que iOS interprete el gesto como selección— y
    // cancelar el evento con preventDefault(), eliminamos esa ventana.
    // selectstart/contextmenu quedan como red de seguridad adicional.
    [modalCarta, modalBebidas].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('selectstart', (e) => e.preventDefault());
        modal.addEventListener('contextmenu', (e) => e.preventDefault());
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                cerradoPorToque = true;
                cerrarModales();
            }, { passive: false });
        }
    });
});