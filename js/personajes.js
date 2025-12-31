$(document).ready(function () {
    const $villagersList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey = "PONER-ACA-LA-API-KEY";
    const apiUrl = "https://api.nookipedia.com/villagers"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    $villagersList.empty();

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
        if (!res.ok) throw new Error("API Error: " + res.status);
        return res.json();
    })
    .then(villagers => {
        let htmlContent = "";
        
        // Ahora recorremos el array completo sin usar .slice()
        villagers.forEach(villager => {
            htmlContent += `
                <li>
                    <a href="detallepersonaje.html?id=${encodeURIComponent(villager.name)}">
                        <strong>${villager.name}</strong>
                    </a>
                    <span> (${villager.species})</span>
                </li>
            `;
        });
        
        $villagersList.html(htmlContent);
    })
    .catch(err => {
        console.error("Error loading villagers:", err);
        $villagersList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        $loading.hide();
    });
});