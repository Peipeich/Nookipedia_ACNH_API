// js/detallespersonajes.js
$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const villagerName = params.get("id");

    const $container = $("#villagerDetails");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = `https://api.nookipedia.com/villagers?name=${villagerName}`;
    const proxyUrl = "https://corsproxy.io/?url=";

    if (!villagerName) {
        $loading.text("Villager not found.");
        return;
    }

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
    })
    .then(data => {
        const v = data[0];

        $("#villagerName").text(v.name);

        const html = `
            <article class="villager-detail-card">
                <div class="villager-detail-image">
                    <img src="${v.image_url}" alt="${v.name}">
                </div>

                <div class="villager-detail-info">
                    <ul>
                        <li><strong>Species:</strong> ${v.species}</li>
                        <li><strong>Personality:</strong> ${v.personality}</li>
                        <li><strong>Gender:</strong> ${v.gender}</li>
                        <li><strong>Birthday:</strong> ${v.birthday}</li>
                        <li><strong>Catchphrase:</strong> “${v.catchphrase}”</li>
                        <li><strong>Hobby:</strong> ${v.hobby}</li>
                    </ul>
                </div>
            </article>
        `;

        $container.html(html);
    })
    .catch(err => {
        console.error(err);
        $loading.text("Error loading villager information.");
    });

});