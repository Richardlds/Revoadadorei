document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Countdown Timer
    const countdownDate = new Date('Aug 16, 2025 18:00:00').getTime();
    
    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdown);
            document.querySelector('.countdown').innerHTML = '<div class="countdown-ended">A festa começou!</div>';
        }
    }, 1000);
    
    // Ticket Purchase Flow
    const ticketModal = document.getElementById('ticketModal');
    const paymentModal = document.getElementById('paymentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalButtons = document.querySelectorAll('.close-modal, #closeConfirmation');
    const ticketForm = document.getElementById('ticketForm');
    
    // Open ticket form when clicking Buy button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-btn')) {
            const button = e.target;
            const ticketType = button.getAttribute('data-type');
            const ticketPrice = button.getAttribute('data-price');
            
            // Set ticket type and price in the form
            document.getElementById('ticketType').value = ticketType;
            document.getElementById('ticketPrice').value = ticketPrice;
            
            // Open ticket form modal
            ticketModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Handle form submission
   if (ticketForm) {
    ticketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        console.log('Dados do formulário:', data); // Inclui o código de convite se preenchido
            
            // Close ticket form and open payment modal
            ticketModal.style.display = 'none';
            paymentModal.style.display = 'block';
            
            // For Netlify form handling
            if (window.location.hostname.includes('netlify.app')) {
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                }).then(() => {
                    console.log('Form submitted to Netlify');
                }).catch(error => {
                    console.error('Error:', error);
                });
            } else {
                console.log('Form data:', data);
            }
        });
    }
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            ticketModal.style.display = 'none';
            paymentModal.style.display = 'none';
            confirmationModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === ticketModal || e.target === paymentModal || e.target === confirmationModal) {
            ticketModal.style.display = 'none';
            paymentModal.style.display = 'none';
            confirmationModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Copy PIX key function
    window.copyPixKey = function() {
        const pixKey = document.getElementById('pixKey').textContent.replace(/\./g, '').replace(/-/g, '');
        navigator.clipboard.writeText(pixKey).then(() => {
            alert('Chave PIX copiada para a área de transferência!');
        });
    };
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Initialize Map
    if (document.getElementById('map')) {
        const map = L.map('map').setView([-19.840865, -43.918970], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        L.marker([-19.840865, -43.918970]).addTo(map)
            .bindPopup('<b>REVOADA DO REI</b><br>Rua Olegário Mariano, 140 - Tupi, Belo Horizonte - MG')
            .openPopup();
        
        // Improve touch on mobile
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.style.cssText += '; touch-action: pan-x pan-y;';
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.ticket-card, .faq-item, .gallery-item, .feature');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize elements with opacity 0 for animation
    document.querySelectorAll('.ticket-card, .faq-item, .gallery-item, .feature').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Prevent zoom on input focus in iOS
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            if (window.innerWidth <= 480) {
                document.body.style.zoom = "100%";
            }
        });
    });
});