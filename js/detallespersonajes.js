$(document).ready(function () {
    const $villagersdetailscont = $("#villagerDetails");
    const $loading = $("#loading");

    const apiKey = "PONER-ACA-LA-API-KEY";
    // Usamos el endpoint general de vecinos para traer a todos
    const apiUrl = `https://api.nookipedia.com/villagers`; 
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: 'GET',
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("API Error: " + res.status);
        return res.json();
    })
    .then(data => {
        if (!data || data.length === 0) {
            throw new Error("No villagers found.");
        }

        // --- EL TRUCO ESTÁ AQUÍ ---
        // Usamos .slice(0, 20) para quedarnos solo con los primeros 20 del array
        const limitedVillagers = data.slice(0, 20);

        let html = "";
        
        // Recorremos los 20 personajes limitados
        limitedVillagers.forEach(villager => {
            html += `
                <div class="villager-card">
                    <h2>${villager.name}</h2>
                    <img src="${villager.image_url}" alt="${villager.name}" width="100">
                    <p><strong>Species:</strong> ${villager.species}</p>
                    <p><strong>Personality:</strong> ${villager.personality}</p>
                    <a href="detalle-vecino.html?id=${encodeURIComponent(villager.name)}">Ver Detalles</a>
                    <hr>
                </div>
            `;
        });
        
        $villagersdetailscont.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $villagersdetailscont.html(`<p style="color:red;">${err.message}</p>`);
    })
    .finally(() => {
        $loading.hide();
    });
});