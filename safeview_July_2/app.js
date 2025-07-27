// Presentation navigation functionality
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 11;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        // Set initial values
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add event listeners with proper binding
        this.setupNavigationButtons();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Initialize slide visibility
        this.showSlide(this.currentSlide);
        
        // Debug logging
        console.log('PresentationController initialized');
        console.log('Previous button:', this.prevBtn);
        console.log('Next button:', this.nextBtn);
        console.log('Total slides found:', this.slides.length);
    }
    
    setupNavigationButtons() {
        // Previous button
        if (this.prevBtn) {
            // Remove any existing event listeners
            this.prevBtn.replaceWith(this.prevBtn.cloneNode(true));
            this.prevBtn = document.getElementById('prevBtn');
            
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSlide();
            });
            
            this.prevBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            // Remove any existing event listeners
            this.nextBtn.replaceWith(this.nextBtn.cloneNode(true));
            this.nextBtn = document.getElementById('nextBtn');
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextSlide();
            });
            
            this.nextBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        }
    }
    
    showSlide(slideNumber) {
        console.log(`Showing slide ${slideNumber}`);
        
        // Validate slide number
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log(`Invalid slide number: ${slideNumber}`);
            return;
        }
        
        // Hide all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'entering');
            if (index + 1 === slideNumber) {
                slide.classList.add('active', 'entering');
                // Remove entering class after animation
                setTimeout(() => {
                    slide.classList.remove('entering');
                }, 250);
            }
        });
        
        this.currentSlide = slideNumber;
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Announce slide change for screen readers
        this.announceSlideChange();
    }
    
    nextSlide() {
        console.log('Next slide called, current:', this.currentSlide);
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        } else {
            console.log('Already at last slide');
        }
    }
    
    previousSlide() {
        console.log('Previous slide called, current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        } else {
            console.log('Already at first slide');
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.showSlide(slideNumber);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevBtn) {
            const isDisabled = this.currentSlide === 1;
            this.prevBtn.disabled = isDisabled;
            this.prevBtn.style.opacity = isDisabled ? '0.5' : '1';
            this.prevBtn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        }
        
        // Update next button
        if (this.nextBtn) {
            const isDisabled = this.currentSlide === this.totalSlides;
            this.nextBtn.disabled = isDisabled;
            this.nextBtn.style.opacity = isDisabled ? '0.5' : '1';
            this.nextBtn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        }
    }
    
    handleKeydown(event) {
        // Don't handle keyboard events when help overlay is open
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay && !helpOverlay.classList.contains('hidden')) {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.hideHelpOverlay();
            }
            return;
        }
        
        switch(event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case '?':
            case 'h':
            case 'H':
                event.preventDefault();
                this.toggleHelpOverlay();
                break;
        }
        
        // Number key shortcuts (1-9, then 0 for slide 10, then 1 then 1 for slide 11)
        if (event.key >= '1' && event.key <= '9') {
            const slideNum = parseInt(event.key);
            if (slideNum <= this.totalSlides) {
                event.preventDefault();
                this.goToSlide(slideNum);
            }
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const presentationContainer = document.querySelector('.presentation-container');
        
        if (presentationContainer) {
            presentationContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            presentationContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                this.handleSwipe();
            }, { passive: true });
        }
        
        const handleSwipe = () => {
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const minSwipeDistance = 50;
            
            // Check if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    announceSlideChange() {
        // Create or update aria-live region for screen readers
        let liveRegion = document.getElementById('slide-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcer';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        
        const slideTitle = this.slides[this.currentSlide - 1].querySelector('h1')?.textContent || `Slide ${this.currentSlide}`;
        liveRegion.textContent = `${slideTitle}, slide ${this.currentSlide} of ${this.totalSlides}`;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.log(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    }
    
    toggleHelpOverlay() {
        let helpOverlay = document.getElementById('help-overlay');
        if (!helpOverlay) {
            helpOverlay = this.createHelpOverlay();
        }
        helpOverlay.classList.toggle('hidden');
    }
    
    hideHelpOverlay() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.add('hidden');
        }
    }
    
    createHelpOverlay() {
        const helpOverlay = document.createElement('div');
        helpOverlay.className = 'help-overlay hidden';
        helpOverlay.id = 'help-overlay';
        
        helpOverlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h2>Keyboard Shortcuts</h2>
                    <button class="close-help" aria-label="Close help">×</button>
                </div>
                <div class="help-shortcuts">
                    <div class="shortcut-group">
                        <h3>Navigation</h3>
                        <div class="shortcut-item">
                            <div>
                                <kbd>→</kbd> <kbd>Space</kbd> <kbd>Page Down</kbd>
                            </div>
                            <span>Next slide</span>
                        </div>
                        <div class="shortcut-item">
                            <div>
                                <kbd>←</kbd> <kbd>Page Up</kbd>
                            </div>
                            <span>Previous slide</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Home</kbd>
                            <span>First slide</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>End</kbd>
                            <span>Last slide</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>1-9</kbd>
                            <span>Go to slide number</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h3>Presentation</h3>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Toggle fullscreen</span>
                        </div>
                        <div class="shortcut-item">
                            <div>
                                <kbd>?</kbd> <kbd>H</kbd>
                            </div>
                            <span>Show/hide help</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpOverlay);
        
        // Add event listeners
        const closeBtn = helpOverlay.querySelector('.close-help');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideHelpOverlay();
            });
        }
        
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                this.hideHelpOverlay();
            }
        });
        
        return helpOverlay;
    }
    
    // Method to get slide titles for potential slide overview
    getSlideOverview() {
        return Array.from(this.slides).map((slide, index) => {
            const title = slide.querySelector('h1')?.textContent || `Slide ${index + 1}`;
            return {
                number: index + 1,
                title: title,
                element: slide
            };
        });
    }
}

