// js/personajes.js
$(document).ready(function () {
    const $villagersList = $("#resultCont");
    const $loading = $("#loading");
    const $filterSpecies = $("#filterSpecies");
    const $filterPersonality = $("#filterPersonality");
    const $resetFilters = $("#resetFilters");
    const $filterCount = $("#filterCount");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/villagers?game=nh"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    let allVillagers = []; // Guardamos todos los personajes

    $villagersList.empty();

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
        if (!res.ok) throw new Error("Error de API: " + res.status);
        return res.json();
    })
    .then(villagers => {
        allVillagers = villagers;
        
        // Poblar filtros
        populateFilters(villagers);
        
        // Renderizar todos inicialmente
        renderVillagers(villagers);
        
        // Actualizar contador
        updateFilterCount(villagers.length, villagers.length);
    })
    .catch(err => {
        console.error("Error cargando personajes:", err);
        $villagersList.html(`<li style="grid-column: 1/-1; text-align:center; color: white;">Error: ${err.message}</li>`);
    })
    .finally(() => {
        $loading.hide();
    });

    // Función para poblar los filtros con opciones únicas
    function populateFilters(villagers) {
        // Obtener especies únicas
        const species = [...new Set(villagers.map(v => v.species))].sort();
        species.forEach(sp => {
            $filterSpecies.append(`<option value="${sp}">${sp}</option>`);
        });

        // Obtener personalidades únicas
        const personalities = [...new Set(villagers.map(v => v.personality))].sort();
        personalities.forEach(pers => {
            $filterPersonality.append(`<option value="${pers}">${pers}</option>`);
        });
    }

    // Función para renderizar personajes
    function renderVillagers(villagers) {
        if (villagers.length === 0) {
            $villagersList.html('<li style="grid-column: 1/-1; text-align:center; color: white; padding: 40px;">No se encontraron personajes con estos filtros.</li>');
            return;
        }

        let htmlContent = "";
        villagers.forEach(villager => {
            htmlContent += `
                <li data-species="${villager.species}" data-personality="${villager.personality}">
                    <a href="detallepersonaje.html?id=${encodeURIComponent(villager.name)}" class="character-card">
                        <div class="character-card-image">
                            <img src="${villager.image_url}" alt="${villager.name}">
                        </div>
                        <div class="character-card-info">
                            <div class="character-card-name">${villager.name}</div>
                            <div class="character-card-details">
                                ${villager.species} • ${villager.personality}
                            </div>
                        </div>
                    </a>
                </li>
            `;
        });
        
        $villagersList.html(htmlContent);
    }

    // Función para aplicar filtros
    function applyFilters() {
        const selectedSpecies = $filterSpecies.val();
        const selectedPersonality = $filterPersonality.val();

        let filtered = allVillagers;

        // Filtrar por especie
        if (selectedSpecies !== 'all') {
            filtered = filtered.filter(v => v.species === selectedSpecies);
        }

        // Filtrar por personalidad
        if (selectedPersonality !== 'all') {
            filtered = filtered.filter(v => v.personality === selectedPersonality);
        }

        // Renderizar resultados filtrados
        renderVillagers(filtered);
        
        // Actualizar contador
        updateFilterCount(filtered.length, allVillagers.length);
    }

    // Función para actualizar el contador de resultados
    function updateFilterCount(shown, total) {
        $filterCount.text(`Showing ${shown} of ${total} villagers`);
    }

    // Event listeners para los filtros
    $filterSpecies.on('change', applyFilters);
    $filterPersonality.on('change', applyFilters);

    // Botón de reiniciar filtros
    $resetFilters.on('click', function() {
        $filterSpecies.val('all');
        $filterPersonality.val('all');
        renderVillagers(allVillagers);
        updateFilterCount(allVillagers.length, allVillagers.length);
    });
});