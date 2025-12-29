$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get("name");

    const $details = $("#seasonDetails");
    const $loading = $("#loading");

    if (!eventName) {
        $details.html("<p>Nombre no encontrado.</p>");
        $loading.hide();
        return;
    }

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/nh/events"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => res.json())
    .then(events => {
        const event = events.find(e => e.event === eventName);

        if (!event) throw new Error("No se encontró el evento.");

        $details.empty();

        const html = `
            <div>
                <h1>${event.event}</h1>
                <p>Fecha: ${event.date}</p>
                <p>Tipo: ${event.type}</p>
                <p>Descripción: ${event.description || "Sin descripción disponible."}</p>
            </div>
            <a href="estaciones.html">Volver</a>
        `;
        $details.append(html);
    })
    .catch(err => {
        $details.html(`<p>Error: ${err.message}</p>`);
    })
    .finally(() => {
        $loading.hide();
    });
});