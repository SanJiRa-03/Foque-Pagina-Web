document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ HAMBURGUESA ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    // FIX iOS (red de seguridad adicional, ver bloque 4 más abajo para la
    // causa raíz y el fix principal): si justo se acaba de cerrar un modal,
    // ignoramos el siguiente click sobre el menú hamburguesa durante una
    // ventana muy breve. Esto cubre navegadores donde `:has()` no esté
    // soportado o se comporte de forma distinta a Safari/iOS.
    let modalRecienCerrado = false;

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (modalRecienCerrado) { return; }
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
        // Cambiado de 'pointerdown' a 'click' y añadido stopPropagation
        toggleTab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evita que el click se propague a elementos de fondo
            
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

    triggersCarta.forEach(t => t && t.addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalCarta); }));
    triggersBebidas.forEach(t => t && t.addEventListener('click', (e) => { e.preventDefault(); abrirModal(modalBebidas); }));

    // FIX iOS: el cierre se gestiona con 'click' (que en touch se dispara
    // tras un toque limpio completo, en el mismo punto). Mantenemos el
    // 'click' tanto para touch como para ratón/trackpad; no hace falta
    // distinguir, ver explicación del bug real más abajo.
    const cerrarConClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        cerrarModales();
        // Ventana breve en la que ignoramos cualquier click sobre el menú
        // hamburguesa, por si el mismo gesto táctil se interpretase también
        // como toque sobre él en algún navegador.
        modalRecienCerrado = true;
        setTimeout(() => { modalRecienCerrado = false; }, 300);
    };
    if (closeCarta) closeCarta.addEventListener('click', cerrarConClick);
    if (closeBebidas) closeBebidas.addEventListener('click', cerrarConClick);

    // CAUSA REAL DEL BUG REPORTADO: al tocar el aspa, el menú hamburguesa
    // se abría/cerraba como si también hubiera recibido el toque. No era
    // selección de texto ni long-press: era un problema de timing con la
    // regla CSS `body:has(.modal-pdf.active) .header { pointer-events:none }`.
    //
    // Esa regla depende de la clase 'active' del modal. Si cerrábamos el
    // modal (quitando 'active') en 'touchstart' —es decir, ANTES de que el
    // dedo se levante— el CSS se recalculaba al instante: el header volvía
    // a ser clicable a mitad del mismo gesto táctil. Cuando el dedo se
    // levantaba (touchend), el header YA estaba activo otra vez, y ese
    // mismo levantamiento se interpretaba como un click sobre el menú
    // hamburguesa que justo coincide en esa zona de la pantalla.
    //
    // Solución: cerrar el modal solo en 'click' (que el navegador dispara
    // después de touchend, una vez completado el gesto), nunca antes. Así
    // el header permanece bloqueado (pointer-events:none) durante TODO el
    // gesto táctil, y al levantar el dedo ya no hay nada debajo que pueda
    // reaccionar a ese mismo toque.
    [modalCarta, modalBebidas].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('selectstart', (e) => e.preventDefault());
        modal.addEventListener('contextmenu', (e) => e.preventDefault());
    });
});