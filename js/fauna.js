$(document).ready(function () {
    const $faunaList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/nh/fish?per_page=9";
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
        if (res.status === 429) throw new Error("Límite excedido. Espera un minuto.");
        if (!res.ok) throw new Error("Error: " + res.status);
        return res.json();
    })
    .then(fishList => {
        let htmlContent = "";
        fishList.forEach(fish => {
            const name = fish.name || "Pez desconocido";
            const img = fish.image_url || "";
            const price = fish.sell_nook || "N/A";

            htmlContent += `
                <li>
                    <a href="detallefauna.html?name=${encodeURIComponent(name)}">
                        <img src="${img}" alt="${name}" onerror="this.style.display='none'">
                        <div>
                            <strong>${name}</strong>
                            <span>Precio: ${price} bayas</span>
                        </div>
                    </a>
                </li>
            `;
        });
        $faunaList.html(htmlContent);
    })
    .catch(err => {
        $faunaList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        $loading.hide();
    });
});