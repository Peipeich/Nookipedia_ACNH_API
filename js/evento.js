$(document).ready(function () {
    const $seasonList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey =  "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
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
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
        if (!res.ok) throw new Error("Error en la API: " + res.status);
        return res.json();
    })
    .then(events => {
        if (!Array.isArray(events) || events.length === 0) {
            $seasonList.append("<li>No events available</li>");
            return;
        }

        let htmlContent = "";
        events.forEach(item => {
            const eventName = item.event || "Event";
            const date = item.date || "No date";

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