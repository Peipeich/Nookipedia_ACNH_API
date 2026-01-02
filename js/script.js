$(document).ready(function() {
    // --- CONFIGURACIÓN GLOBAL ---
    const API_KEY = "PONER-ACA-LA-API-KEY"; 
    const PROXY = "https://corsproxy.io/?url=";
    const HEADERS = {
        'X-API-KEY': API_KEY,
        'Accept-Version': '1.0.0'
    };

    // --- 1. MENÚ MOBILE ---
    $('#mobile-menu').on('click', function() {
        $(this).toggleClass('is-active');
        $('.nav-links').toggleClass('active');
    });

    $('.parent-link').on('click', function(e) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            $(this).siblings('.dropdown-content').toggleClass('show-submenu');
            $(this).find('.flecha').toggleClass('rotate-arrow');
        }
    });

    // --- 2. CARRUSELES ---

    // Función para Vecinos (Límite 4 y diseño de burbuja)
    function cargarVecinosDestacados() {
        $.ajax({
            url: PROXY + encodeURIComponent("https://api.nookipedia.com/villagers?game=nh"),
            method: 'GET',
            headers: HEADERS,
            success: function(data) {
                const $cont = $("#carousel-villagers");
                $cont.empty();
                
                // Solo tomamos 4 para que el diseño sea fijo y el 2º siempre sea el grande
                const lista = data.slice(0, 4);

                lista.forEach(item => {
                    const cardHtml = `
                        <div class="v-bubble-card">
                            <img src="${item.image_url}" alt="${item.name}">
                            <div class="villager-name">${item.name}</div>
                        </div>
                    `;
                    $cont.append(cardHtml);
                });
            }
        });
    }

    // Función para Fauna (Peces e Insectos - Límite 10 y cuadrados)
    function cargarFauna(url, containerId) {
        $.ajax({
            url: PROXY + encodeURIComponent(url),
            method: 'GET',
            headers: HEADERS,
            success: function(data) {
                const $cont = $(containerId);
                $cont.empty();
                
                const lista = data.slice(0, 10);

                lista.forEach(item => {
                    const img = item.image_url || item.render_url;
                    const link = `detalle-fauna.html?name=${encodeURIComponent(item.name)}`;
                    const cardHtml = `
                        <div class="f-square-card">
                            <img src="${img}" alt="${item.name}">
                            <h4>${item.name}</h4>
                            <a href="${link}" class="view-btn">VER</a>
                        </div>
                    `;
                    $cont.append(cardHtml);
                });
            }
        });
    }

    // Inicializar secciones
    cargarVecinosDestacados();
    cargarFauna("https://api.nookipedia.com/nh/fish", "#carousel-peces");
    cargarFauna("https://api.nookipedia.com/nh/bugs", "#carousel-insectos");

    // Lógica de navegación (Solo para Peces e Insectos, ya que Vecinos son 4 fijos)
    function setupNav(prevBtn, nextBtn, viewportId, scrollAmount) {
        $(nextBtn).on('click', function() {
            $(viewportId).animate({ scrollLeft: `+=${scrollAmount}` }, 400);
        });
        $(prevBtn).on('click', function() {
            $(viewportId).animate({ scrollLeft: `-=${scrollAmount}` }, 400);
        });
    }

    setupNav("#prev-p", "#next-p", "#carousel-peces", 250);
    setupNav("#prev-i", "#next-i", "#carousel-insectos", 250);


    // --- 3. GRID DE EVENTOS (Tablero Ajedrez) ---

    function obtenerEventos() {
        $.ajax({
            url: 'https://api.nookipedia.com/nh/events',
            method: 'GET',
            headers: HEADERS,
            success: function(eventos) {
                const $grid = $('.grid-eventos');
                $grid.empty();

                $.each(eventos.slice(0, 4), function(i, ev) {
                    const colorClase = (i % 2 === 0) ? 'image-placeholder-green' : 'image-placeholder-blue';
                    const $divColor = $('<div>').addClass(`evento-card ${colorClase}`);
                    const $divTitulo = $('<div>')
                        .addClass('evento-card evento-clickeable')
                        .text(ev.event)
                        .on('click', function() {
                            window.location.href = `evento.html?nombre=${encodeURIComponent(ev.event)}`;
                        });

                    if (i < 2) {
                        $grid.append($divColor, $divTitulo);
                    } else {
                        $grid.append($divTitulo, $divColor);
                    }
                });
            }
        });
    }

    obtenerEventos();
});