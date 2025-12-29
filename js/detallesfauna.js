$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const fishName = params.get("name");

    const $details = $("#faunaDetails"); 
    const $loading = $("#loading");

    if (!fishName) {
        $details.html("<p>Error: No se recibió el nombre del pez.</p>");
        $loading.hide();
        return;
    }

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    // Traemos la lista completa para buscar el pez exacto
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
        if (!res.ok) throw new Error("Error al conectar con la API");
        return res.json();
    })
    .then(fishList => {
        // Buscamos el pez que coincida con el nombre de la URL
        const fish = fishList.find(f => f.name.toLowerCase() === fishName.toLowerCase());

        if (!fish) {
            throw new Error(`No se encontró el pez "${fishName}" en la lista.`);
        }

        $details.empty();

        const imagen = fish.image_url || fish.render_url || "";
        const meses = (fish.north && fish.north.months) ? fish.north.months : "Disponible todo el año";

        const html = `
            <div>
                <h1>${fish.name}</h1>
                <img src="${imagen}" alt="${fish.name}">
                <ul>
                    <li><strong>Precio:</strong> ${fish.sell_nook || "N/A"} bayas</li>
                    <li><strong>Ubicación:</strong> ${fish.location || "N/A"}</li>
                    <li><strong>Meses:</strong> ${meses}</li>
                </ul>
                <p><em>"${fish.catchphrase || ""}"</em></p>
                <br>
                <a href="fauna.html">Volver a la lista</a>
            </div>
        `;
        $details.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $details.html(`<p>Hubo un problema: ${err.message}</p>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});