$(document).ready(function() {
    // --- CONFIGURACIÓN GLOBAL ---
    const API_KEY = "eebcaf09-f716-4786-ba4e-9fba802d6aaa"; 
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

    // Manejo de clicks en dropdown para móvil
    $('.parent-link').on('click', function(e) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            $(this).siblings('.dropdown-content').toggleClass('show-submenu');
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
                
                // Solo 4 personajes: el 2º será el grande por CSS
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
            },
            error: function() {
                $("#carousel-villagers").html('<p>Error cargando vecinos</p>');
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
            },
            error: function() {
                $(containerId).html('<p>Error cargando fauna</p>');
            }
        });
    }

    // Inicializar secciones
    cargarVecinosDestacados();
    cargarFauna("https://api.nookipedia.com/nh/fish", "#carousel-peces");
    cargarFauna("https://api.nookipedia.com/nh/bugs", "#carousel-insectos");

    // Lógica de navegación (Solo para Peces e Insectos)
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


    // --- 3. GRID DE EVENTOS (Tablero Ajedrez Invertido) ---

    function obtenerEventos() {
        $.ajax({
            url: 'https://api.nookipedia.com/nh/events',
            method: 'GET',
            headers: HEADERS,
            success: function(eventos) {
                const $grid = $('.grid-eventos');
                $grid.empty();

                // Tomamos 4 eventos
                $.each(eventos.slice(0, 4), function(i, ev) {
                    const colorClase = (i % 2 === 0) ? 'image-placeholder-green' : 'image-placeholder-blue';
                    
                    const $divColor = $('<div>').addClass(`evento-card ${colorClase}`);
                    const $divTitulo = $('<div>')
                        .addClass('evento-card')
                        .css({'background-color': '#d3d3d3', 'cursor': 'pointer'})
                        .text(ev.event)
                        .on('click', function() {
                            window.location.href = `evento.html?nombre=${encodeURIComponent(ev.event)}`;
                        });

                    // LÓGICA DE TABLERO:
                    // Fila 1 (i=0,1): Texto -> Color
                    // Fila 2 (i=2,3): Color -> Texto (Invertido)
                    if (i < 2) {
                        $grid.append($divTitulo, $divColor);
                    } else {
                        $grid.append($divColor, $divTitulo);
                    }
                });
            }
        });
    }

    obtenerEventos();
});