$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the ID (name) from the URL
    const villagerID = urlParams.get("id"); 

    const $villagersdetailscont = $("#villagerDetails");
    const $loading = $("#loading");

    // Security check
    if (!villagerID) {
        $villagersdetailscont.html("<p>Error: No villager name provided.</p>");
        $loading.hide();
        return;
    }

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = `https://api.nookipedia.com/villagers?name=${encodeURIComponent(villagerID)}`;
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: 'GET',
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("API Error: " + res.status);
        return res.json();
    })
    .then(data => {
        // Name search returns an array [ ]
        if (!data || data.length === 0) {
            throw new Error("Villager not found: " + villagerID);
        }

        const villager = data[0]; // First result

        const html = `
            <h2>${villager.name}</h2>
            <img src="${villager.image_url}" alt="${villager.name}" width="150">
            <div>
                <p><strong>Species:</strong> ${villager.species}</p>
                <p><strong>Personality:</strong> ${villager.personality}</p>
                <p><strong>Gender:</strong> ${villager.gender}</p>
                <p><strong>Birthday:</strong> ${villager.birthday_month} ${villager.birthday_day}</p>
                <p><strong>Catchphrase:</strong> "${villager.phrase}"</p>
                <p><strong>Sign:</strong> ${villager.sign}</p>
            </div>
            <br>
            <a href="villagers.html">Back to list</a>
        `;
        $villagersdetailscont.html(html);
    })
    .catch(err => {
        console.error("Error:", err);
        $villagersdetailscont.html(`<p style="color:red;">${err.message}</p>`);
    })
    .finally(() => {
        $loading.hide();
    });
});