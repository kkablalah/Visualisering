let citiesChart, priceChart, bubbleChart;
let citiesChart, priceChart, bubbleChart, pivotChart;
let chartData = {};

document.addEventListener('DOMContentLoaded', async () => {
@@ -218,7 +218,7 @@ function initBubbleChart() {
});
}

// ---- PIVOT TABLE ----
// ---- PIVOT TABLE & CHART ----
function renderPivotTable(mode = 'score_sum') {
const pivotBody = document.getElementById('pivotBody');
const pivotLabel = document.getElementById('pivotLabel');
@@ -232,24 +232,102 @@ function renderPivotTable(mode = 'score_sum') {
};
pivotLabel.textContent = labelTextMap[mode] || 'Sum af BMO Score';

    let rows = '';
    // Prepare values for table/chart, allow cities with multiple data entries
    let cityGroups = {};
chartData.cities.forEach(city => {
        let value;
        if (!(city.By in cityGroups)) cityGroups[city.By] = [];
if (mode.startsWith('score')) {
            if (mode === 'score_sum') value = city.Score;
            if (mode === 'score_avg') value = city.Score; // For per city, avg == score (unless multiple entries per city)
            if (mode === 'score_max') value = city.Score;
        }
        if (mode.startsWith('price')) {
            if (mode === 'price_sum') value = city.Pris;
            if (mode === 'price_avg') value = city.Pris;
            if (mode === 'price_max') value = city.Pris;
            cityGroups[city.By].push(city.Score);
        } else if (mode.startsWith('price')) {
            cityGroups[city.By].push(city.Pris);
}
        rows += `<tr><td>${city.By}</td><td>${value}</td></tr>`;
});
    pivotBody.innerHTML = rows;

    let tableRows = '';
    let chartCities = [];
    let chartValues = [];

    Object.entries(cityGroups).forEach(([city, arr]) => {
        let value;
        if (mode.endsWith('_sum')) value = arr.reduce((a,b) => a + b, 0);
        if (mode.endsWith('_avg')) value = arr.reduce((a,b) => a + b, 0) / arr.length;
        if (mode.endsWith('_max')) value = Math.max(...arr);
        chartCities.push(city);
        chartValues.push(+value.toFixed(2));
        tableRows += `<tr><td>${city}</td><td>${+value.toFixed(2)}</td></tr>`;
    });

    pivotBody.innerHTML = tableRows;
    renderPivotChart(chartCities, chartValues, labelTextMap[mode]);
}

function renderPivotChart(labels, data, label) {
    const ctx = document.getElementById('pivotChart').getContext('2d');
    if (pivotChart) {
        pivotChart.destroy();
    }
    pivotChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: '#d4a574',
                borderColor: '#c9915c',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: '#e74c3c',
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 13, family: 'Helvetica Neue', weight: 'bold' },
                        color: '#ffffff',
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e6edf3',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.15)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#e6edf3',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

// ---- BAKERY CARDS ----
function renderBakeryGrid() {
@@ -304,9 +382,9 @@ function enableScrollAnimations() {
});
}


window.addEventListener('resize', () => {
if (citiesChart) citiesChart.resize();
if (priceChart) priceChart.resize();
if (bubbleChart) bubbleChart.resize();
    if (pivotChart) pivotChart.resize();
});
