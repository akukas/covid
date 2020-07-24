
fetch("/api/").then(r => r.json()).then(data => {
    // Sort entries from earliest to latest
    data.sort((a, b) => Date.parse(a.Datum) - Date.parse(b.Datum));
    let filtered_data = [];
    for (let entry of data) {
        // Only interested in the date, not time of reporting
        entry.Datum = entry.Datum.slice(0, 10);
        // If there are mutliple entries for the same date, use the latest one
        let previous = filtered_data.pop();
        if (previous && previous.Datum !== entry.Datum) {
            filtered_data.push(previous);
        }
        filtered_data.push(entry);
    }
    let dates = filtered_data.map(e => e.Datum);
    let cases = filtered_data.map(e => e.SlucajeviHrvatska);
    let deaths = filtered_data.map(e => e.UmrliHrvatska);
    let recoveries = filtered_data.map(e => e.IzlijeceniHrvatska);
    let active = filtered_data.map(e => e.SlucajeviHrvatska - e.UmrliHrvatska - e.IzlijeceniHrvatska);
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
