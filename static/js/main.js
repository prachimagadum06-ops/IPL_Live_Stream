/**
 * IPL Live Streaming Platform - Main JavaScript
 * Core functionality and utilities for the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Add smooth scrolling for anchor links
    initializeSmoothScroll();
    
    // Initialize fixed header behavior
    initializeFixedHeader();
    
    // Add team card hover effects
    initializeTeamCards();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize fixed header behavior
 */
function initializeFixedHeader() {
    const header = document.querySelector('.navbar');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('navbar-shrink');
        } else {
            header.classList.remove('navbar-shrink');
        }
    });
}

/**
 * Initialize team card hover effects
 */
function initializeTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('shadow-lg');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('shadow-lg');
        });
    });
}

/**
 * Format date object to readable string
 * @param {Date} date - Date object to format
 * @param {Object} options - Formatting options
 * @returns {String} Formatted date string
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    return new Date(date).toLocaleDateString('en-US', formatOptions);
}

/**
 * Get team code and color based on team name
 * @param {String} teamName - Full team name
 * @returns {Object} Team code and color
 */
function getTeamInfo(teamName) {
    if (!teamName) return { code: 'UNK', color: '#6c757d' };
    
    const teamMap = {
        'Mumbai Indians': { code: 'MI', color: '#004BA0' },
        'Chennai Super Kings': { code: 'CSK', color: '#FFCC00' },
        'Royal Challengers Bangalore': { code: 'RCB', color: '#C70039' },
        'Kolkata Knight Riders': { code: 'KKR', color: '#3A225D' },
        'Sunrisers Hyderabad': { code: 'SRH', color: '#FF9933' },
        'Delhi Capitals': { code: 'DC', color: '#0078BC' },
        'Punjab Kings': { code: 'PBKS', color: '#A71930' },
        'Rajasthan Royals': { code: 'RR', color: '#EA1A85' },
        'Gujarat Titans': { code: 'GT', color: '#1E8449' },
        'Lucknow Super Giants': { code: 'LSG', color: '#5ECDFA' }
    };
    
    // Check for exact match
    if (teamMap[teamName]) {
        return teamMap[teamName];
    }
    
    // Check if team name includes any of the known teams
    for (const key in teamMap) {
        if (teamName.includes(key)) {
            return teamMap[key];
        }
    }
    
    // Extract abbreviated team code from name
    const words = teamName.split(' ');
    let code = '';
    
    if (words.length === 1) {
        code = words[0].substring(0, 3).toUpperCase();
    } else {
        words.forEach(word => {
            if (word.length > 0) {
                code += word[0];
            }
        });
    }
    
    return { code: code, color: '#6c757d' };
}

/**
 * Update team logo with SVG image
 * @param {String} elementId - ID of the element to update
 * @param {String} teamName - Team name or code
 */
function updateTeamLogo(elementId, teamName) {
    const logoElement = document.getElementById(elementId);
    if (!logoElement) return;
    
    // Clear existing content
    logoElement.innerHTML = '';
    
    if (teamName) {
        // Get team info
        const teamInfo = getTeamInfo(teamName);
        const teamCode = teamInfo.code;
        
        // Create img element for SVG logo
        const logoImg = document.createElement('img');
        logoImg.src = `/static/logos/${teamCode}.svg`;
        logoImg.alt = teamName;
        logoImg.className = 'team-logo-img';
        
        // Add team-specific class for color
        logoElement.className = 'team-logo mb-2 bg-' + teamCode.toLowerCase();
        logoElement.appendChild(logoImg);
    } else {
        // Default icon if team code is not available
        logoElement.innerHTML = '<i class="fas fa-shield-alt fa-3x"></i>';
    }
}

/**
 * Show loading spinner in a container
 * @param {String} containerId - Container element ID
 * @param {String} message - Optional loading message
 */
function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">${message}</p>
        </div>
    `;
}

/**
 * Show error message in a container
 * @param {String} containerId - Container element ID
 * @param {String} message - Error message
 */
function showError(containerId, message = 'Failed to load data. Please try again later.') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
            <h5>Error</h5>
            <p>${message}</p>
            <button class="btn btn-sm btn-outline-primary mt-2" onclick="window.location.reload()">
                <i class="fas fa-sync me-1"></i>Retry
            </button>
        </div>
    `;
}

/**
 * Show empty state in a container
 * @param {String} containerId - Container element ID
 * @param {String} message - Empty state message
 * @param {String} icon - FontAwesome icon class
 */
function showEmptyState(containerId, message = 'No data available', icon = 'fa-info-circle') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas ${icon} fa-3x text-muted mb-3"></i>
            <h5>${message}</h5>
        </div>
    `;
}

/**
 * Format overs notation (e.g., convert 4.3 to 4.3 overs) 
 * @param {String|Number} overs - Overs value
 * @returns {String} Formatted overs string
 */
function formatOvers(overs) {
    if (!overs || overs === '') return 'N/A';
    
    const oversNum = parseFloat(overs);
    if (isNaN(oversNum)) return overs;
    
    const fullOvers = Math.floor(oversNum);
    const balls = Math.round((oversNum - fullOvers) * 10);
    
    if (balls === 0) {
        return `${fullOvers} ${fullOvers === 1 ? 'over' : 'overs'}`;
    } else {
        return `${fullOvers}.${balls} ${fullOvers === 1 && balls === 0 ? 'over' : 'overs'}`;
    }
}

/**
 * Handle API fetch errors with consistent error handling
 * @param {String} endpoint - API endpoint being called
 * @param {Error} error - Error object
 * @returns {Object} Standardized error response
 */
function handleApiError(endpoint, error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return {
        status_code: 500,
        error: `Failed to fetch data from ${endpoint}`,
        message: error.message
    };
}

/**
 * Refresh data at specified intervals
 * @param {Function} fetchFunction - Function to call for data refresh
 * @param {Number} intervalMs - Refresh interval in milliseconds
 * @returns {Number} Interval ID for clearing if needed
 */
function setupDataRefresh(fetchFunction, intervalMs = 30000) {
    // Initial fetch
    fetchFunction();
    
    // Setup interval
    return setInterval(fetchFunction, intervalMs);
}

/**
 * Display a notification toast
 * @param {String} message - Notification message
 * @param {String} type - Bootstrap alert type (success, danger, warning, info)
 */
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast bg-${type} text-white`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header bg-${type} text-white">
            <strong class="me-auto">IPL Live</strong>
            <small>Just now</small>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}
