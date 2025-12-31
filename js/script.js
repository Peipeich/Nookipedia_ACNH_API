$(document).ready(function() {
    const API_KEY = "PONER-ACA-LA-API-KEY"; 
    let allVillagers = [];
    let currentIndex = 0;

    // --- FUNCIONALIDAD DEL MENÚ ---
    
    // Abrir/Cerrar Hamburguesa
    $('#mobile-menu').on('click', function() {
        $(this).toggleClass('is-active');
        $('.nav-links').toggleClass('active');
    });

    // Dropdown por clic en móviles
    $('.parent-link').on('click', function(e) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            $(this).siblings('.dropdown-content').toggleClass('show-submenu');
            $(this).find('.flecha').toggleClass('rotate-arrow');
        }
    });

    // --- FUNCIONALIDAD DEL CARRUSEL ---

    function getVillagers() {
        $.ajax({
            url: 'https://api.nookipedia.com/villagers?game=nh',
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Accept-Version': '1.0.0'
            },
            success: function(data) {
                allVillagers = data.slice(0, 10);
                if (allVillagers.length > 0) {
                    renderCarousel();
                }
            },
            error: function() {
                $('#carousel').html('<p>Error cargando datos de la API</p>');
            }
        });
    }

    function renderCarousel() {
        const $carousel = $('#carousel');
        $carousel.empty();

        for (let i = 0; i < 4; i++) {
            const index = (currentIndex + i) % allVillagers.length;
            const v = allVillagers[index];
            
            // Verificamos que existan los datos antes de imprimir
            if (v) {
                const $card = $(`
                    <div class="villager-card">
                        <img src="${v.image_url}" alt="${v.name}">
                        <div class="villager-name">${v.name}</div>
                    </div>
                `);
                $carousel.append($card);
            }
        }
    }

    $('#nextBtn').on('click', function() {
        if (allVillagers.length > 0) {
            currentIndex = (currentIndex + 1) % allVillagers.length;
            renderCarousel();
        }
    });

    $('#prevBtn').on('click', function() {
        if (allVillagers.length > 0) {
            currentIndex = (currentIndex - 1 + allVillagers.length) % allVillagers.length;
            renderCarousel();
        }
    });

    // Inicializar
    getVillagers();
});