// Additional utility functions
class PresentationUtils {
    static addSlideProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'slide-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        return progressBar;
    }
    
    static updateProgress(currentSlide, totalSlides) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = (currentSlide / totalSlides) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    static addSlideTimer() {
        const timer = document.createElement('div');
        timer.className = 'slide-timer';
        timer.id = 'slide-timer';
        document.body.appendChild(timer);
        
        return timer;
    }
    
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Enhanced presentation controller with additional features
class EnhancedPresentationController extends PresentationController {
    constructor() {
        super();
        this.slideStartTime = Date.now();
        this.slideTimings = [];
        this.totalPresentationTime = 0;
        
        this.addProgressBar();
        this.addSlideTimer();
    }
    
    showSlide(slideNumber) {
        // Record timing for previous slide
        if (this.currentSlide && this.slideStartTime) {
            const slideTime = Date.now() - this.slideStartTime;
            this.slideTimings[this.currentSlide - 1] = slideTime;
        }
        
        super.showSlide(slideNumber);
        
        // Update progress bar
        PresentationUtils.updateProgress(this.currentSlide, this.totalSlides);
        
        // Reset slide timer
        this.slideStartTime = Date.now();
    }
    
    addProgressBar() {
        const progressBar = PresentationUtils.addSlideProgress();
        PresentationUtils.updateProgress(this.currentSlide, this.totalSlides);
    }
    
    addSlideTimer() {
        const timer = PresentationUtils.addSlideTimer();
        this.updateTimer();
        
        // Update timer every second
        setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const timer = document.getElementById('slide-timer');
        if (timer && this.slideStartTime) {
            const currentSlideTime = Math.floor((Date.now() - this.slideStartTime) / 1000);
            const totalTime = Math.floor(this.totalPresentationTime / 1000) + currentSlideTime;
            timer.textContent = `Slide: ${PresentationUtils.formatTime(currentSlideTime)} | Total: ${PresentationUtils.formatTime(totalTime)}`;
        }
    }
    
    getTotalTime() {
        const currentSlideTime = this.slideStartTime ? Date.now() - this.slideStartTime : 0;
        return this.slideTimings.reduce((total, time) => total + (time || 0), 0) + currentSlideTime;
    }
    
    getSlideStatistics() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            slideTimings: this.slideTimings,
            totalTime: this.getTotalTime(),
            averageSlideTime: this.slideTimings.length > 0 
                ? this.slideTimings.reduce((sum, time) => sum + (time || 0), 0) / this.slideTimings.length 
                : 0
        };
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Wait a moment for all elements to be ready
    setTimeout(() => {
        // Check if enhanced features are needed
        const useEnhancedFeatures = window.location.search.includes('enhanced=true');
        
        if (useEnhancedFeatures) {
            window.presentation = new EnhancedPresentationController();
        } else {
            window.presentation = new PresentationController();
        }
        
        console.log('Presentation initialized successfully');
        console.log('Total slides:', window.presentation.totalSlides);
        
        // Add click event listeners as backup
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Previous button onclick triggered');
                if (window.presentation) {
                    window.presentation.previousSlide();
                }
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Next button onclick triggered');
                if (window.presentation) {
                    window.presentation.nextSlide();
                }
            };
        }
        
    }, 100);
});

// Export for potential external usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PresentationController,
        EnhancedPresentationController,
        PresentationUtils
    };
}