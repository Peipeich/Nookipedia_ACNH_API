$(document).ready(function() {
    // --- CONFIGURACIÓN GLOBAL ---
    const API_KEY = "eebcaf09-f716-4786-ba4e-9fba802d6aaa"; 
    const PROXY = "https://corsproxy.io/?url=";
    const HEADERS = {
        'X-API-KEY': API_KEY,
        'Accept-Version': '1.0.0'
    };

    // Variables de control (Listas y posiciones actuales)
    let dataVecinos = [], posVecinos = 0;
    let dataPeces = [], posPeces = 0;
    let dataInsectos = [], posInsectos = 0;

    // --- 1. MENÚ MOBILE ---
    $('#mobile-menu').on('click', function() {
        $(this).toggleClass('is-active');
        $('.nav-links').toggleClass('active');
    });

    $('.parent-link').on('click', function(e) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            $(this).siblings('.dropdown-content').toggleClass('show-submenu');
        }
    });

    // --- 2. LÓGICA DE RENDERIZADO (LOOP INFINITO) ---

    // Función genérica para pintar cualquier carrusel en modo loop
    function renderizarCarrusel(lista, inicio, containerId, cantMostrar, tipoCard) {
        const $cont = $(containerId);
        $cont.empty();
        
        for (let i = 0; i < cantMostrar; i++) {
            const index = (inicio + i) % lista.length;
            const item = lista[index];
            let html = '';

            if (tipoCard === 'vecino') {
                html = `
                    <div class="v-bubble-card">
                        <img src="${item.image_url}" alt="${item.name}">
                        <div class="villager-name">${item.name}</div>
                    </div>`;
            } else {
                const img = item.image_url || item.render_url;
                const link = `detalle-fauna.html?name=${encodeURIComponent(item.name)}`;
                html = `
                    <div class="f-square-card">
                        <img src="${img}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <a href="${link}" class="view-btn">VER</a>
                    </div>`;
            }
            $cont.append(html);
        }
    }

    // --- 3. CARGA DE DATOS ---

    function cargarVecinos() {
        $.ajax({
            url: PROXY + encodeURIComponent("https://api.nookipedia.com/villagers?game=nh"),
            headers: HEADERS,
            success: function(data) {
                dataVecinos = data.slice(0, 10);
                renderizarCarrusel(dataVecinos, posVecinos, "#carousel-villagers", 4, 'vecino');
                implementarSwipe("#carousel-villagers", () => navegar('vecinos', 'next'), () => navegar('vecinos', 'prev'));
            }
        });
    }

    function cargarFauna(url, containerId, storageKey) {
        $.ajax({
            url: PROXY + encodeURIComponent(url),
            headers: HEADERS,
            success: function(data) {
                const listaCorta = data.slice(0, 10);
                if (storageKey === 'peces') dataPeces = listaCorta;
                else dataInsectos = listaCorta;
                
                renderizarCarrusel(listaCorta, 0, containerId, 4, 'fauna');
                implementarSwipe(containerId, () => navegar(storageKey, 'next'), () => navegar(storageKey, 'prev'));
            }
        });
    }

    // --- 4. NAVEGACIÓN ---

    function navegar(seccion, direccion) {
        if (seccion === 'vecinos') {
            posVecinos = direccion === 'next' ? (posVecinos + 1) % dataVecinos.length : (posVecinos - 1 + dataVecinos.length) % dataVecinos.length;
            renderizarCarrusel(dataVecinos, posVecinos, "#carousel-villagers", 4, 'vecino');
        } 
        else if (seccion === 'peces') {
            posPeces = direccion === 'next' ? (posPeces + 1) % dataPeces.length : (posPeces - 1 + dataPeces.length) % dataPeces.length;
            renderizarCarrusel(dataPeces, posPeces, "#carousel-peces", 4, 'fauna');
        }
        else if (seccion === 'insectos') {
            posInsectos = direccion === 'next' ? (posInsectos + 1) % dataInsectos.length : (posInsectos - 1 + dataInsectos.length) % dataInsectos.length;
            renderizarCarrusel(dataInsectos, posInsectos, "#carousel-insectos", 4, 'fauna');
        }
    }

    // Eventos Click
    $("#next-v").on('click', () => navegar('vecinos', 'next'));
    $("#prev-v").on('click', () => navegar('vecinos', 'prev'));
    
    $("#next-p").on('click', () => navegar('peces', 'next'));
    $("#prev-p").on('click', () => navegar('peces', 'prev'));
    
    $("#next-i").on('click', () => navegar('insectos', 'next'));
    $("#prev-i").on('click', () => navegar('insectos', 'prev'));

    // --- 5. TOUCH / SWIPE ---
    function implementarSwipe(id, fnNext, fnPrev) {
        let startX = 0;
        const el = document.querySelector(id);
        if (!el) return;
        el.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, {passive: true});
        el.addEventListener('touchend', e => {
            let diff = startX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) diff > 0 ? fnNext() : fnPrev();
        }, {passive: true});
    }

    // --- 6. EVENTOS GRID ---
    function obtenerEventos() {
        $.ajax({
            url: 'https://api.nookipedia.com/nh/events',
            headers: HEADERS,
            success: function(eventos) {
                const $grid = $('.grid-eventos');
                $grid.empty();
                $.each(eventos.slice(0, 4), function(i, ev) {
                    const colorClase = (i % 2 === 0) ? 'image-placeholder-green' : 'image-placeholder-blue';
                    const $divColor = $('<div>').addClass(`evento-card ${colorClase}`);
                    const $divTitulo = $('<div>').addClass('evento-card').css({'background':'#d3d3d3','cursor':'pointer'}).text(ev.event)
                        .on('click', () => window.location.href = `evento.html?nombre=${encodeURIComponent(ev.event)}`);
                    if (i < 2) $grid.append($divTitulo, $divColor);
                    else $grid.append($divColor, $divTitulo);
                });
            }
        });
    }

    // Inicialización
    cargarVecinos();
    cargarFauna("https://api.nookipedia.com/nh/fish", "#carousel-peces", 'peces');
    cargarFauna("https://api.nookipedia.com/nh/bugs", "#carousel-insectos", 'insectos');
    obtenerEventos();
});