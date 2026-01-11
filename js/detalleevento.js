$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get("name");

    const $details = $("#eventDetails"); 
    const $loading = $("#loading");

    if (!eventName) {
        $details.html("<p>Event name not found.</p>");
        $loading.hide();
        return;
    }

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/nh/events"; 
    const proxyUrl = "https://corsproxy.io/?url=";

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("API Connection Error");
        return res.json();
    })
    .then(events => {
        const event = events.find(e => e.event.toLowerCase() === eventName.toLowerCase());

        if (!event) throw new Error("Event not found.");

        $details.empty();

        const html = `
            <div>
                <h1>${event.event}</h1>
                <p><strong>Date:</strong> ${event.date || "N/A"}</p>
                <p><strong>Type:</strong> ${getEventCategory(event)}</p>
            </div>
        `;
        $details.append(html);
    })
    .catch(err => {
        $details.html(`<p>Error: ${err.message}</p>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });

    // Función de categorización 

    function getEventCategory(item) {
        if (!item.event) return "Special Event";

        const name = item.event.toLowerCase();

        if (name.includes("birthday")) return "Birthday";
        if (name.includes("fishing") || name.includes("bug")) return "Tournament";
        if (name.includes("day") || name.includes("festival")) return "Holiday";
        if (name.includes("season") || name.includes("snow") || name.includes("summer")) return "Seasonal";

        return "Special Event";
    }
});
