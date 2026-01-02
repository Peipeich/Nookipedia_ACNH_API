$(document).ready(function () {
    const $container = $("#faunaDetails"); // O el ID de tu contenedor de lista
    const $loading = $("#loading");
    const apiKey = "PONER-ACA-LA-API-KEY";
    const apiUrl = "https://api.nookipedia.com/nh/fish"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error connecting to the API");
        return res.json();
    })
    .then(fishList => {
        $container.empty();

        // LIMITAR A 20 PECES
        const limitedList = fishList.slice(0, 20);

        let html = '<div class="grid-fauna">'; // Puedes usar un grid similar al de eventos
        
        limitedList.forEach(fish => {
            const imagen = fish.image_url || fish.render_url || "";
            html += `
                <div class="fish-card">
                    <h3>${fish.name}</h3>
                    <img src="${imagen}" alt="${fish.name}" width="80">
                    <p>Price: ${fish.sell_nook} Bells</p>
                    <a href="detalle-pez.html?name=${encodeURIComponent(fish.name)}">Ver más</a>
                </div>
            `;
        });

        html += '</div>';
        $container.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $container.html(`<p>Error: ${err.message}</p>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});