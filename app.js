// app.js - Arquivo Principal da Aplicação SPA

/**
 * Aplicação Principal
 * Integra todos os módulos e gerencia o estado da aplicação
 */

class App {
    constructor() {
        this.state = {
            user: null,
            projetos: [],
            currentRoute: '/',
            theme: 'light'
        };
        
        this.config = {
            apiUrl: '',
            debug: true
        };

        this.init();
    }

    /**
     * Inicializar aplicação
     */
    init() {
        console.log('🚀 Iniciando aplicação...');
        
        // Aguardar DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.start();
            });
        } else {
            this.start();
        }
    }

    /**
     * Iniciar aplicação
     */
    start() {
        // Carregar dados salvos
        this.loadState();
        
        // Inicializar módulos
        this.initModules();
        
        // Configurar event listeners globais
        this.setupGlobalListeners();
        
        // Carregar dados iniciais
        this.loadInitialData();
        
        console.log('✅ Aplicação iniciada com sucesso!');
    }

    /**
     * Inicializar módulos
     */
    initModules() {
        // Menu mobile
        this.initMobileMenu();
        
        // Filtros de projetos
        this.initProjectFilters();
        
        // Formulário de busca
        this.initSearchForm();
        
        // Scroll to top button
        this.initScrollToTop();
        
        // Theme switcher (opcional)
        this.initThemeSwitcher();
    }

    /**
     * Menu mobile
     */
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('.menu');
        
        if (menuToggle && menu) {
            menuToggle.addEventListener('click', () => {
                menu.classList.toggle('ativo');
                menuToggle.setAttribute('aria-expanded', menu.classList.contains('ativo'));
                
                // Atualizar ícone
                menuToggle.textContent = menu.classList.contains('ativo') ? '✕' : '☰';
            });

            // Fechar ao clicar em link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('ativo');
                    menuToggle.textContent = '☰';
                });
            });

            // Fechar ao pressionar ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu.classList.contains('ativo')) {
                    menu.classList.remove('ativo');
                    menuToggle.textContent = '☰';
                }
            });
        }
    }

    /**
     * Filtros de projetos
     */
    initProjectFilters() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filtro-btn')) {
                const categoria = e.target.dataset.categoria;
                this.filterProjects(categoria);
                
                // Atualizar botão ativo
                document.querySelectorAll('.filtro-btn').forEach(btn => {
                    btn.classList.remove('ativo');
                });
                e.target.classList.add('ativo');
            }
        });
    }

    /**
     * Filtrar projetos
     */
    filterProjects(categoria) {
        const projetos = document.querySelectorAll('.projeto-card, .projeto-detalhado');
        
        projetos.forEach(projeto => {
            const projetoCategoria = projeto.dataset.categoria;
            
            if (categoria === 'todos' || projetoCategoria === categoria) {
                DOMAdvanced.fadeIn(projeto, 300);
            } else {
                DOMAdvanced.fadeOut(projeto, 300);
            }
        });

        // Salvar filtro no estado
        this.state.currentFilter = categoria;
        this.saveState();
    }

    /**
     * Formulário de busca
     */
    initSearchForm() {
        const searchInput = document.querySelector('#search-input');
        
        if (searchInput) {
            searchInput.addEventListener('input', DOMAdvanced.debounce((e) => {
                this.searchProjects(e.target.value);
            }, 300));
        }
    }

    /**
     * Buscar projetos
     */
    searchProjects(query) {
        const projetos = document.querySelectorAll('.projeto-card, .projeto-detalhado');
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            projetos.forEach(projeto => {
                DOMAdvanced.fadeIn(projeto, 300);
            });
            return;
        }

        projetos.forEach(projeto => {
            const titulo = projeto.querySelector('h3')?.textContent.toLowerCase() || '';
            const descricao = projeto.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (titulo.includes(searchTerm) || descricao.includes(searchTerm)) {
                DOMAdvanced.fadeIn(projeto, 300);
            } else {
                DOMAdvanced.fadeOut(projeto, 300);
            }
        });
    }

    /**
     * Botão scroll to top
     */
    initScrollToTop() {
        let scrollBtn = document.querySelector('.voltar-topo');
        
        if (!scrollBtn) {
            scrollBtn = DOMAdvanced.createElement('button', {
                className: 'voltar-topo',
                'aria-label': 'Voltar ao topo'
            }, ['↑']);
            
            document.body.appendChild(scrollBtn);
        }

        // Mostrar/ocultar baseado no scroll
        window.addEventListener('scroll', DOMAdvanced.throttle(() => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visivel');
            } else {
                scrollBtn.classList.remove('visivel');
            }
        }, 200));

        // Scroll suave ao clicar
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Theme switcher (modo escuro/claro)
     */
    initThemeSwitcher() {
        // Carregar tema salvo
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Criar botão de tema (opcional)
        const themeBtn = document.querySelector('#theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }

    /**
     * Definir tema
     */
    setTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        this.state.theme = theme;
        localStorage.setItem('theme', theme);
    }

    /**
     * Configurar listeners globais
     */
    setupGlobalListeners() {
        // Prevenir submit padrão de formulários
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'formVoluntario') {
                e.preventDefault();
            }
        });

        // Tracking de navegação
        window.addEventListener('routechange', (e) => {
            this.state.currentRoute = e.detail.route;
            this.saveState();
            
            // Analytics (simulado)
            this.trackPageView(e.detail.route);
        });

        // Detectar cliques em botões de doação
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-doar') || 
                e.target.closest('.btn-doar')) {
                this.handleDonationClick(e);
            }
        });

        // Detectar offline/online
        window.addEventListener('offline', () => {
            DOMAdvanced.createToast('Você está offline', 'alerta', 5000);
        });

        window.addEventListener('online', () => {
            DOMAdvanced.createToast('Conexão restaurada', 'sucesso', 3000);
        });
    }

    /**
     * Carregar dados iniciais
     */
    async loadInitialData() {
        try {
            // Simular carregamento de dados
            await this.fetchProjects();
            await this.fetchStats();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            DOMAdvanced.createToast('Erro ao carregar dados', 'erro', 5000);
        }
    }

    /**
     * Buscar projetos (simulado)
     */
    async fetchProjects() {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mock já estão no template
        this.state.projetos = [
            { id: 1, titulo: 'Educação para Todos', categoria: 'educacao' },
            { id: 2, titulo: 'Saúde Comunitária', categoria: 'saude' },
            { id: 3, titulo: 'Alimenta Solidário', categoria: 'assistencia' }
        ];
    }

    /**
     * Buscar estatísticas (simulado)
     */
    async fetchStats() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.state.stats = {
            vidasImpactadas: 15000,
            projetosAtivos: 50,
            voluntarios: 800,
            anos: 12
        };
    }

    /**
     * Lidar com clique em doação
     */
    handleDonationClick(e) {
        e.preventDefault();
        
        DOMAdvanced.createModal(
            'Fazer uma Doação',
            `
                <p>Obrigado por querer apoiar nosso trabalho!</p>
                <p>Para fazer uma doação, utilize os dados bancários:</p>
                <div class="dados-bancarios">
                    <p><strong>Banco:</strong> Banco do Brasil</p>
                    <p><strong>Agência:</strong> 1234-5</p>
                    <p><strong>Conta:</strong> 98765-4</p>
                    <p><strong>PIX:</strong> 12.345.678/0001-90</p>
                </div>
                <button class="btn btn-primary" onclick="document.getElementById('dynamic-modal').remove()">Fechar</button>
            `
        );
    }

    /**
     * Track page view (simulado)
     */
    trackPageView(route) {
        if (this.config.debug) {
            console.log(`📊 Page view: ${route}`);
        }
        
        // Aqui integraria com Google Analytics ou similar
        // gtag('event', 'page_view', { page_path: route });
    }

    /**
     * Salvar estado no localStorage
     */
    saveState() {
        try {
            localStorage.setItem('appState', JSON.stringify({
                currentRoute: this.state.currentRoute,
                currentFilter: this.state.currentFilter,
                theme: this.state.theme
            }));
        } catch (error) {
            console.error('Erro ao salvar estado:', error);
        }
    }

    /**
     * Carregar estado do localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('appState');
            if (saved) {
                const state = JSON.parse(saved);
                Object.assign(this.state, state);
            }
        } catch (error) {
            console.error('Erro ao carregar estado:', error);
        }
    }

    /**
     * Exportar dados (para debug)
     */
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Resetar aplicação
     */
    reset() {
        localStorage.clear();
        location.reload();
    }
}

// Inicializar aplicação
const app = new App();

// Expor globalmente para debug
window.app = app;
window.DOMAdvanced = DOMAdvanced;

// Service Worker (PWA - opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}