// ========================================
// PIVOT CHARTS & ADVANCED VISUALIZATIONS
// DARK MODE VERSION - High Contrast Text
// With Chart.js for professional data analysis
// ========================================

// Global chart objects
let citiesChart, categoryChart, priceChart, bubbleChart;

// Load data from JSON
let chartData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data from JSON file
        const response = await fetch('chartData.json');
        chartData = await response.json();
        
        // Populate price statistics
        updatePriceStats();
        
        // Initialize all charts with preattentive attributes
        initCitiesBarChart();
        initCategoryRadarChart();
        initPriceDistributionChart();
        initBubbleChart();
        
        // Render bakery cards
        renderBakeryGrid();
        
        // Enable scroll animations
        enableScrollAnimations();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// ========================================
// PRICE STATISTICS DISPLAY
// ========================================
function updatePriceStats() {
    const stats = chartData.priceStats;
    document.getElementById('minPrice').textContent = `${stats.min} kr.`;
    document.getElementById('maxPrice').textContent = `${stats.max} kr.`;
    document.getElementById('meanPrice').textContent = `${stats.mean} kr.`;
    document.getElementById('medianPrice').textContent = `${stats.median} kr.`;
}

// ========================================
// CHART 1: CITIES BAR CHART
// Preattentive attribute: Bar length & color saturation
// DARK MODE - Clear bright text
// ========================================
function initCitiesBarChart() {
    const ctx = document.getElementById('citiesChart').getContext('2d');
    
    // Prepare data
    const labels = chartData.cities.map(c => c.By);
    const scores = chartData.cities.map(c => c.Score);
    const maxScore = Math.max(...scores);
    
    // Color gradient based on score performance
    const colors = scores.map(score => {
        const ratio = score / maxScore;
        if (ratio > 0.9) return '#d4a574'; // Gold accent
        if (ratio > 0.7) return '#c9915c';
        if (ratio > 0.5) return '#9d7c5c';
        return '#6c6c6c'; // Gray for lower scores
    });
    
    citiesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
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
                    labels: {
                        font: { size: 13, family: 'Helvetica Neue', weight: 'bold' },
                        color: '#ffffff', // Bright white for legend
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
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: function(context) {
                            return 'Score: ' + context.parsed.y.toFixed(1);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 6,
                    ticks: {
                        color: '#e6edf3', // Bright text
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.15)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#e6edf3', // Bright text for city names
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// CHART 2: CATEGORY RADAR CHART
// Preattentive attribute: Shape & area coverage
// ========================================
function initCategoryRadarChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const labels = Object.keys(chartData.categories);
    const scores = Object.values(chartData.categories);
    
    categoryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gennemsnitlig Kvalitet',
                data: scores,
                borderColor: '#d4a574',
                backgroundColor: 'rgba(212, 165, 116, 0.2)',
                borderWidth: 2.5,
                pointRadius: 6,
                pointBackgroundColor: '#d4a574',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#d4a574'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 13, weight: 'bold' },
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: function(context) {
                            return 'Score: ' + context.parsed.r.toFixed(2) + ' / 6.0';
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 6,
                    ticks: {
                        color: '#e6edf3', // Bright text
                        font: { size: 11, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.2)',
                        drawBorder: true,
                        borderColor: '#d4a574'
                    }
                }
            }
        }
    });
}

// ========================================
// CHART 3: PRICE DISTRIBUTION LINE CHART
// Preattentive attribute: Line height & color intensity
// DARK MODE - Clear bright text
// ========================================
function initPriceDistributionChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const labels = chartData.cities.map(c => c.By);
    const prices = chartData.cities.map(c => c.Pris);
    
    // Color intensity based on price level
    const colors = prices.map(price => {
        if (price > 40) return '#e74c3c'; // Red for expensive
        if (price > 35) return '#d4a574'; // Gold for mid-high
        if (price > 30) return '#9d7c5c'; // Bronze for mid
        return '#6c6c6c'; // Gray for budget-friendly
    });
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
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
                    labels: {
                        font: { size: 13, weight: 'bold' },
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: function(context) {
                            return 'Pris: ' + context.parsed.y.toFixed(1) + ' kr.';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e6edf3', // Bright text
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.15)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#e6edf3', // Bright text for city names
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// CHART 4: BUBBLE CHART - Score vs Price
// Preattentive attribute: Bubble position, size & color
// DARK MODE - Clear bright text
// ========================================
function initBubbleChart() {
    const ctx = document.getElementById('bubbleChart').getContext('2d');
    
    // Prepare bubble data
    const bubbleDatasets = [];
    const colors = ['#d4a574', '#c9915c', '#9d7c5c', '#6c6c6c', '#e74c3c', '#f39c12', '#3498db', '#2ecc71'];
    
    chartData.cities.forEach((city, index) => {
        bubbleDatasets.push({
            label: city.By,
            data: [{
                x: city.Pris,
                y: city.Score,
                r: Math.sqrt(city.Antal) * 8
            }],
            backgroundColor: colors[index % colors.length] + 'b3',
            borderColor: colors[index % colors.length],
            borderWidth: 2
        });
    });
    
    bubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: bubbleDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#e6edf3',
                        padding: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    borderColor: '#d4a574',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#d4a574',
                    bodyColor: '#e6edf3',
                    callbacks: {
                        label: function(context) {
                            const city = context.raw;
                            return `Pris: ${city.x} kr. | Score: ${city.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Pris (kr.)',
                        color: '#ffffff',
                        font: { size: 13, weight: 'bold' }
                    },
                    ticks: {
                        color: '#e6edf3', // Bright text
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.15)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Score',
                        color: '#ffffff',
                        font: { size: 13, weight: 'bold' }
                    },
                    ticks: {
                        color: '#e6edf3', // Bright text
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(212, 165, 116, 0.15)',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// ========================================
// BAKERY GRID RENDERING
// ========================================
function renderBakeryGrid() {
    const bakeryContainer = document.getElementById('bakery-list');
    bakeryContainer.innerHTML = '';
    
    chartData.bakeries.forEach((bakery, index) => {
        const bakeryCard = document.createElement('div');
        bakeryCard.className = 'bakery-card';
        bakeryCard.style.animationDelay = `${index * 50}ms`;
        
        bakeryCard.innerHTML = `
            <div class="bakery-rank">#${index + 1}</div>
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

// ========================================
// SCROLL ANIMATIONS
// Intersection Observer for fade-in on scroll
// ========================================
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
    
    // Observe all major sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// ========================================
// DYNAMIC RESPONSIVENESS
// Recalculate charts on window resize
// ========================================
window.addEventListener('resize', () => {
    if (citiesChart) citiesChart.resize();
    if (categoryChart) categoryChart.resize();
    if (priceChart) priceChart.resize();
    if (bubbleChart) bubbleChart.resize();
});

// ========================================
// PREATTENTIVE ATTRIBUTES IMPLEMENTATION
// Affordance signals through interactivity
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.bakery-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 12px 40px rgba(212, 165, 116, 0.35)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
    });
});

// ========================================
// DATA ANALYSIS HELPER FUNCTIONS
// ========================================
function getHighestScoringCity() {
    return chartData.cities[0];
}

function getCheapestAveragePriceCity() {
    return chartData.cities.reduce((prev, current) => 
        (prev.Pris < current.Pris) ? prev : current
    );
}

function getTopBakery() {
    return chartData.bakeries[0];
}

console.log('✓ Dark Mode activated');
console.log('✓ All text colors optimized for readability');
console.log('✓ Pivot charts initialized with high contrast');
console.log('✓ Preattentive attributes implemented');
