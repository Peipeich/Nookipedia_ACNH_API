$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const faunaName = params.get("name");
    const faunaType = params.get("type") || "fish"; // fish | bugs | sea

    const $container = $("#faunaDetails");
    const $loading = $("#loading");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const proxyUrl = "https://corsproxy.io/?url=";

    const apiUrls = {
        fish: "https://api.nookipedia.com/nh/fish",
        bugs: "https://api.nookipedia.com/nh/bugs",
        sea: "https://api.nookipedia.com/nh/sea"
    };

    if (!faunaName) {
        $loading.text("Fauna not found.");
        return;
    }

    fetch(proxyUrl + encodeURIComponent(apiUrls[faunaType]), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
    })
    .then(list => {
        const fauna = list.find(item => item.name === faunaName);

        if (!fauna) {
            throw new Error("Fauna not found");
        }

        $("#faunaName").text(fauna.name);

        const image = fauna.image_url || fauna.render_url || "";

        const html = `
            <article class="fauna-detail-card">
                <div class="fauna-detail-image">
                    <img src="${image}" alt="${fauna.name}">
                </div>

                <div class="fauna-detail-info">
                    <ul>
                        <li><strong>Type:</strong> ${faunaType}</li>
                        <li><strong>Location:</strong> ${fauna.location || "Sea"}</li>
                        <li><strong>Sell price:</strong> ${fauna.sell_nook} Bells</li>
                        <li><strong>Rarity:</strong> ${fauna.rarity || "—"}</li>
                        <li><strong>Available time:</strong> ${fauna.north?.time || "All day"}</li>
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