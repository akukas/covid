
fetch("/api/").then(r => r.json()).then(data => {
    // Sort entries from earliest to latest.
    data.sort((a, b) => Date.parse(a.Datum) - Date.parse(b.Datum));
    let filtered_data = [];
    for (let entry of data) {
        // Only interested in the date, not time of reporting.
        entry.Datum = entry.Datum.slice(0, 10);
        // If there are multiple entries for the same date, use the latest one.
        let previous = filtered_data.pop();
        if (previous && previous.Datum !== entry.Datum) {
            filtered_data.push(previous);
        }
        filtered_data.push(entry);
    }
    // Pull out values into separate arrays.
    let dates = filtered_data.map(e => e.Datum);
    let cases = filtered_data.map(e => e.SlucajeviHrvatska);
    let deaths = filtered_data.map(e => e.UmrliHrvatska);
    let recoveries = filtered_data.map(e => e.IzlijeceniHrvatska);
    let active = filtered_data.map(e => e.SlucajeviHrvatska - e.UmrliHrvatska - e.IzlijeceniHrvatska);
    // Show latest active case count, and the change from the previous day.
    let active_cases = active[active.length - 1];
    document.querySelector("header").innerHTML = `Aktivnih slučajeva: ${active_cases}`;
    let active_change = active_cases - active[active.length - 2];
    if (active_change) {
        document.querySelector("header").innerHTML += ` (${active_change > 0 ? "+" : ""}${active_change})`;
    }
    // Draw the chart.
    let chart = new Chart(document.getElementById("chart").getContext("2d"), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Slučajevi",
                data: cases,
                borderColor: "#F70",
                backgroundColor: "#FFF0"
            }, {
                label: "Oporavljeni",
                data: recoveries,
                borderColor: "#0A0",
                backgroundColor: "#FFF0"
            }, {
                label: "Umrli",
                data: deaths,
                borderColor: "#000",
                backgroundColor: "#FFF0"
            }, {
                label: "Aktivni",
                data: active,
                borderColor: "#F00",
                backgroundColor: "#F005"
            },]
        },
        options: {
            tooltips: {
                mode: "index"
            },
            scales: {
                xAxes: [{
                    type: "time"
                }]
            }
        }
    });
});
