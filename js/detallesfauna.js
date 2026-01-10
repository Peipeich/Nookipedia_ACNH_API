$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const faunaName = params.get("name");

    const $container = $("#faunaDetails");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = `https://api.nookipedia.com/nh/fish?name=${encodeURIComponent(faunaName)}`;
    const proxyUrl = "https://corsproxy.io/?url=";

    if (!faunaName) {
        $loading.text("Fauna not found.");
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
        const f = data[0];

        $("#faunaName").text(f.name);

        const html = `
            <article class="fauna-detail-card">
                <div class="fauna-detail-image">
                    <img src="${f.image_url || f.render_url}" alt="${f.name}">
                </div>

                <div class="fauna-detail-info">
                    <ul>
                        <li><strong>Location:</strong> ${f.location}</li>
                        <li><strong>Sell Price:</strong> ${f.sell_nook} Bells</li>
                        <li><strong>Shadow Size:</strong> ${f.shadow}</li>
                        <li><strong>Rarity:</strong> ${f.rarity}</li>
                        <li><strong>Available Months:</strong> ${f.north.availability_array.join(", ")}</li>
                        <li><strong>Time:</strong> ${f.north.time}</li>
                    </ul>
                </div>
            </article>
        `;

        $container.html(html);
    })
    .catch(err => {
        console.error(err);
        $loading.text("Error loading fauna information.");
    });

});