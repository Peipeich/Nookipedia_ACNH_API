$(document).ready(function () {
    const $faunaList = $("#resultCont");
    const $loading = $("#loading");

    const apiKey =  "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    // Removed ?per_page=9 to get the full list
    const apiUrl = "https://api.nookipedia.com/nh/fish"; 
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
        if (res.status === 429) throw new Error("Rate limit exceeded. Please wait a minute.");
        if (!res.ok) throw new Error("Error: " + res.status);
        return res.json();
    })
    .then(fishList => {
        let htmlContent = "";
        fishList.forEach(fish => {
            const name = fish.name || "Unknown Fish";
            const img = fish.image_url || "";
            const price = fish.sell_nook || "N/A";

            // All text labels are now in English
            htmlContent += `
                <li>
                    <a href="detallefauna.html?name=${encodeURIComponent(name)}">
                        <img src="${img}" alt="${name}" onerror="this.style.display='none'">
                        <div>
                            <strong>${name}</strong>
                            <span>Price: ${price} Bells</span>
                        </div>
                    </a>
                </li>
            `;
        });
        $faunaList.html(htmlContent);
    })
    .catch(err => {
        console.error("Fauna error:", err);
        $faunaList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });
});