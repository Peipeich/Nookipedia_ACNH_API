$(document).ready(function () {
    const $seasonList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey =  "PONER-ACA-LA-API-KEY";
    const apiUrl = "https://api.nookipedia.com/nh/events"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    $seasonList.empty();

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (res.status === 429) throw new Error("Límite de peticiones alcanzado. Espera un momento.");
        if (!res.ok) throw new Error("Error en la API: " + res.status);
        return res.json();
    })
    .then(events => {
        if (!Array.isArray(events) || events.length === 0) {
            $seasonList.append("<li>No hay eventos disponibles.</li>");
            return;
        }

        let htmlContent = "";
        events.forEach(item => {
            const eventName = item.event || "Evento";
            const date = item.date || "Sin fecha";

            // Enlace corregido a detalleestaciones.html
            htmlContent += `
                <li>
                    <a href="detalleevento.html?name=${encodeURIComponent(eventName)}">
                        ${eventName}
                    </a>
                    <span> - ${date}</span>
                </li>
            `;
        });

        $seasonList.html(htmlContent);
    })
    .catch(err => {
        $seasonList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});