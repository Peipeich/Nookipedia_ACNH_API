// js/detallespersonajes.js
$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const villagerName = params.get("id");

    const $container = $("#villagerDetails");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    // Nota: Es mejor buscar por nombre exacto para evitar múltiples resultados
    const apiUrl = `https://api.nookipedia.com/villagers?name=${villagerName}`;
    const proxyUrl = "https://corsproxy.io/?url=";

    if (!villagerName) {
        $loading.text("Villager not found in URL.");
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
        // La API devuelve un array, tomamos el primer elemento
        const v = data[0];

        if (!v) {
            $loading.text("Villager not found in database.");
            return;
        }

        // Limpiamos el mensaje de carga
        $loading.empty();

        $("#villagerName").text(v.name);

        // Formatear el cumpleaños (Nookipedia usa birthday_month y birthday_day)
        const birthdayStr = (v.birthday_month && v.birthday_day) 
                            ? `${v.birthday_month} ${v.birthday_day}` 
                            : "Unknown";

        const html = `
            <article class="villager-detail-card">
                <div class="villager-detail-image">
                    <img src="${v.image_url}" alt="${v.name}" style="max-width: 200px;">
                </div>

                <div class="villager-detail-info">
                    <ul>
                        <li><strong>Species:</strong> ${v.species}</li>
                        <li><strong>Personality:</strong> ${v.personality}</li>
                        <li><strong>Gender:</strong> ${v.gender}</li>
                        <li><strong>Birthday:</strong> ${birthdayStr}</li>
                        <li><strong>Catchphrase:</strong> “${v.phrase || 'N/A'}”</li>
                        <li><strong>Hobby:</strong> ${v.hobby || 'Not specified'}</li>
                    </ul>
                </div>
            </article>
        `;

        $container.html(html);
    })
    .catch(err => {
        console.error(err);
        $loading.text("Error loading villager information. Please try again.");
    });

});