$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const fishName = params.get("name");

    const $details = $("#faunaDetails"); 
    const $loading = $("#loading");

    if (!fishName) {
        $details.html("<p>Error: No fish name provided.</p>");
        $loading.hide();
        return;
    }

    const apiKey = "PONER-ACA-LA-API-KEY";
    const apiUrl = "https://api.nookipedia.com/nh/fish"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error connecting to the API");
        return res.json();
    })
    .then(fishList => {
        // Search for the fish matching the name from the URL
        const fish = fishList.find(f => f.name.toLowerCase() === fishName.toLowerCase());

        if (!fish) {
            throw new Error(`Fish "${fishName}" not found in the list.`);
        }

        $details.empty();

        const imagen = fish.image_url || fish.render_url || "";
        const months = (fish.north && fish.north.months) ? fish.north.months : "Available all year";

        const html = `
            <div>
                <h1>${fish.name}</h1>
                <img src="${imagen}" alt="${fish.name}">
                <ul>
                    <li><strong>Price:</strong> ${fish.sell_nook || "N/A"} Bells</li>
                    <li><strong>Location:</strong> ${fish.location || "N/A"}</li>
                    <li><strong>Months:</strong> ${months}</li>
                </ul>
                <p><em>"${fish.catchphrase || ""}"</em></p>
                <br>
                <a href="fauna.html">Back to list</a>
            </div>
        `;
        $details.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $details.html(`<p>There was a problem: ${err.message}</p>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});