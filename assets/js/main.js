const mobileToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');
if(mobileToggle){
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if(sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
            sidebar.classList.remove('active');
        }
    });
}

// Navigation logic
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-links li').forEach(nav => nav.classList.remove('active'));
        // Add active to clicked item
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Show target section
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            targetSection.classList.add('active-section');
        }
        
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        // Close sidebar on mobile if open
        if(window.innerWidth <= 900) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});

// Modal Logic
function showPremiumModal() {
    const modal = document.getElementById('premium-modal');
    if(modal) modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hidePremiumModal() {
    const modal = document.getElementById('premium-modal');
    if(modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function initiatePayment(planName, price) {
    // For a complete beginner: This is where you would link to Stripe or PayPal.
    // For now, we will demonstrate the intent.
    const confirmPayment = confirm(`Redirecting to secure payment gateway for ${planName} ($${price}/mo). Proceed?`);
    if(confirmPayment) {
        alert("In a real application, you would now be redirected to Stripe Checkout or PayPal. \n\nCheck the guide provided by your assistant for the next steps!");
        // Example: window.location.href = "https://buy.stripe.com/your-payment-link";
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('premium-modal');
    if (e.target === modal) {
        hidePremiumModal();
    }
});
