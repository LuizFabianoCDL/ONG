// spa-router.js - Sistema de Single Page Application (SPA)

/**
 * Sistema de roteamento SPA
 * Gerencia navegação sem recarregar a página
 */

class SPARouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.contentContainer = document.getElementById('app-content');
        
        // Inicializar router
        this.init();
    }

    /**
     * Inicializar o sistema de rotas
     */
    init() {
        // Interceptar cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Lidar com botões de voltar/avançar
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.loadRoute(e.state.route, false);
            }
        });

        // Carregar rota inicial
        const initialRoute = window.location.hash.slice(1) || '/';
        this.navigateTo(initialRoute, true);
    }

    /**
     * Registrar uma nova rota
     */
    register(path, handler) {
        this.routes[path] = handler;
    }

    /**
     * Navegar para uma rota
     */
    navigateTo(route, replace = false) {
        if (this.currentRoute === route) return;

        // Atualizar URL
        if (replace) {
            window.history.replaceState({ route }, '', `#${route}`);
        } else {
            window.history.pushState({ route }, '', `#${route}`);
        }

        // Carregar rota
        this.loadRoute(route);
    }

    /**
     * Carregar conteúdo da rota
     */
    async loadRoute(route, addToHistory = true) {
        // Verificar se rota existe
        if (!this.routes[route]) {
            console.error(`Rota não encontrada: ${route}`);
            this.loadRoute('/404');
            return;
        }

        // Mostrar loading
        this.showLoading();

        try {
            // Executar handler da rota
            const content = await this.routes[route]();
            
            // Atualizar conteúdo
            this.contentContainer.innerHTML = content;
            
            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Atualizar rota atual
            this.currentRoute = route;
            
            // Atualizar menu ativo
            this.updateActiveMenu(route);
            
            // Disparar evento de mudança de rota
            this.dispatchRouteChange(route);
            
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            this.showError();
        }
    }

    /**
     * Mostrar loading
     */
    showLoading() {
        this.contentContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    }

    /**
     * Mostrar erro
     */
    showError() {
        this.contentContainer.innerHTML = `
            <div class="alert alert-erro">
                <h3>Ops! Algo deu errado</h3>
                <p>Não foi possível carregar o conteúdo. Tente novamente.</p>
                <button onclick="location.reload()" class="btn btn-primary">Recarregar</button>
            </div>
        `;
    }

    /**
     * Atualizar menu ativo
     */
    updateActiveMenu(route) {
        // Remover classe ativo de todos os links
        document.querySelectorAll('[data-route]').forEach(link => {
            link.classList.remove('ativo');
        });

        // Adicionar classe ativo ao link atual
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('ativo');
        }
    }

    /**
     * Disparar evento de mudança de rota
     */
    dispatchRouteChange(route) {
        const event = new CustomEvent('routechange', { 
            detail: { route } 
        });
        window.dispatchEvent(event);
    }
}

// Instanciar router
const router = new SPARouter();

// Registrar rotas principais
router.register('/', async () => {
    return await TemplateEngine.render('home');
});

router.register('/projetos', async () => {
    return await TemplateEngine.render('projetos');
});

router.register('/cadastro', async () => {
    return await TemplateEngine.render('cadastro');
});

router.register('/projeto/:id', async (params) => {
    return await TemplateEngine.render('projeto-detalhes', params);
});

router.register('/404', async () => {
    return `
        <section class="erro-404">
            <div class="container">
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <p>A página que você está procurando não existe.</p>
                <a href="#/" data-route="/" class="btn btn-primary">Voltar para Home</a>
            </div>
        </section>
    `;
});

// Exportar router
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPARouter;
}