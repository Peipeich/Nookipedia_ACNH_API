$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Asegúrate de que esta variable esté correctamente definida aquí
    const villagerID = urlParams.get("id"); 

    const $gameDetailsCont = $("#gameDetails");
    const $loading = $("#loading");

    // 2. Verificación de seguridad
    if (!villagerID) {
        $gameDetailsCont.html("<p>Error: No se proporcionó un nombre de vecino.</p>");
        $loading.hide();
        return;
    }

    // 3. Ahora usamos villagerID dentro del fetch
    // Usamos el endpoint de búsqueda (?name=) para evitar el error 404 del preflight
    fetch(`https://api.nookipedia.com/villagers?name=${encodeURIComponent(villagerID)}`, {
        method: 'GET',
        headers: {
            "X-API-KEY": "eebcaf09-f716-4786-ba4e-9fba802d6aaa",
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la API: " + res.status);
        return res.json();
    })
    .then(data => {
        // La búsqueda por nombre devuelve un array [ ]
        if (!data || data.length === 0) {
            throw new Error("No se encontró al vecino: " + villagerID);
        }

        const villager = data[0]; // Tomamos el primer resultado

        const html = `
            <h2>${villager.name}</h2>
            <img src="${villager.image_url}" alt="${villager.name}" width="150">
            <p><strong>Especie:</strong> ${villager.species}</p>
            <p><strong>Personalidad:</strong> ${villager.personality}</p>
            <p><strong>Género:</strong> ${villager.gender}</p>
            <p><strong>Cumpleaños:</strong> ${villager.birthday_month} ${villager.birthday_day}</p>
            <p><strong>Frase:</strong> "${villager.phrase}"</p>
        `;
        $gameDetailsCont.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $gameDetailsCont.html(`<p style="color:red;">${err.message}</p>`);
    })
    .finally(() => {
        $loading.hide();
    });
});