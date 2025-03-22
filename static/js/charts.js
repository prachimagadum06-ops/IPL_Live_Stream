/**
 * IPL Live Streaming Platform - Charts Module
 * This module provides functions for creating and updating various charts
 * using Chart.js for data visualization.
 */

/**
 * Create a points chart for teams
 * @param {String} elementId - Canvas element ID
 * @param {Array} teams - Array of team names/codes
 * @param {Array} points - Array of points values
 * @param {Object} options - Optional chart configuration
 */
function createPointsChart(elementId, teams, points, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    // Generate team colors
    const colors = teams.map(team => getTeamColor(team));
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const idx = tooltipItems[0].dataIndex;
                        return teams[idx];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Points'
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Teams'
                }
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [{
                label: 'Points',
                data: points,
                backgroundColor: colors,
                borderColor: colors.map(color => darkenColor(color, 20)),
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}

/**
 * Create a win/loss chart for teams
 * @param {String} elementId - Canvas element ID
 * @param {Array} teams - Array of team names/codes
 * @param {Array} wins - Array of wins values
 * @param {Array} losses - Array of losses values
 * @param {Object} options - Optional chart configuration
 */
function createWinLossChart(elementId, teams, wins, losses, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const idx = tooltipItems[0].dataIndex;
                        return teams[idx];
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Matches'
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Teams'
                }
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [
                {
                    label: 'Wins',
                    data: wins,
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgb(40, 167, 69)',
                    borderWidth: 1
                },
                {
                    label: 'Losses',
                    data: losses,
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgb(220, 53, 69)',
                    borderWidth: 1
                }
            ]
        },
        options: chartOptions
    });
}

/**
 * Create a doughnut chart for title distribution
 * @param {String} elementId - Canvas element ID
 * @param {Array} teams - Array of team names
 * @param {Array} titles - Array of title counts
 * @param {Object} options - Optional chart configuration
 */
