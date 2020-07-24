
fetch("/api/").then(r => r.json()).then(data => {
    // Sort data points from earliest to latest
    data.sort((a, b) => Date.parse(a.Datum) - Date.parse(b.Datum));
    let dates = data.map(e => e.Datum.slice(0, 10));
    let cases = data.map(e => e.SlucajeviHrvatska);
    let deaths = data.map(e => e.UmrliHrvatska);
    let recoveries = data.map(e => e.IzlijeceniHrvatska);
    let active = data.map(e => e.SlucajeviHrvatska - e.UmrliHrvatska - e.IzlijeceniHrvatska);
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
            }
        }
    });
});
