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
    
    // Ticket Data
    const ticketTypes = [
        {
            id: 1,
            name: "Masculino",
            price: 20.00,
            features: [
                "Acesso ao evento completo",
                "Área comum com piscina",
                "Entrada de bebidas permitido",
            ],
            available: true
        },
        {
            id: 2,
            name: "Feminino",
            price: 0.00,
            features: [
             "Acesso ao evento completo",
                "Área comum com piscina",
                "Entrada de bebidas permitido",
            ],
            available: true
        }
    ];
    
    // Render Tickets
    function renderTickets() {
        const ticketContainer = document.querySelector('.ticket-grid');
        ticketContainer.innerHTML = '';
        
        ticketTypes.forEach(ticket => {
            const ticketCard = document.createElement('div');
            ticketCard.className = 'ticket-card';
            
            ticketCard.innerHTML = `
                <div class="ticket-header">
                    <h3>${ticket.name}</h3>
                    <div class="ticket-price">R$ ${ticket.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="ticket-body">
                    <ul class="ticket-features">
                        ${ticket.features.map(feature => `
                            <li>
                                <i class="fas fa-check"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn btn-primary buy-btn" data-id="${ticket.id}" data-name="${ticket.name}" data-price="${ticket.price}">
                        COMPRAR AGORA
                    </button>
                </div>
            `;
            
            ticketContainer.appendChild(ticketCard);
        });
    }
    
    renderTickets();
    
    // Modal Handling
    const paymentModal = document.getElementById('paymentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalButtons = document.querySelectorAll('.close-modal, #closeConfirmation');
    
    // Check if we're on Netlify
    const isNetlify = window.location.hostname.includes('netlify.app');
    
    // Open Payment Modal when clicking Buy button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-btn')) {
            const button = e.target;
            const ticketName = button.getAttribute('data-name');
            const ticketPrice = button.getAttribute('data-price');
            
            document.getElementById('modalBody').innerHTML = `
                <h2>Pagamento via PIX</h2>
                <div class="pix-payment">
                    <h3>${ticketName}</h3>
                    <p class="ticket-price">Valor: R$ ${parseFloat(ticketPrice).toFixed(2).replace('.', ',')}</p>
                    
                    <div class="pix-qr-code">
                        <iframe loading="lazy" style="width: 200px; height: 200px; border: none;"
                            src="https://www.canva.com/design/DAGuHKi8D1c/xnnAsCKSbYdHcyHvgk9iwg/view?embed" 
                            allowfullscreen="allowfullscreen" allow="fullscreen">
                        </iframe>
                        <p>Escaneie o QR code acima para pagar</p>
                    </div>
                    
                    <div class="pix-key">
                        <h4>Ou copie a chave PIX:</h4>
                        <div class="pix-key-value">
                            <span id="pixKey">023.248.016-80</span>
                            <button class="btn-copy" onclick="copyPixKey()">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="pix-instructions">
                        <h5>Como pagar:</h5>
                        <ol>
                            <li>Abra o app do seu banco</li>
                            <li>Selecione a opção PIX</li>
                            <li>Escaneie o QR code ou cole a chave PIX</li>
                            <li>Confira os dados e confirme o pagamento</li>
                        </ol>
                    </div>
                    
                    <form id="paymentForm" class="payment-form" name="payment" method="POST" netlify netlify-honeypot="bot-field" enctype="multipart/form-data">
                        <input type="hidden" name="form-name" value="payment">
                        <input type="hidden" name="ticketType" value="${ticketName}">
                        <input type="hidden" name="ticketPrice" value="${ticketPrice}">
                        <p class="hidden">
                            <label>Não preencha este campo: <input name="bot-field"></label>
                        </p>
                        
                        <h4>Dados Pessoais</h4>
                        
                        <div class="form-group">
                            <label for="customerName">Nome Completo *</label>
                            <input type="text" id="customerName" name="name" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customerEmail">E-mail *</label>
                                <input type="email" id="customerEmail" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="customerPhone">Telefone *</label>
                                <input type="tel" id="customerPhone" name="phone" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="customerCpf">CPF *</label>
                            <input type="text" id="customerCpf" name="cpf" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="paymentProof">Comprovante de Pagamento *</label>
                            <input type="file" id="paymentProof" name="paymentProof" accept="image/*,.pdf" required>
                            <small>Aceitamos: JPG, PNG ou PDF (máx. 5MB)</small>
                        </div>
                        
                        <div class="form-group">
                            <input type="checkbox" id="terms" name="terms" required>
                            <label for="terms">Li e aceito os <a href="#" target="_blank">Termos e Condições</a> *</label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-check-circle"></i> ENVIAR COMPROVANTE
                        </button>
                    </form>
                </div>
            `;
            
            // Add copyPixKey function to window
            window.copyPixKey = function() {
                const pixKey = document.getElementById('pixKey').textContent.replace(/\./g, '').replace(/-/g, '');
                navigator.clipboard.writeText(pixKey).then(() => {
                    alert('Chave PIX copiada para a área de transferência!');
                });
            };
            
            // Handle form submission
            const paymentForm = document.getElementById('paymentForm');
            if (paymentForm) {
                paymentForm.addEventListener('submit', async function(e) {
                    if (isNetlify) {
                        // Let Netlify handle the form submission
                        setTimeout(() => {
                            paymentModal.style.display = 'none';
                            confirmationModal.style.display = 'block';
                        }, 500);
                    } else {
                        // Test mode - log form data and show confirmation
                        e.preventDefault();
                        const formData = new FormData(this);
                        const data = Object.fromEntries(formData.entries());
                        console.log("Form Data:", data);
                        paymentModal.style.display = 'none';
                        confirmationModal.style.display = 'block';
                        this.reset();
                    }
                });
            }
            
            paymentModal.style.display = 'block';
        }
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
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