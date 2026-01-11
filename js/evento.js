$(document).ready(function () {
    const $seasonList = $("#resultCont");
    const $loading = $("#loading");
    const $filterMonth = $("#filterMonth");
    const $filterType = $("#filterType");
    const $filterCount = $("#filterCount");
    const $resetFilters = $("#resetFilters");

    const apiKey = "eebcaf09-f716-4786-ba4e-9fba802d6aaa";
    const apiUrl = "https://api.nookipedia.com/nh/events";
    const proxyUrl = "https://corsproxy.io/?url=";

    let allEvents = [];

    $seasonList.empty();

    fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Accept-Version": "1.0.0"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la API: " + res.status);
        return res.json();
    })
    .then(events => {
        if (!Array.isArray(events) || events.length === 0) {
            $seasonList.html("<li>No events available</li>");
            return;
        }

        allEvents = removeDuplicateBirthdays(events);

        populateFilters(events);
        renderEvents(events);
        updateCount(events.length, events.length);
    })
    .catch(err => {
        $seasonList.html(`<li>Error: ${err.message}</li>`);
    })
    .finally(() => {
        if ($loading.length) $loading.hide();
    });

    // =====================
    // FILTROS
    // =====================

    function populateFilters(events) {
        const months = new Set();
        const categories = new Set();

        events.forEach(item => {
            if (item.date) {
                const month = new Date(item.date).getMonth() + 1;
                months.add(month);
            }

            categories.add(getEventCategory(item));
        });

        [...months].sort((a, b) => a - b).forEach(m => {
            $filterMonth.append(
                `<option value="${m}">${monthName(m)}</option>`
            );
        });

        [...categories].sort().forEach(cat => {
            $filterType.append(
                `<option value="${cat}">${cat}</option>`
            );
        });
    }

    function applyFilters() {
        const selectedMonth = $filterMonth.val();
        const selectedType = $filterType.val();

        let filtered = allEvents;

        if (selectedMonth !== "all") {
            filtered = filtered.filter(item =>
                item.date &&
                new Date(item.date).getMonth() + 1 == selectedMonth
            );
        }

        if (selectedType !== "all") {
            filtered = filtered.filter(item =>
                getEventCategory(item) === selectedType
            );
        }

        renderEvents(filtered);
        updateCount(filtered.length, allEvents.length);
    }

    $filterMonth.on("change", applyFilters);
    $filterType.on("change", applyFilters);

    $resetFilters.on("click", function () {
        $filterMonth.val("all");
        $filterType.val("all");
        renderEvents(allEvents);
        updateCount(allEvents.length, allEvents.length);
    });

    // =====================
    // RENDER
    // =====================

    function renderEvents(events) {
        let htmlContent = "";

        if (events.length === 0) {
            $seasonList.html("<li>No events found</li>");
            return;
        }

        events.forEach(item => {
            const eventName = item.event || "Event";
            const date = item.date || "No date";

            htmlContent += `
                <li>
                    <a href="detalleevento.html?name=${encodeURIComponent(eventName)}">
                        ${eventName}
                    </a>
                    <span> - ${date}</span>
                </li>
            `;
        });

        $seasonList.html(htmlContent);
    }

    function updateCount(shown, total) {
        $filterCount.text(`Showing ${shown} of ${total} events`);
    }

    // =====================
    // CATEGORIZACIÓN
    // =====================

    function getEventCategory(item) {
        if (!item.event) return "Special Event";

        const name = item.event.toLowerCase();

        if (name.includes("birthday")) return "Birthday";
        if (name.includes("fishing") || name.includes("bug")) return "Tournament";
        if (name.includes("day") || name.includes("festival")) return "Holiday";
        if (name.includes("season") || name.includes("snow") || name.includes("summer")) {
            return "Seasonal";
        }

        return "Special Event";
    }

    function monthName(m) {
        return [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ][m - 1];
    }
});

    // =====================
    // CUMPLEAÑOS ÚNICOS
    // =====================

function removeDuplicateBirthdays(events) {
    const seen = new Set();
    const result = [];

    events.forEach(item => {
        if (!item.event) return;

        if (item.event.toLowerCase().includes("birthday")) {
            if (seen.has(item.event)) return;
            seen.add(item.event);
        }

        result.push(item);
    });

    return result;
}