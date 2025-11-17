// template-engine.js - Sistema de Templates JavaScript

/**
 * Motor de templates para renderização dinâmica
 */

class TemplateEngine {
    constructor() {
        this.templates = {};
        this.cache = new Map();
        this.loadTemplates();
    }

    /**
     * Carregar templates
     */
    loadTemplates() {
        // Template Home
        this.templates.home = (data = {}) => `
            <section class="hero">
                <div class="hero-overlay">
                    <div class="container">
                        <h2>Transformando Vidas, Construindo Futuros</h2>
                        <p>Juntos somos mais fortes. Participe das nossas ações e faça a diferença.</p>
                        <div class="hero-buttons">
                            <a href="#/cadastro" data-route="/cadastro" class="btn btn-primary">Quero Ser Voluntário</a>
                            <a href="#/projetos" data-route="/projetos" class="btn btn-secondary">Ver Projetos</a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="sobre">
                <div class="container">
                    <h2>Sobre Nós</h2>
                    <div class="sobre-grid">
                        ${this.renderCards(data.sobre || this.getMockSobre())}
                    </div>
                </div>
            </section>

            <section class="impacto">
                <div class="container">
                    <h2>Nosso Impacto</h2>
                    <div class="impacto-grid" id="impacto-numeros">
                        ${this.renderImpacto(data.impacto || this.getMockImpacto())}
                    </div>
                </div>
            </section>

            <section class="projetos-destaque">
                <div class="container">
                    <h2>Projetos em Destaque</h2>
                    <div class="projetos-grid">
                        ${this.renderProjetos(data.projetos || this.getMockProjetos(), 3)}
                    </div>
                    <div class="centralizado">
                        <a href="#/projetos" data-route="/projetos" class="btn btn-primary">Ver Todos os Projetos</a>
                    </div>
                </div>
            </section>
        `;

        // Template Projetos
        this.templates.projetos = (data = {}) => `
            <section class="banner-interno">
                <div class="container">
                    <h2>Nossos Projetos Sociais</h2>
                    <p>Conheça as iniciativas que estão transformando vidas</p>
                </div>
            </section>

            <section class="filtros">
                <div class="container">
                    <h3>Filtrar por Categoria</h3>
                    <div class="filtros-botoes">
                        ${this.renderFiltros()}
                    </div>
                </div>
            </section>

            <section class="projetos-lista">
                <div class="container" id="projetos-container">
                    ${this.renderProjetosCompletos(data.projetos || this.getMockProjetos())}
                </div>
            </section>

            <section class="voluntariado">
                <div class="container">
                    <h2>Como Funciona o Voluntariado</h2>
                    <div class="voluntariado-grid">
                        ${this.renderPassosVoluntariado()}
                    </div>
                    <div class="centralizado">
                        <a href="#/cadastro" data-route="/cadastro" class="btn btn-primary btn-grande">Quero me Cadastrar</a>
                    </div>
                </div>
            </section>
        `;

        // Template Cadastro
        this.templates.cadastro = (data = {}) => `
            <section class="banner-interno">
                <div class="container">
                    <h2>Seja um Voluntário</h2>
                    <p>Faça parte da nossa equipe e transforme vidas</p>
                </div>
            </section>

            <section class="beneficios">
                <div class="container">
                    <h3>Por que ser Voluntário?</h3>
                    <div class="beneficios-grid">
                        ${this.renderBeneficios()}
                    </div>
                </div>
            </section>

            <section class="formulario-cadastro">
                <div class="container">
                    <div class="form-header">
                        <h2>Formulário de Cadastro</h2>
                        <p>Preencha todos os campos para se tornar um voluntário</p>
                    </div>
                    ${this.renderFormulario()}
                </div>
            </section>
        `;
    }

    /**
     * Renderizar template
     */
    static async render(templateName, data = {}) {
        const engine = new TemplateEngine();
        
        // Verificar cache
        const cacheKey = `${templateName}-${JSON.stringify(data)}`;
        if (engine.cache.has(cacheKey)) {
            return engine.cache.get(cacheKey);
        }

        // Renderizar template
        const template = engine.templates[templateName];
        if (!template) {
            console.error(`Template não encontrado: ${templateName}`);
            return '<p>Template não encontrado</p>';
        }

        const html = template(data);
        
        // Armazenar em cache
        engine.cache.set(cacheKey, html);
        
        // Limpar cache antigo (manter últimos 10)
        if (engine.cache.size > 10) {
            const firstKey = engine.cache.keys().next().value;
            engine.cache.delete(firstKey);
        }

        return html;
    }

