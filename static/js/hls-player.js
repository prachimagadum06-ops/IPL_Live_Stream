/**
 * IPL Live Streaming Platform - HLS Player Module
 * This module handles the initialization and management of the HLS video player
 * for streaming M3U8/HLS content.
 */

// Player instance and state
let videoPlayer = null;
let playerReady = false;
let currentStreamUrl = '';

/**
 * Initialize the HLS player with the given stream URL
 * @param {String} streamUrl - URL to the M3U8/HLS stream
 */
function initializePlayer(streamUrl) {
    const videoElement = document.getElementById('video-player');
    
    if (!videoElement) {
        console.error('Video player element not found');
        return;
    }
    
    // Skip if URL is empty or invalid
    if (!streamUrl || streamUrl === '') {
        showStreamPlaceholder();
        return;
    }
    
    currentStreamUrl = streamUrl;
    
    // Show loading state
    document.getElementById('video-loading').classList.remove('d-none');
    document.getElementById('video-error').classList.add('d-none');
    document.getElementById('stream-placeholder').classList.add('d-none');
    
    // Reset video element
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load();
    
    // Play regular video files directly; use HLS.js only for HLS streams.
    if (!streamUrl.toLowerCase().includes('.m3u8')) {
        videoElement.src = streamUrl;
        videoElement.addEventListener('loadedmetadata', function() {
            playerReady = true;
            videoElement.play().catch(error => {
                console.warn('Auto-play failed:', error);
                showPlayButtonOverlay();
            });
            document.getElementById('video-loading').classList.add('d-none');
        }, { once: true });
        videoElement.addEventListener('error', function() {
            console.error('Video error:', videoElement.error);
            showStreamError();
        }, { once: true });
        setupVideoElementListeners(videoElement);
        videoElement.load();
        return;
    }

    // Check if HLS.js is supported
    if (Hls.isSupported()) {
        // Destroy existing HLS instance if any
        if (videoPlayer && typeof videoPlayer.destroy === 'function') {
            videoPlayer.destroy();
            videoPlayer = null;
        }
        
        // Create new HLS instance
        videoPlayer = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        // Bind HLS to video element
        videoPlayer.attachMedia(videoElement);
        
        // Handle events
        videoPlayer.on(Hls.Events.MEDIA_ATTACHED, function() {
            console.log('HLS: Media attached');
            videoPlayer.loadSource(streamUrl);
        });
        
        videoPlayer.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
            console.log('HLS: Manifest parsed, levels: ' + data.levels.length);
            // Start playback
            playerReady = true;
            videoElement.play().catch(error => {
                console.warn('Auto-play failed:', error);
                // Show play button overlay
                showPlayButtonOverlay();
            });
            
            // Hide loading indicator
            document.getElementById('video-loading').classList.add('d-none');
        });
        
        // Error handling
        videoPlayer.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                console.error('HLS error:', data);
                
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // Try to recover network error
                        console.log('HLS: Fatal network error, trying to recover');
                        videoPlayer.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        // Try to recover media error
                        console.log('HLS: Fatal media error, trying to recover');
                        videoPlayer.recoverMediaError();
                        break;
                    default:
                        // Cannot recover
                        console.log('HLS: Fatal error, cannot recover');
                        showStreamError();
                        break;
                }
            } else {
                // Non-fatal error, just log it
                console.warn('HLS non-fatal error:', data);
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // HLS is natively supported on Safari
        videoElement.src = streamUrl;
        
        videoElement.addEventListener('loadedmetadata', function() {
            playerReady = true;
            videoElement.play().catch(error => {
                console.warn('Auto-play failed:', error);
                showPlayButtonOverlay();
            });
            
            document.getElementById('video-loading').classList.add('d-none');
        });
        
        videoElement.addEventListener('error', function() {
            console.error('Video error:', videoElement.error);
            showStreamError();
        });
    } else {
        // HLS not supported at all
        console.error('HLS playback not supported in this browser');
        showBrowserNotSupportedError();
    }
    
    // Add event listeners for the video element
    setupVideoElementListeners(videoElement);
}

/**
 * Set up event listeners for the video element
 * @param {HTMLVideoElement} videoElement - The video element
 */
function setupVideoElementListeners(videoElement) {
    // Handle play/pause toggle
    videoElement.addEventListener('play', function() {
        // Hide play button overlay if visible
        const playButton = document.querySelector('.play-button-overlay');
        if (playButton) {
            playButton.classList.add('d-none');
        }
    });
    
    // Handle error event
    videoElement.addEventListener('error', function() {
        if (videoElement.error) {
            console.error('Video error:', videoElement.error.message);
            showStreamError();
        }
    });
    
    // Handle waiting/buffering state
    videoElement.addEventListener('waiting', function() {
        // Show buffering indicator
        const bufferingIndicator = document.querySelector('.buffering-indicator') || createBufferingIndicator();
        bufferingIndicator.classList.remove('d-none');
    });
    
    // Handle playing state (after buffering)
    videoElement.addEventListener('playing', function() {
        // Hide buffering indicator
        const bufferingIndicator = document.querySelector('.buffering-indicator');
        if (bufferingIndicator) {
            bufferingIndicator.classList.add('d-none');
        }
    });
}

