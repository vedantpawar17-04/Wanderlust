(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false);
    });
})();

// Enhanced Flash messages
function closeFlash(element) {
    if (element) {
        // Apply a quicker fadeOut animation when manually closed
        element.style.animation = 'fadeOut 0.3s forwards';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
}

// Initialize flash messages
(() => {
    'use strict'
    // Add behavior for legacy Bootstrap alerts if they exist
    const bootstrapAlerts = document.querySelectorAll('.alert');
    bootstrapAlerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Add sound effect for flash messages if they exist
    const flashMessages = document.querySelectorAll('.flash-message');
    if (flashMessages.length > 0) {
        // Create and play a subtle notification sound
        try {
            const audio = new Audio();
            flashMessages.forEach(message => {
                if (message.classList.contains('success')) {
                    audio.src = '/sounds/success.mp3'; // Make sure this file exists
                } else if (message.classList.contains('error')) {
                    audio.src = '/sounds/error.mp3'; // Make sure this file exists
                }
            });
            
            // Only play if the file exists and can be loaded
            audio.oncanplaythrough = () => {
                audio.volume = 0.3; // Set to 30% volume
                audio.play().catch(e => console.log('Audio play prevented by browser policy'));
            };
            
            audio.onerror = () => {
                console.log('Sound file not found, continuing without sound');
            };
        } catch (e) {
            console.log('Sound playback not supported');
        }
    }
})();

// Review modal functions
function openReviewModal(index) {
    const modal = document.getElementById(`reviewModal${index}`);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeReviewModal(index) {
    const modal = document.getElementById(`reviewModal${index}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Escape key closes any open modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.review-modal[style*="display: flex"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// For review expand functionality
document.addEventListener('DOMContentLoaded', function() {
    const expandButtons = document.querySelectorAll('.review-expand');
    const reviewModal = document.querySelector('.review-modal');
    const modalContent = document.querySelector('.review-modal-content');
    const modalClose = document.querySelector('.review-modal-close');
    
    if (expandButtons.length && reviewModal) {
        expandButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reviewText = this.getAttribute('data-review');
                const reviewAuthor = this.getAttribute('data-author');
                const reviewRating = this.getAttribute('data-rating');
                
                // Set modal content
                modalContent.innerHTML = `
                    <button class="review-modal-close">&times;</button>
                    <h4>${reviewAuthor}</h4>
                    <div class="mb-2">
                        ${generateStars(reviewRating)}
                    </div>
                    <p>${reviewText}</p>
                `;
                
                // Show modal
                reviewModal.style.display = 'flex';
                
                // Add close button event listener
                document.querySelector('.review-modal-close').addEventListener('click', function() {
                    reviewModal.style.display = 'none';
                });
            });
        });
        
        // Close modal when clicking outside the content
        reviewModal.addEventListener('click', function(e) {
            if (e.target === reviewModal) {
                reviewModal.style.display = 'none';
            }
        });
    }
    
    // Helper function to generate stars HTML
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHTML += '<i class="fa-solid fa-star text-warning"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star text-warning"></i>';
            }
        }
        return starsHTML;
    }
});

// Loading indicators for forms and links
(() => {
    // Loading overlay element
    const createLoadingOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-border" role="status" style="color: var(--secondary-color);">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-light">Loading...</p>
            </div>
        `;
        
        // Add styles inline to ensure they're applied
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .loading-overlay.show {
                opacity: 1;
                pointer-events: auto;
            }
            .spinner-container {
                text-align: center;
                background-color: rgba(0, 0, 0, 0.7);
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .spinner-border {
                width: 3rem;
                height: 3rem;
            }
        `;
        document.head.appendChild(style);
        
        return overlay;
    };
    
    // Append overlay to body if it doesn't exist
    let loadingOverlay = document.querySelector('.loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = createLoadingOverlay();
        document.body.appendChild(loadingOverlay);
    }
    
    // Show loading on form submissions
    const forms = document.querySelectorAll('form:not(.no-loading)');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Don't show loading for forms that validate and fail
            if (form.classList.contains('needs-validation') && !form.checkValidity()) {
                return;
            }
            
            // Don't show for search forms
            if (form.getAttribute('action') && form.getAttribute('action').includes('search')) {
                return;
            }
            
            loadingOverlay.classList.add('show');
            
            // Safety timeout to ensure overlay is removed even if navigation fails
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, 8000);
        });
    });
    
    // Show loading on certain links (create, edit, etc.)
    const actionLinks = document.querySelectorAll('a[href*="/new"], a[href*="/edit"], a:not([href^="#"]):not([href*="javascript"]):not(.no-loading)');
    actionLinks.forEach(link => {
        // Skip links that are part of the navbar or pagination
        if (link.closest('.navbar') || link.closest('.pagination')) {
            return;
        }
        
        link.addEventListener('click', function(e) {
            loadingOverlay.classList.add('show');
            
            // Safety timeout to ensure overlay is removed even if navigation fails
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, 8000);
        });
    });
    
    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', function() {
        loadingOverlay.classList.remove('show');
    });
    
    // Additional safety measure - hide overlay on any user interaction after 2 seconds
    document.addEventListener('click', function() {
        setTimeout(() => {
            loadingOverlay.classList.remove('show');
        }, 2000);
    });
})();