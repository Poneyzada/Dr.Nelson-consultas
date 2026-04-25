document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÇÕES NO SCROLL (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-anime]');
    animatedElements.forEach(el => observer.observe(el));

    // 2. ACCORDION DOS SERVIÇOS
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Opcional: Fechar outros accordions quando um abre
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Se não estava ativo, ativa. Se estava, ele já foi fechado pelo loop acima.
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    // 3. EFEITO DE SCROLL NO HEADER
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.padding = '0';
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // 4. LÓGICA DO MODAL ICP (Agendamento VIP)
    const openModalBtns = document.querySelectorAll('.btn-open-modal');
    const modal = document.getElementById('icp-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const icpForm = document.getElementById('icp-form');

    // Abre o modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Fecha o modal pelo botão
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Fecha o modal clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Envio do Formulário para WhatsApp
    icpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('icp-name').value;
        const interest = document.getElementById('icp-interest').value;
        const city = document.getElementById('icp-city').value;
        
        // Número do WhatsApp (substitua pelo número correto do Dr. Nelson, ex: 5511999999999)
        const phoneNumber = "5511999999999"; 
        
        const message = `Olá, vim pelo site! Meu nome é *${name}* e tenho interesse em acompanhamento para: *${interest}*.\nGostaria de agendar atendimento em: *${city}*.`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        modal.classList.remove('active'); // fecha após enviar
    });

    // 5. INICIALIZAÇÃO DO MAPA (MapLibre GL)
    // Estilo escuro elegante (Carto Dark Matter)
    const map = new maplibregl.Map({
        container: 'clinics-map',
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [-39.9, -10.7], // Centro aproximado das cidades
        zoom: 8,
        scrollZoom: false // Evita zoom acidental ao rolar a página
    });

    // Adiciona controle de navegação (zoom)
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Lista de Cidades e Coordenadas [Longitude, Latitude]
    const clinics = [
        { name: "Senhor do Bonfim", coords: [-40.1895, -10.4614] },
        { name: "Filadélfia", coords: [-40.1419, -10.7423] },
        { name: "Itiúba", coords: [-39.8541, -10.6868] },
        { name: "Queimadas", coords: [-39.6225, -10.9783] },
        { name: "Nordestina", coords: [-39.7346, -10.9254] }
    ];

    clinics.forEach(clinic => {
        // Cria elemento customizado para o marcador
        const markerEl = document.createElement('div');
        markerEl.className = 'custom-map-marker';

        // Cria o popup customizado
        const popupContent = `
            <div class="map-popup-content">
                <strong>${clinic.name}</strong>
                <span>Atendimento Presencial</span>
                <a href="#agendar" class="btn btn-sm btn-primary mt-2 popup-btn" style="width: 100%; text-align: center; font-size: 0.8rem; padding: 0.4rem;">Agendar Aqui</a>
            </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
            .setHTML(popupContent);

        // Adiciona marcador ao mapa
        const marker = new maplibregl.Marker({ element: markerEl })
            .setLngLat(clinic.coords)
            .setPopup(popup)
            .addTo(map);
            
        // Abre o modal e já preenche a cidade correta
        popup.on('open', () => {
            setTimeout(() => {
                const btn = document.querySelector('.popup-btn');
                if(btn) {
                    btn.addEventListener('click', () => {
                        const citySelect = document.getElementById('icp-city');
                        if (citySelect) {
                            citySelect.value = clinic.name; // Auto-seleciona a cidade
                        }
                        modal.classList.add('active'); // Abre o modal ICP
                    });
                }
            }, 100);
        });
    });

    // 6. ANIMAÇÃO DE PARTÍCULAS DNA (Segunda Dobra)
    const canvas = document.getElementById('apresentacao-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Ajustar tamanho do canvas para o tamanho do container pai (section.apresentacao)
        const setCanvasSize = () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };
        
        let width, height;
        setCanvasSize();

        window.addEventListener('resize', setCanvasSize);

        const particles = [];
        // Cores solicitadas: Azul, Verde, Amarelo(Dourado), Rosa
        const colors = ['#AEC6CF', '#98FF98', '#F3E5AB', '#FFB6C1'];
        const particleCount = 50; // Reduzido drasticamente para alta performance (estava 120, o que gerava 7000 cálculos por frame)

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                size: 1.5 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.3 + Math.random() * 0.5
            });
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill(); // Removido shadowBlur que destrói a GPU no mobile
            });

            // Conexões fracas de DNA entre pontos próximos (Otimizado)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    // 10000 = 100^2 (Evita Math.sqrt, que é muito pesado)
                    if (distSq < 10000) {
                        const dist = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = particles[i].color;
                        ctx.globalAlpha = 0.15 * (1 - dist / 100);
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
});