/**
 * Create and display a play button overlay when autoplay fails
 */
function showPlayButtonOverlay() {
    const streamContainer = document.querySelector('.stream-container');
    if (!streamContainer) return;
    
    let playButtonOverlay = document.querySelector('.play-button-overlay');
    
    if (!playButtonOverlay) {
        playButtonOverlay = document.createElement('div');
        playButtonOverlay.className = 'play-button-overlay';
        playButtonOverlay.innerHTML = `
            <button class="play-button">
                <i class="fas fa-play-circle fa-4x"></i>
            </button>
        `;
        
        streamContainer.appendChild(playButtonOverlay);
        
        // Add click handler
        playButtonOverlay.addEventListener('click', function() {
            const videoElement = document.getElementById('video-player');
            if (videoElement) {
                videoElement.play().catch(error => {
                    console.error('Play failed after click:', error);
                });
            }
            playButtonOverlay.classList.add('d-none');
        });
        
        // Style the overlay
        const style = document.createElement('style');
        style.textContent = `
            .play-button-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            
            .play-button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .play-button:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    } else {
        playButtonOverlay.classList.remove('d-none');
    }
}

/**
 * Create and return a buffering indicator
 * @returns {HTMLElement} Buffering indicator element
 */
function createBufferingIndicator() {
    const streamContainer = document.querySelector('.stream-container');
    if (!streamContainer) return null;
    
    const bufferingIndicator = document.createElement('div');
    bufferingIndicator.className = 'buffering-indicator d-none';
    bufferingIndicator.innerHTML = `
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Buffering...</span>
        </div>
    `;
    
    streamContainer.appendChild(bufferingIndicator);
    
    // Style the indicator
    const style = document.createElement('style');
    style.textContent = `
        .buffering-indicator {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 5;
        }
    `;
    document.head.appendChild(style);
    
    return bufferingIndicator;
}

/**
 * Show error state when stream fails to load
 */
function showStreamError() {
    document.getElementById('video-loading').classList.add('d-none');
    document.getElementById('stream-placeholder').classList.add('d-none');
    document.getElementById('video-error').classList.remove('d-none');
}

/**
 * Show browser not supported error
 */
function showBrowserNotSupportedError() {
    const errorElement = document.getElementById('video-error');
    
    if (errorElement) {
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
            <h5>Browser Not Supported</h5>
            <p>Your browser does not support HLS streaming. Please try Chrome, Firefox, Safari, or Edge.</p>
        `;
        
        document.getElementById('video-loading').classList.add('d-none');
        document.getElementById('stream-placeholder').classList.add('d-none');
        errorElement.classList.remove('d-none');
    }
}

/**
 * Show placeholder when no stream is available
 */
function showStreamPlaceholder() {
    document.getElementById('video-loading').classList.add('d-none');
    document.getElementById('video-error').classList.add('d-none');
    document.getElementById('stream-placeholder').classList.remove('d-none');
}

/**
 * Get the current stream URL
 * @returns {String} Current stream URL
 */
function getCurrentStreamUrl() {
    return currentStreamUrl;
}

/**
 * Set a new stream URL and reload the player
 * @param {String} newUrl - New stream URL
 */
function changeStream(newUrl) {
    if (newUrl !== currentStreamUrl) {
        initializePlayer(newUrl);
    }
}

/**
 * Stop and destroy the player
 */
function destroyPlayer() {
    if (videoPlayer && typeof videoPlayer.destroy === 'function') {
        videoPlayer.destroy();
        videoPlayer = null;
    }
    
    const videoElement = document.getElementById('video-player');
    if (videoElement) {
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();
    }
    
    playerReady = false;
    currentStreamUrl = '';
}

/**
 * Check if the player is ready
 * @returns {Boolean} True if player is ready
 */
function isPlayerReady() {
    return playerReady;
}

/**
 * Toggle fullscreen mode for the player
 */
function toggleFullscreen() {
    const streamContainer = document.querySelector('.stream-container');
    if (!streamContainer) return;
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        streamContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    }
}

/**
 * Toggle mute state for the player
 */
function toggleMute() {
    const videoElement = document.getElementById('video-player');
    if (!videoElement) return;
    
    videoElement.muted = !videoElement.muted;
    
    // Update mute button if exists
    const muteButton = document.getElementById('mute-toggle');
    if (muteButton) {
        const muteIcon = muteButton.querySelector('i');
        if (muteIcon) {
            muteIcon.className = videoElement.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }
}
