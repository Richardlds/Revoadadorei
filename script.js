document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao rolar em mobile
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }
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
    
    // Tipos de ingresso
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
            name: "Feminino",
            price: 0,
            features: [
                "Acesso ao evento",
                "Área comum",
            ],
            available: true
        }
    ];
    
    // Renderizar ingressos
    function renderTickets() {
        const ticketContainer = document.querySelector('.ticket-types');
        
        // Limpa o container antes de renderizar
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
                    <button class="btn buy-btn" data-id="${ticket.id}" data-name="${ticket.name}" data-price="${ticket.price}">
                        Comprar Agora
                    </button>
                </div>
            `;
            
            ticketContainer.appendChild(ticketCard);
        });
    }
    
    // Chamar a função para renderizar os ingressos
    renderTickets();
    
   // Configuração do modal de pagamento PIX
  const closeModal = document.querySelector('.close-modal');
  const modal = document.getElementById('ticketModal');
  const confirmationModal = document.getElementById('confirmationModal');
  
  // Verifica se estamos no Netlify
  const isNetlify = window.location.hostname.includes('netlify.app');

  // Adiciona evento de clique aos botões de compra
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-btn')) {
      const button = e.target;
      const ticketName = button.getAttribute('data-name');
      const ticketPrice = button.getAttribute('data-price');
      
      document.getElementById('modalBody').innerHTML = `
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
          
          <form id="paymentForm" class="payment-form" name="payment" method="POST" netlify netlify-honeypot="bot-field" enctype="multipart/form-data">
            <input type="hidden" name="form-name" value="payment">
            <input type="hidden" name="ticketType" id="ticketTypeField" value="${ticketName}">
            <input type="hidden" name="ticketPrice" id="ticketPriceField" value="${ticketPrice}">
            <p class="hidden">
              <label>Não preencha este campo: <input name="bot-field"></label>
            </p>
            
            <div class="form-group">
              <label for="customerName">Nome Completo *</label>
              <input type="text" id="customerName" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="customerEmail">E-mail *</label>
              <input type="email" id="customerEmail" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="customerPhone">Telefone *</label>
              <input type="tel" id="customerPhone" name="phone" required>
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
              <label for="terms">Li e aceito os <a href="#">Termos e Condições</a> *</label>
            </div>
            
            <button type="submit" class="btn">
              <i class="fas fa-check-circle"></i> Enviar Dados
            </button>
          </form>
        </div>
      `;
      
      // Função para copiar chave PIX
      window.copyPixKey = function() {
        const pixKey = document.getElementById('pixKey').textContent.replace(/\./g, '').replace(/-/g, '');
        navigator.clipboard.writeText(pixKey).then(() => {
          alert('Chave PIX copiada para a área de transferência!');
        });
      };
      
      // Configurar o evento de submit
      const paymentForm = document.getElementById('paymentForm');
      if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
          if (isNetlify) {
            // Envia normalmente para o Netlify
            setTimeout(() => {
              modal.style.display = 'none';
              confirmationModal.style.display = 'block';
            }, 500);
          } else {
            // Modo de teste - exibe os dados no console
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            console.log("Dados do formulário (modo teste):", data);
            modal.style.display = 'none';
            confirmationModal.style.display = 'block';
            this.reset();
          }
        });
      }
      
      modal.style.display = 'block';
    }
  });
    
    // Fechar modais
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    document.getElementById('closeConfirmation')?.addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === document.getElementById('confirmationModal')) {
            document.getElementById('confirmationModal').style.display = 'none';
        }
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
    const map = L.map('map').setView([-19.840865, -43.918970], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([-19.840865, -43.918970]).addTo(map)
        .bindPopup('LOCAL DA REVOADA<br>Rua Olegário Mariano, 140 - Tupi, Belo Horizonte - MG, 31844-080')
        .openPopup();
    
    // Melhorar o touch no mapa
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.style.cssText += '; touch-action: pan-x pan-y;';
    }
    
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
        const elements = document.querySelectorAll('.ticket-card, .faq-item');
        
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
    document.querySelectorAll('.ticket-card, .faq-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez ao carregar
    
    // Prevenir zoom no input em iOS
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            if (window.innerWidth <= 480) {
                document.body.style.zoom = "100%";
            }
        });
    });
});