function createTitleChart(elementId, teams, titles, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    // Generate team codes and colors
    const teamCodes = teams.map(team => getTeamCode(team));
    const colors = teamCodes.map(code => getTeamColor(code));
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} title${value !== 1 ? 's' : ''}`;
                    }
                }
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: teams,
            datasets: [{
                data: titles,
                backgroundColor: colors,
                borderColor: colors.map(color => darkenColor(color, 20)),
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}

/**
 * Create a line chart for run rate comparison
 * @param {String} elementId - Canvas element ID
 * @param {Array} overs - Array of overs values
 * @param {Array} currentRR - Array of current run rate values
 * @param {Array} requiredRR - Array of required run rate values
 * @param {Object} options - Optional chart configuration
 */
function createRunRateChart(elementId, overs, currentRR, requiredRR, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Run Rate'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Overs'
                }
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: overs,
            datasets: [
                {
                    label: 'Current RR',
                    data: currentRR,
                    backgroundColor: 'rgba(40, 167, 69, 0.3)',
                    borderColor: 'rgb(40, 167, 69)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Required RR',
                    data: requiredRR,
                    backgroundColor: 'rgba(220, 53, 69, 0.3)',
                    borderColor: 'rgb(220, 53, 69)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: chartOptions
    });
}

/**
 * Create a radar chart for team performance
 * @param {String} elementId - Canvas element ID
 * @param {Array} categories - Array of performance categories
 * @param {Array} values - Array of performance values
 * @param {String} teamCode - Team code for color
 * @param {Object} options - Optional chart configuration
 */
function createTeamPerformanceRadar(elementId, categories, values, teamCode, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    const teamColor = getTeamColor(teamCode);
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 2
                }
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: teamCode,
                data: values,
                backgroundColor: adjustColor(teamColor, 0.5),
                borderColor: teamColor,
                borderWidth: 2,
                pointBackgroundColor: teamColor,
                pointRadius: 4
            }]
        },
        options: chartOptions
    });
}

/**
 * Update an existing chart with new data
 * @param {Chart} chart - Chart.js instance
 * @param {Array} labels - New labels
 * @param {Array} datasets - New datasets
 */
function updateChart(chart, labels, datasets) {
    if (!chart) return;
    
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
}

/**
 * Get color for a team based on team code
 * @param {String} teamCode - Team code/abbreviation
 * @returns {String} RGBA color string
 */
function getTeamColor(teamCode) {
    const colorMap = {
        'MI': 'rgba(0, 102, 204, 0.7)',
        'CSK': 'rgba(255, 204, 0, 0.7)',
        'RCB': 'rgba(204, 0, 0, 0.7)',
        'KKR': 'rgba(102, 0, 153, 0.7)',
        'SRH': 'rgba(255, 153, 0, 0.7)',
        'DC': 'rgba(0, 153, 204, 0.7)',
        'PBKS': 'rgba(204, 51, 153, 0.7)',
        'RR': 'rgba(255, 102, 178, 0.7)',
        'GT': 'rgba(0, 153, 51, 0.7)',
        'LSG': 'rgba(0, 204, 153, 0.7)',
        'RPS': 'rgba(102, 102, 153, 0.7)',
        'KTK': 'rgba(255, 153, 204, 0.7)',
        'PWI': 'rgba(153, 0, 76, 0.7)'
    };
    
    return colorMap[teamCode] || 'rgba(108, 117, 125, 0.7)';
}

/**
 * Darken a color by a specified percentage
 * @param {String} color - RGBA color string
 * @param {Number} percent - Amount to darken (0-255)
 * @returns {String} Darkened RGBA color string
 */
function darkenColor(color, percent) {
    // Simple function to darken a rgba color
    if (color.startsWith('rgba(')) {
        const values = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (values) {
            const r = Math.max(0, parseInt(values[1]) - percent);
            const g = Math.max(0, parseInt(values[2]) - percent);
            const b = Math.max(0, parseInt(values[3]) - percent);
            const a = parseFloat(values[4]);
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
    }
    return color;
}

/**
 * Adjust color opacity
 * @param {String} color - RGBA color string
 * @param {Number} opacity - New opacity value (0-1)
 * @returns {String} Adjusted RGBA color string
 */
function adjustColor(color, opacity) {
    if (color.startsWith('rgba(')) {
        const values = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (values) {
            return `rgba(${values[1]}, ${values[2]}, ${values[3]}, ${opacity})`;
        }
    }
    return color;
}

/**
 * Extract team code from team name
 * @param {String} teamName - Full team name
 * @returns {String} Team code/abbreviation
 */
function getTeamCode(teamName) {
    if (!teamName) return 'UNK';
    
    const teamMap = {
        'Mumbai Indians': 'MI',
        'Chennai Super Kings': 'CSK',
        'Kolkata Knight Riders': 'KKR',
        'Royal Challengers Bangalore': 'RCB',
        'Delhi Capitals': 'DC',
        'Delhi Daredevils': 'DC',
        'Sunrisers Hyderabad': 'SRH',
        'Rajasthan Royals': 'RR',
        'Kings XI Punjab': 'PBKS',
        'Punjab Kings': 'PBKS',
        'Deccan Chargers': 'DC',
        'Gujarat Titans': 'GT',
        'Lucknow Super Giants': 'LSG',
        'Rising Pune Supergiant': 'RPS',
        'Kochi Tuskers Kerala': 'KTK',
        'Pune Warriors India': 'PWI'
    };
    
    // Try to find the team code
    for (const key in teamMap) {
        if (teamName.includes(key)) {
            return teamMap[key];
        }
    }
    
    // If not found, return first 3 letters
    return teamName.substring(0, 3).toUpperCase();
}

/**
 * Create a horizontal bar chart
 * @param {String} elementId - Canvas element ID
 * @param {Array} labels - Array of labels
 * @param {Array} values - Array of values
 * @param {String} label - Dataset label
 * @param {String} color - Color for bars
 * @param {Object} options - Optional chart configuration
 */
function createHorizontalBarChart(elementId, labels, values, label, color = 'rgba(0, 123, 255, 0.7)', options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                beginAtZero: true
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                backgroundColor: color,
                borderColor: darkenColor(color, 20),
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}

/**
 * Create a pie chart
 * @param {String} elementId - Canvas element ID
 * @param {Array} labels - Array of labels
 * @param {Array} values - Array of values
 * @param {Array} colors - Array of colors
 * @param {Object} options - Optional chart configuration
 */
function createPieChart(elementId, labels, values, colors, options = {}) {
    const ctx = document.getElementById(elementId)?.getContext('2d');
    if (!ctx) return null;
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        },
        ...options
    };
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(color => darkenColor(color, 20)),
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}
