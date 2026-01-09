// js/personajes.js
$(document).ready(function () {
    const $villagersList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/villagers?game=nh"; 
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
        
        villagers.forEach(villager => {
            htmlContent += `
                <li>
                    <a href="detallepersonaje.html?id=${encodeURIComponent(villager.name)}" class="character-card">
                        <div class="character-card-image">
                            <img src="${villager.image_url}" alt="${villager.name}">
                        </div>
                        <div class="character-card-info">
                            <div class="character-card-name">${villager.name}</div>
                            <div class="character-card-details">${villager.species}</div>
                        </div>
                    </a>
                </li>
            `;
        });
        
        $villagersList.html(htmlContent);
    })
    .catch(err => {
        console.error("Error loading villagers:", err);
        $villagersList.html(`<li style="grid-column: 1/-1; text-align:center; color: white;">Error: ${err.message}</li>`);
    })
    .finally(() => {
        $loading.hide();
    });
});