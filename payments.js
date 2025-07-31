// Funções relacionadas a pagamentos
function copyPixKey() {
    const pixKey = document.getElementById('pixKey').textContent.replace(/\./g, '').replace(/-/g, '');
    navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada para a área de transferência!');
    });
}

// Configuração do fluxo de pagamento
function setupPaymentFlow() {
    const ticketModal = document.getElementById('ticketModal');
    const paymentModal = document.getElementById('paymentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModalButtons = document.querySelectorAll('.close-modal, #closeConfirmation');
    const ticketForm = document.getElementById('ticketForm');

    // Abrir modal de ingresso ao clicar em comprar
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-btn')) {
            const button = e.target;
            document.getElementById('ticketType').value = button.getAttribute('data-type');
            document.getElementById('ticketPrice').value = button.getAttribute('data-price');
            
            ticketModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // Envio do formulário de ingresso
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            console.log('Dados do formulário:', data);
                
            ticketModal.style.display = 'none';
            paymentModal.style.display = 'block';
            
            // Envio para Netlify (se aplicável)
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
            }
        });
    }

    // Fechar modais
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
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupPaymentFlow();
});