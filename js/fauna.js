$(document).ready(function () {
    const $faunaList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey =  "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    // Removed ?per_page=9 to get the full list
    const apiUrl = "https://api.nookipedia.com/nh/fish"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    $faunaList.empty();

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (res.status === 429) throw new Error("Rate limit exceeded. Please wait a minute.");
        if (!res.ok) throw new Error("Error: " + res.status);
        return res.json();
    })
    .then(fishList => {
        let htmlContent = "";
        fishList.forEach(fish => {
            const name = fish.name || "Unknown Fish";
            const img = fish.image_url || "";
            const price = fish.sell_nook || "N/A";

            // All text labels are now in English
            htmlContent += `
                <li>
                    <a href="detallefauna.html?name=${encodeURIComponent(name)}">
                        <img src="${img}" alt="${name}" onerror="this.style.display='none'">
                        <div>
                            <strong>${name}</strong>
                            <span>Price: ${price} Bells</span>
                        </div>
                    </a>
                </li>
            `;
        });
        $faunaList.html(htmlContent);
    })
    .catch(err => {
        console.error("Fauna error:", err);
        $faunaList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});
// js/fauna.js
$(document).ready(function () {
    const $faunaList = $("#resultCont");
    const $loading = $("#loading");
    const $filterLocation = $("#filterLocation");
    const $filterPrice = $("#filterPrice");
    const $resetFilters = $("#resetFilters");
    const $filterCount = $("#filterCount");
    const $tabBtns = $(".tab-btn");

    const apiKey = "PONER-ACA-LA-API-KEY";
    const proxyUrl = "https://corsproxy.io/?url=";

    let allCritters = [];
    let currentType = 'fish'; // fish, bugs, sea

    // URLs de la API
    const apiUrls = {
        fish: "https://api.nookipedia.com/nh/fish",
        bugs: "https://api.nookipedia.com/nh/bugs",
        sea: "https://api.nookipedia.com/nh/sea"
    };

    // Cargar tipo inicial (peces)
    loadCritters('fish');

    // Event listeners para las pestañas
    $tabBtns.on('click', function() {
        const type = $(this).data('type');
        
        // Actualizar pestaña activa
        $tabBtns.removeClass('active');
        $(this).addClass('active');
        
        // Cargar nuevo tipo
        currentType = type;
        loadCritters(type);
    });

    // Función para cargar criaturas según tipo
    function loadCritters(type) {
        $loading.show();
        $faunaList.empty();
        
        fetch(proxyUrl + encodeURIComponent(apiUrls[type]), {
            method: "GET",
            headers: {
                "X-API-KEY": apiKey,
                "Accept-Version": "1.0.0"
            }
        })
        .then(res => {
            if (res.status === 429) throw new Error("Límite de peticiones alcanzado. Espera un momento.");
            if (!res.ok) throw new Error("Error: " + res.status);
            return res.json();
        })
        .then(critters => {
            allCritters = critters;
            
            // Poblar filtros
            populateLocationFilter(critters, type);
            
            // Renderizar todos inicialmente
            renderCritters(critters, type);
            
            // Actualizar contador
            updateFilterCount(critters.length, critters.length);
        })
        .catch(err => {
            console.error("Error cargando fauna:", err);
            $faunaList.html(`<li style="grid-column: 1/-1; text-align:center; color: white;">Error: ${err.message}</li>`);
        })
        .finally(() => {
            $loading.hide();
        });
    }

    // Función para poblar el filtro de ubicación
    function populateLocationFilter(critters, type) {
        $filterLocation.empty();
        $filterLocation.append('<option value="all">Todas las ubicaciones</option>');
        
        let locations = [];
        
        if (type === 'fish' || type === 'bugs') {
            locations = [...new Set(critters.map(c => c.location))].sort();
        } else if (type === 'sea') {
            // Las criaturas marinas no tienen ubicación específica
            $filterLocation.prop('disabled', true);
            return;
        }
        
        $filterLocation.prop('disabled', false);
        locations.forEach(loc => {
            if (loc) {
                $filterLocation.append(`<option value="${loc}">${loc}</option>`);
            }
        });
    }

    // Función para renderizar criaturas
    function renderCritters(critters, type) {
        if (critters.length === 0) {
            $faunaList.html('<li style="grid-column: 1/-1; text-align:center; color: white; padding: 40px;">No se encontraron criaturas con estos filtros.</li>');
            return;
        }

        let htmlContent = "";
        critters.forEach(critter => {
            const img = critter.image_url || critter.render_url || "";
            const price = type === 'fish' ? critter.sell_nook : 
                         type === 'bugs' ? critter.sell_nook : 
                         critter.sell_nook;
            const location = critter.location || "Mar";

            htmlContent += `
                <li class="fauna-item" data-location="${location}" data-price="${price}">
                    <a href="detallefauna.html?name=${encodeURIComponent(critter.name)}&type=${type}" class="character-card">
                        <div class="character-card-image">
                            <img src="${img}" alt="${critter.name}" onerror="this.style.display='none'">
                        </div>
                        <div class="character-card-info">
                            <div class="character-card-name">${critter.name}</div>
                            <div class="character-card-details">
                                💰 ${price} Bells<br>
                                📍 ${location}
                            </div>
                        </div>
                    </a>
                </li>
            `;
        });
        
        $faunaList.html(htmlContent);
    }

    // Función para aplicar filtros
    function applyFilters() {
        const selectedLocation = $filterLocation.val();
        const selectedPrice = parseInt($filterPrice.val());

        let filtered = allCritters;

        // Filtrar por ubicación
        if (selectedLocation !== 'all') {
            filtered = filtered.filter(c => c.location === selectedLocation);
        }

        // Filtrar por precio
        if (selectedPrice > 0) {
            filtered = filtered.filter(c => {
                const price = c.sell_nook || 0;
                return price >= selectedPrice;
            });
        }

        // Renderizar resultados filtrados
        renderCritters(filtered, currentType);
        
        // Actualizar contador
        updateFilterCount(filtered.length, allCritters.length);
    }

    // Función para actualizar el contador de resultados
    function updateFilterCount(shown, total) {
        const typeNames = {
            fish: 'peces',
            bugs: 'insectos',
            sea: 'criaturas marinas'
        };
        $filterCount.text(`Mostrando ${shown} de ${total} ${typeNames[currentType]}`);
    }

    // Event listeners para los filtros
    $filterLocation.on('change', applyFilters);
    $filterPrice.on('change', applyFilters);

    // Botón de reiniciar filtros
    $resetFilters.on('click', function() {
        $filterLocation.val('all');
        $filterPrice.val('0');
        renderCritters(allCritters, currentType);
        updateFilterCount(allCritters.length, allCritters.length);
    });
});