let citiesChart, priceChart, bubbleChart;
let chartData = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('chartData.json');
        chartData = await response.json();

        updatePriceStats();
        initCitiesBarChart();
        initPriceDistributionChart();
        initBubbleChart();
        renderBakeryGrid();
        enableScrollAnimations();
        renderPivotTable();

        document.getElementById('pivotControl').addEventListener('change', e => {
            renderPivotTable(e.target.value);
        });

    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// ---- PRICE STATISTICS ----
function updatePriceStats() {
    const stats = chartData.priceStats;
    document.getElementById('minPrice').textContent = `${stats.min} kr.`;
    document.getElementById('maxPrice').textContent = `${stats.max} kr.`;
    document.getElementById('meanPrice').textContent = `${stats.mean} kr.`;
    document.getElementById('medianPrice').textContent = `${stats.median} kr.`;
}

// ---- BAR CHART (CITIES) ----
function initCitiesBarChart() {
    const ctx = document.getElementById('citiesChart').getContext('2d');
    const labels = chartData.cities.map(c => c.By);
    const scores = chartData.cities.map(c => c.Score);
    const maxScore = Math.max(...scores);

    const colors = scores.map(score => {
        const ratio = score / maxScore;
        if (ratio > 0.9) return '#d4a574';
        if (ratio > 0.7) return '#c9915c';
        if (ratio > 0.5) return '#9d7c5c';
        return '#6c6c6c';
    });

    citiesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Gennemsnitlig BMO Score',
                data: scores,
                backgroundColor: colors,
                borderColor: '#d4a574',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: '#d4a574',
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                    labels: { font: {size:13, family:'Helvetica Neue', weight:'bold'}, color:'#ffffff', padding:20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: context => 'Score: ' + context.parsed.y.toFixed(1)
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 6,
                    ticks: { color: '#e6edf3', font: { size: 12, weight: 'bold' } },
                    grid: { color: 'rgba(212, 165, 116, 0.15)', drawBorder: false }
                },
                x: { ticks: { color: '#e6edf3', font: { size: 12, weight: 'bold' } }, grid: { display: false } }
            }
        }
    });
}

// ---- LINE CHART (PRICE DISTRIBUTION) ----
function initPriceDistributionChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const labels = chartData.cities.map(c => c.By);
    const prices = chartData.cities.map(c => c.Pris);

    const colors = prices.map(price => {
        if (price > 40) return '#e74c3c';
        if (price > 35) return '#d4a574';
        if (price > 30) return '#9d7c5c';
        return '#6c6c6c';
    });

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Gennemsnitlig Pris (kr.)',
                data: prices,
                borderColor: '#d4a574',
                backgroundColor: 'rgba(212, 165, 116, 0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 7,
                pointBackgroundColor: colors,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2.5,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: {size:13, weight:'bold'}, color:'#ffffff' }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: context => 'Pris: ' + context.parsed.y.toFixed(1) + ' kr.'
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: {color:'#e6edf3', font:{size:12, weight:'bold'}}, grid: {color:'rgba(212, 165, 116, 0.15)', drawBorder:false} },
                x: { ticks: {color:'#e6edf3', font:{size:12, weight:'bold'}}, grid: {display:false} }
            }
        }
    });
}

// ---- BUBBLE CHART ----
function initBubbleChart() {
    const ctx = document.getElementById('bubbleChart').getContext('2d');
    const bubbleDatasets = [];
    const colors = ['#d4a574', '#c9915c', '#9d7c5c', '#6c6c6c', '#e74c3c', '#f39c12', '#3498db', '#2ecc71'];

    chartData.cities.forEach((city, idx) => {
        bubbleDatasets.push({
            label: city.By,
            data: [{ x: city.Pris, y: city.Score, r: Math.sqrt(city.Antal)*8 }],
            backgroundColor: colors[idx%colors.length]+'b3',
            borderColor: colors[idx%colors.length],
            borderWidth: 2
        });
    });

    bubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: { datasets: bubbleDatasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font:{size:12, weight:'bold'}, color:'#e6edf3', padding:10 }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: context => {
                            const city = context.raw;
                            return `${context.dataset.label} — Pris: ${city.x} kr. | Score: ${city.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display:true, text:'Pris (kr.)', color:'#ffffff', font:{size:13, weight:'bold'} },
                    ticks: { color:'#e6edf3', font:{size:12, weight:'bold'} },
                    grid:{color:'rgba(212, 165, 116, 0.15)', drawBorder:false}
                },
                y: {
                    title: { display:true, text:'Score', color:'#ffffff', font:{size:13, weight:'bold'} },
                    ticks: { color:'#e6edf3', font:{size:12, weight:'bold'} },
                    grid:{color:'rgba(212, 165, 116, 0.15)', drawBorder:false}
                }
            }
        }
    });
}

// ---- PIVOT TABLE ----
function renderPivotTable(mode = 'score_sum') {
    const pivotBody = document.getElementById('pivotBody');
    const pivotLabel = document.getElementById('pivotLabel');
    let labelTextMap = {
        score_sum: 'Sum af BMO Score',
        score_avg: 'Gennemsnit af BMO Score',
        score_max: 'Maks BMO Score',
        price_sum: 'Sum af BMO Pris',
        price_avg: 'Gennemsnit af BMO Pris',
        price_max: 'Maks BMO Pris'
    };
    pivotLabel.textContent = labelTextMap[mode] || 'Sum af BMO Score';

    let rows = '';
    chartData.cities.forEach(city => {
        let value;
        if (mode.startsWith('score')) {
            if (mode === 'score_sum') value = city.Score;
            if (mode === 'score_avg') value = city.Score; // For per city, avg == score (unless multiple entries per city)
            if (mode === 'score_max') value = city.Score;
        }
        if (mode.startsWith('price')) {
            if (mode === 'price_sum') value = city.Pris;
            if (mode === 'price_avg') value = city.Pris;
            if (mode === 'price_max') value = city.Pris;
        }
        rows += `<tr><td>${city.By}</td><td>${value}</td></tr>`;
    });
    pivotBody.innerHTML = rows;
}


// ---- BAKERY CARDS ----
function renderBakeryGrid() {
    const bakeryContainer = document.getElementById('bakery-list');
    bakeryContainer.innerHTML = '';
    chartData.bakeries.forEach((bakery, idx) => {
        const bakeryCard = document.createElement('div');
        bakeryCard.className = 'bakery-card';
        bakeryCard.style.animationDelay = `${idx * 50}ms`;

        bakeryCard.innerHTML = `
            <div class="bakery-rank">#${idx + 1}</div>
            <div class="bakery-name">${bakery.name}</div>
            <div class="bakery-location">${bakery.city}</div>
            <div class="bakery-score">${bakery.score}</div>
            <div class="bakery-details">
                <div class="detail">
                    <span class="label">Pris:</span>
                    <span class="value">${bakery.price.toFixed(1)} kr.</span>
                </div>
                <div class="detail">
                    <span class="label">Ost:</span>
                    <span class="value">${bakery.cheese}</span>
                </div>
            </div>
        `;
        bakeryContainer.appendChild(bakeryCard);
    });
}

// ---- SCROLL ANIMATIONS ----
function enableScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}


window.addEventListener('resize', () => {
    if (citiesChart) citiesChart.resize();
    if (priceChart) priceChart.resize();
    if (bubbleChart) bubbleChart.resize();
});
