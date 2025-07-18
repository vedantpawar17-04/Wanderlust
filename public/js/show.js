// Show page functionality

// Handle rating selection in the review form
document.addEventListener('DOMContentLoaded', function() {
    // Handle star rating in the review form
    const ratingBtns = document.querySelectorAll('.rating-btn');
    const ratingInputs = document.querySelectorAll('input[name="review[rating]"]');

    ratingBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Reset all buttons
            ratingBtns.forEach(b => b.classList.remove('active'));
            // Activate buttons up to the clicked one
            for (let i = 0; i <= index; i++) {
                ratingBtns[i].classList.add('active');
            }
            // Set the radio input value
            ratingInputs[index].checked = true;
        });
    });

    // Ensure owner action buttons are clickable
    const ownerActionButtons = document.querySelectorAll('.owner-actions .btn');
    ownerActionButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.addEventListener('click', function(e) {
            // Make sure the event propagates
            e.stopPropagation = false;
        });
    });
    
    // Ensure form buttons in the owner actions area work properly
    const actionForms = document.querySelectorAll('.owner-actions form');
    actionForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Confirm before deleting
            if (form.action.includes('DELETE')) {
                if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    });
});

// Form validation
const reviewForm = document.querySelector('.review-form form');
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        const ratingSelected = reviewForm.querySelector('input[name="review[rating]"]:checked');
        const reviewText = reviewForm.querySelector('textarea[name="review[comment]"]').value.trim();

        if (!ratingSelected || !reviewText) {
            e.preventDefault();
            alert('Please provide both a rating and a review.');
        }
    });
}

// Delete review confirmation
document.querySelectorAll('.delete-review-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            e.preventDefault();
        }
    });
}); 