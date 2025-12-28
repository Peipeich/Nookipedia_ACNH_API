$(document).ready(function () {
    const $gameList = $("#resultCont");
    const $loading = $("#loading");

    // Parámetros
    const params = new URLSearchParams();
    params.append("per_page", 9);

    fetch("https://api.nookipedia.com/villagers?" + params.toString(), {
        headers: {
            "X-API-KEY": "eebcaf09-f716-4786-ba4e-9fba802d6aaa"
        }
    })
    .then(res => res.json())
    .then(villagers => {
        villagers.forEach(villager => {
            // Usamos file_name para construir la URL correctamente
            let listItem = `
                <li>
                    <a href="detallepersonaje.html?id=${encodeURIComponent(villager.name)}">
    ${villager.name}
</a>

                </li>
            `;
            $gameList.append(listItem);
        });
    })
    .catch(err => {
        console.error("Error al cargar villagers:", err);
    })
    .finally(() => {
        $loading.hide();
    });
});
