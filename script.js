document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Contagem regressiva
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
            document.querySelector('.countdown').innerHTML = '<div>A festa começou!</div>';
        }
    }, 1000);
    
    // Tipos de ingresso (pode ser carregado de uma API no mundo real)
    const ticketTypes = [
        {
            id: 1,
            name: "Masculino",
            price: 20,
            features: [
                "Acesso ao evento",
                "Área comum",
            ],
            available: true
        },
        {
            id: 2,
              name: " FEMININO",
            price: 0,
            features: [
              "Acesso ao evento",
                "Área comum",
            ],
            available: true
        },
        {
            id: 3,
            name: " EM BREVE",
            price: 0,
            features: [
               
            ],
            available: false
        }
    ];
    
    // Renderizar ingressos
    const ticketContainer = document.querySelector('.ticket-types');
    
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
                    ${ticket.features.map((feature, index) => `
                        <li>
                            <i class="fas ${index < 3 ? 'fa-check' : 'fa-times'}"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
                <button class="btn buy-btn" data-id="${ticket.id}" data-name="${ticket.name}" data-price="${ticket.price}">
                    ${ticket.available ? 'Comprar Agora' : 'Esgotado'}
                </button>
            </div>
        `;
        
        if (!ticket.available) {
            ticketCard.querySelector('.buy-btn').disabled = true;
            ticketCard.querySelector('.buy-btn').style.opacity = '0.6';
            ticketCard.querySelector('.buy-btn').style.cursor = 'not-allowed';
        }
        
        ticketContainer.appendChild(ticketCard);
    });
    
    // Modal de compra
    const modal = document.getElementById('ticketModal');
    const closeModal = document.querySelector('.close-modal');
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            const ticketName = this.getAttribute('data-name');
            const ticketPrice = this.getAttribute('data-price');
            
            document.getElementById('modalBody').innerHTML = `
                <div class="ticket-info">
                    <h3>${ticketName}</h3>
                    <p>Preço: R$ ${parseFloat(ticketPrice).toFixed(2).replace('.', ',')}</p>
                </div>
                
                <form id="checkoutForm" class="checkout-form">
                    <h3>Informações Pessoais</h3>
                    <div class="form-group">
                        <label for="name">Nome Completo</label>
                        <input type="text" id="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Telefone</label>
                        <input type="tel" id="phone" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cpf">CPF</label>
                            <input type="text" id="cpf" required>
                        </div>
                        
                    </div>
                    
                    <h3>Forma de Pagamento</h3>
                    <div class="form-group">
                        <label for="payment">Método</label>
                        <select id="payment" required>
                            <option value="">Selecione...</option>
                            <option value="credit">Cartão de Crédito</option>
                            <option value="pix">PIX</option>
                            <option value="bank">Transferência Bancária</option>
                        </select>
                    </div>
                    
                    <div id="creditCardFields" style="display: none;">
                        <div class="form-group">
                            <label for="cardNumber">Número do Cartão</label>
                            <input type="text" id="cardNumber">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cardExpiry">Validade</label>
                                <input type="text" id="cardExpiry" placeholder="MM/AA">
                            </div>
                            
                            <div class="form-group">
                                <label for="cardCvv">CVV</label>
                                <input type="text" id="cardCvv">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardName">Nome no Cartão</label>
                            <input type="text" id="cardName">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <input type="checkbox" id="terms" required>
                        <label for="terms">Li e aceito os <a href="#">Termos e Condições</a></label>
                    </div>
                    
                    <button type="submit" class="btn">Finalizar Compra</button>
                </form>
            `;
            
            // Mostrar campos de cartão de crédito se selecionado
            document.getElementById('payment').addEventListener('change', function() {
                const creditCardFields = document.getElementById('creditCardFields');
                creditCardFields.style.display = this.value === 'credit' ? 'block' : 'none';
            });
            
            // Validar formulário
            document.getElementById('checkoutForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simular processamento de pagamento
                setTimeout(() => {
                    modal.style.display = 'none';
                    
                    const confirmationModal = document.getElementById('confirmationModal');
                    const confirmationMessage = document.getElementById('confirmationMessage');
                    
                    confirmationMessage.textContent = `Seu ingresso ${ticketName} foi reservado com sucesso! Os detalhes foram enviados para ${document.getElementById('email').value}.`;
                    confirmationModal.style.display = 'block';
                }, 1500);
            });
            
            modal.style.display = 'block';
        });
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        
        if (e.target === document.getElementById('confirmationModal')) {
            document.getElementById('confirmationModal').style.display = 'none';
        }
    });
    
    document.getElementById('closeConfirmation').addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'none';
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Mapa
    const map = L.map('map').setView([-23.5505, -46.6333], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([-19.840865, -43.918970]).addTo(map)
        .bindPopup('LOCAL DA REVOADA<br>Rua Olegário Mariano, 140 - Tupi, Belo Horizonte - MG, 31844-080')
        .openPopup();
    
    // Formulário de contato
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
    
    // Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Obrigado por assinar nossa newsletter!');
        this.reset();
    });
    
    // Suavizar rolagem para links âncora
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
    
    // Animação ao rolar
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.ticket-card, .gallery-item, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Inicializar elementos com opacidade 0 para animação
    document.querySelectorAll('.ticket-card, .gallery-item, .faq-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez ao carregar
});

// Melhorar a experiência do menu mobile
burger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Fechar menu ao rolar em mobile
window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Melhorar o touch no mapa
const mapElement = document.getElementById('map');
if (mapElement) {
    mapElement.style.cssText += '; touch-action: pan-x pan-y;';
}

// Prevenir zoom no input em iOS
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        if (window.innerWidth <= 480) {
            document.body.style.zoom = "100%";
        }
    });
});