    /**
     * Renderizar cards
     */
    renderCards(items) {
        return items.map(item => `
            <article class="sobre-card">
                <img src="${item.imagem}" alt="${item.titulo}">
                <h3>${item.titulo}</h3>
                <p>${item.descricao}</p>
            </article>
        `).join('');
    }

    /**
     * Renderizar impacto
     */
    renderImpacto(items) {
        return items.map(item => `
            <div class="impacto-card">
                <span class="numero" data-target="${item.numero}">${item.numero}</span>
                <p>${item.label}</p>
            </div>
        `).join('');
    }

    /**
     * Renderizar projetos
     */
    renderProjetos(projetos, limit = null) {
        const items = limit ? projetos.slice(0, limit) : projetos;
        return items.map(projeto => `
            <article class="projeto-card" data-categoria="${projeto.categoria}">
                <img src="${projeto.imagem}" alt="${projeto.titulo}">
                <div class="projeto-conteudo">
                    <h3>${projeto.titulo}</h3>
                    <p>${projeto.descricao}</p>
                    <span class="categoria">${projeto.categoria}</span>
                    <a href="#/projeto/${projeto.id}" class="btn-saiba-mais">Saiba Mais</a>
                </div>
            </article>
        `).join('');
    }

    /**
     * Renderizar projetos completos
     */
    renderProjetosCompletos(projetos) {
        return projetos.map(projeto => `
            <article class="projeto-detalhado" data-categoria="${projeto.categoria}">
                <div class="projeto-imagem">
                    <img src="${projeto.imagem}" alt="${projeto.titulo}">
                </div>
                <div class="projeto-info">
                    <span class="badge badge-secundaria">${projeto.categoria}</span>
                    <h3>${projeto.titulo}</h3>
                    <p class="projeto-descricao">${projeto.descricaoCompleta}</p>
                    <div class="projeto-impacto">
                        <h4>Impacto Social</h4>
                        <ul>
                            ${projeto.impacto.map(item => `<li>✓ ${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="projeto-acoes">
                        <a href="#/cadastro" data-route="/cadastro" class="btn btn-primary">Quero Ser Voluntário</a>
                        <button class="btn btn-secondary" onclick="Doacao.iniciar('${projeto.id}')">Apoiar Projeto</button>
                    </div>
                </div>
            </article>
        `).join('');
    }

    /**
     * Renderizar filtros
     */
    renderFiltros() {
        const categorias = [
            { id: 'todos', label: 'Todos' },
            { id: 'educacao', label: 'Educação' },
            { id: 'saude', label: 'Saúde' },
            { id: 'assistencia', label: 'Assistência Social' },
            { id: 'cultura', label: 'Cultura' },
            { id: 'meio-ambiente', label: 'Meio Ambiente' }
        ];

        return categorias.map((cat, index) => `
            <button class="filtro-btn ${index === 0 ? 'ativo' : ''}" 
                    data-categoria="${cat.id}">
                ${cat.label}
            </button>
        `).join('');
    }

    /**
     * Renderizar passos voluntariado
     */
    renderPassosVoluntariado() {
        const passos = [
            { numero: 1, titulo: 'Cadastre-se', descricao: 'Preencha o formulário com suas informações' },
            { numero: 2, titulo: 'Escolha um Projeto', descricao: 'Nossa equipe entrará em contato' },
            { numero: 3, titulo: 'Participe da Capacitação', descricao: 'Oferecemos treinamento inicial' },
            { numero: 4, titulo: 'Faça a Diferença', descricao: 'Comece a transformar vidas' }
        ];

        return passos.map(passo => `
            <div class="voluntariado-passo">
                <div class="passo-numero">${passo.numero}</div>
                <h3>${passo.titulo}</h3>
                <p>${passo.descricao}</p>
            </div>
        `).join('');
    }

    /**
     * Renderizar benefícios
     */
    renderBeneficios() {
        const beneficios = [
            { icone: '❤️', titulo: 'Faça a Diferença', descricao: 'Impacte positivamente vidas' },
            { icone: '🎓', titulo: 'Desenvolva Habilidades', descricao: 'Aprenda novas competências' },
            { icone: '🤝', titulo: 'Networking', descricao: 'Conheça pessoas inspiradoras' },
            { icone: '📜', titulo: 'Certificado', descricao: 'Receba certificado de horas' }
        ];

        return beneficios.map(item => `
            <div class="beneficio-card">
                <span class="icone">${item.icone}</span>
                <h4>${item.titulo}</h4>
                <p>${item.descricao}</p>
            </div>
        `).join('');
    }

    /**
     * Renderizar formulário
     */
    renderFormulario() {
        return `
            <form id="formVoluntario" class="form-voluntario" novalidate>
                <!-- O formulário completo já existe no HTML -->
                <!-- Aqui seria renderizado dinamicamente se necessário -->
            </form>
        `;
    }

    /**
     * Dados mock - Sobre
     */
    getMockSobre() {
        return [
            {
                imagem: 'images/institucional/missao.jpg',
                titulo: 'Nossa Missão',
                descricao: 'Promover o desenvolvimento social através de ações integradas de educação, saúde e cultura.'
            },
            {
                imagem: 'images/institucional/visao.jpg',
                titulo: 'Nossa Visão',
                descricao: 'Ser referência nacional em projetos sociais transformadores até 2030.'
            },
            {
                imagem: 'images/institucional/valores.jpg',
                titulo: 'Nossos Valores',
                descricao: 'Transparência, respeito, comprometimento e trabalho em equipe.'
            }
        ];
    }

    /**
     * Dados mock - Impacto
     */
    getMockImpacto() {
        return [
            { numero: '15000+', label: 'Vidas Impactadas' },
            { numero: '50+', label: 'Projetos Ativos' },
            { numero: '800+', label: 'Voluntários Cadastrados' },
            { numero: '12', label: 'Anos de Atuação' }
        ];
    }

    /**
     * Dados mock - Projetos
     */
    getMockProjetos() {
        return [
            {
                id: 1,
                titulo: 'Educação para Todos',
                descricao: 'Aulas de reforço escolar gratuitas para crianças.',
                descricaoCompleta: 'Oferecemos aulas de reforço escolar gratuitas com foco em português e matemática.',
                categoria: 'educacao',
                imagem: 'images/projetos/projeto1.jpg',
                impacto: ['500+ crianças atendidas', '85% de melhora no desempenho', '15 voluntários professores']
            },
            {
                id: 2,
                titulo: 'Saúde Comunitária',
                descricao: 'Atendimento médico e odontológico gratuito.',
                descricaoCompleta: 'Realizamos atendimentos médicos, odontológicos e psicológicos em comunidades carentes.',
                categoria: 'saude',
                imagem: 'images/projetos/projeto2.jpg',
                impacto: ['3.000+ atendimentos realizados', '12 profissionais voluntários', '5 campanhas de vacinação']
            },
            {
                id: 3,
                titulo: 'Alimenta Solidário',
                descricao: 'Distribuição de cestas básicas e refeições.',
                descricaoCompleta: 'Combatemos a fome através da distribuição de cestas básicas e refeições quentes.',
                categoria: 'assistencia',
                imagem: 'images/projetos/projeto3.jpg',
                impacto: ['800 famílias beneficiadas', '2.500 refeições por semana', '40 voluntários na cozinha']
            },
            {
                id: 4,
                titulo: 'Arte e Cultura Viva',
                descricao: 'Oficinas de música, dança e teatro.',
                descricaoCompleta: 'Oferecemos oficinas culturais gratuitas para crianças e jovens.',
                categoria: 'cultura',
                imagem: 'images/projetos/projeto4.jpg',
                impacto: ['300 jovens nas oficinas', '20 apresentações realizadas', '8 instrutores voluntários']
            },
            {
                id: 5,
                titulo: 'Natureza Sustentável',
                descricao: 'Educação ambiental e plantio de árvores.',
                descricaoCompleta: 'Promovemos ações de educação ambiental e sustentabilidade.',
                categoria: 'meio-ambiente',
                imagem: 'images/projetos/projeto5.jpg',
                impacto: ['2.000 árvores plantadas', '10 escolas atendidas', '5 toneladas de resíduos coletados']
            }
        ];
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
}