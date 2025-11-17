// dom-advanced.js - Manipulação Avançada do DOM

/**
 * Classe para manipulação avançada do DOM
 * Incluindo animações, lazy loading, e otimizações
 */

class DOMAdvanced {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    /**
     * Inicializar funcionalidades
     */
    init() {
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.setupDynamicContent();
        this.setupAnimationTriggers();
        this.setupCounterAnimation();
    }

    /**
     * Configurar Intersection Observer para animações ao scroll
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                    
                    // Animar contadores se for seção de impacto
                    if (entry.target.classList.contains('impacto-card')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, options);

        // Observar elementos com animação
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll(
                '.animacao-scroll, .sobre-card, .projeto-card, .impacto-card'
            );
            
            animatedElements.forEach(el => observer.observe(el));
        });

        this.observers.set('intersection', observer);
    }

    /**
     * Configurar Lazy Loading de imagens
     */
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Carregar imagem
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        
                        // Parar de observar após carregar
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observar imagens com data-src
        document.addEventListener('DOMContentLoaded', () => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        });

        this.observers.set('images', imageObserver);
    }

    /**
     * Configurar conteúdo dinâmico
     */
    setupDynamicContent() {
        // Escutar mudanças de rota
        window.addEventListener('routechange', (e) => {
            const { route } = e.detail;
            this.handleRouteChange(route);
        });

        // Atualizar conteúdo dinâmico a cada 30 segundos
        setInterval(() => {
            this.updateDynamicData();
        }, 30000);
    }

    /**
     * Lidar com mudança de rota
     */
    handleRouteChange(route) {
        console.log('Rota alterada para:', route);
        
        // Reconfigurar observers para novos elementos
        setTimeout(() => {
            this.setupIntersectionObserver();
            this.setupLazyLoading();
            this.setupAnimationTriggers();
        }, 100);

        // Adicionar classe de transição
        document.body.classList.add('page-transition');
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 300);
    }

    /**
     * Atualizar dados dinâmicos
     */
    updateDynamicData() {
        // Atualizar contadores (simulado)
        const impactoCards = document.querySelectorAll('.impacto-card .numero');
        impactoCards.forEach(card => {
            const currentValue = parseInt(card.textContent.replace(/\D/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 10);
            card.textContent = newValue + '+';
        });
    }

    /**
     * Configurar triggers de animação
     */
    setupAnimationTriggers() {
        // Animar ao hover
        document.addEventListener('DOMContentLoaded', () => {
            const hoverElements = document.querySelectorAll('.hover-animate');
            
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    el.classList.add('animate-pulse');
                });
                
                el.addEventListener('mouseleave', () => {
                    el.classList.remove('animate-pulse');
                });
            });
        });
    }

    /**
     * Animar contador
     */
    animateCounter(element) {
        const numberElement = element.querySelector('.numero');
        if (!numberElement || numberElement.dataset.animated) return;

        const target = parseInt(numberElement.dataset.target || numberElement.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                numberElement.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target + '+';
                numberElement.dataset.animated = 'true';
            }
        };

        updateCounter();
    }

    /**
     * Configurar animação de contadores
     */
    setupCounterAnimation() {
        document.addEventListener('DOMContentLoaded', () => {
            const impactoSection = document.querySelector('.impacto');
            
            if (impactoSection) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const counters = entry.target.querySelectorAll('.impacto-card');
                            counters.forEach((card, index) => {
                                setTimeout(() => {
                                    this.animateCounter(card);
                                }, index * 200);
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(impactoSection);
            }
        });
    }

    /**
     * Criar elemento com atributos
     */
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Adicionar atributos
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('data-')) {
                element.dataset[key.replace('data-', '')] = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        // Adicionar filhos
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });

        return element;
    }

    /**
     * Remover elemento com animação
     */
    static removeElement(element, animation = 'fadeOut') {
        element.classList.add(`animate-${animation}`);
        
        element.addEventListener('animationend', () => {
            element.remove();
        }, { once: true });
    }

    /**
     * Inserir elemento com animação
     */
    static insertElement(parent, element, animation = 'fadeIn') {
        element.classList.add(`animate-${animation}`);
        parent.appendChild(element);
    }

    /**
     * Atualizar conteúdo com transição
     */
    static updateContent(element, newContent, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;

        setTimeout(() => {
            element.innerHTML = newContent;
            element.style.opacity = '1';
        }, duration);
    }

    /**
     * Clonar elemento profundamente
     */
    static cloneElement(element) {
        return element.cloneNode(true);
    }

    /**
     * Encontrar elementos por seletor
     */
    static find(selector, parent = document) {
        return parent.querySelector(selector);
    }

    /**
     * Encontrar todos os elementos
     */
    static findAll(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    /**
     * Adicionar múltiplos event listeners
     */
    static on(element, events, handler) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler);
        });
    }

    /**
     * Remover múltiplos event listeners
     */
    static off(element, events, handler) {
        events.split(' ').forEach(event => {
            element.removeEventListener(event, handler);
        });
    }

    /**
     * Verificar se elemento está visível
     */
    static isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    /**
     * Obter posição do elemento
     */
    static getPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * Scroll suave para elemento
     */
    static scrollTo(element, offset = 0) {
        const position = this.getPosition(element);
        window.scrollTo({
            top: position.top - offset,
            behavior: 'smooth'
        });
    }

    /**
     * Debounce function
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    static throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Toggle classe com animação
     */
    static toggleClass(element, className, duration = 300) {
        element.style.transition = `all ${duration}ms`;
        element.classList.toggle(className);
    }

    /**
     * Fade in elemento
     */
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Fade out elemento
     */
    static fadeOut(element, duration = 300) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;

        setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }, 10);
    }

    /**
     * Slide down
     */
    static slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms`;
        element.style.display = 'block';

        const height = element.scrollHeight;
        
        setTimeout(() => {
            element.style.height = height + 'px';
            setTimeout(() => {
                element.style.height = 'auto';
                element.style.overflow = '';
            }, duration);
        }, 10);
    }

    /**
     * Slide up
     */
    static slideUp(element, duration = 300) {
        const height = element.scrollHeight;
        element.style.height = height + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms`;

        setTimeout(() => {
            element.style.height = '0';
            setTimeout(() => {
                element.style.display = 'none';
                element.style.overflow = '';
            }, duration);
        }, 10);
    }

    /**
     * Criar modal dinamicamente
     */
    static createModal(title, content, options = {}) {
        const modal = this.createElement('div', {
            className: 'modal ativo',
            id: 'dynamic-modal'
        }, [
            this.createElement('div', {
                className: 'modal-conteudo'
            }, [
                this.createElement('button', {
                    className: 'modal-fechar',
                    'aria-label': 'Fechar modal'
                }, ['×']),
                this.createElement('h3', {}, [title]),
                this.createElement('div', { className: 'modal-body' }, [content])
            ])
        ]);

        // Fechar ao clicar no X
        modal.querySelector('.modal-fechar').addEventListener('click', () => {
            this.removeElement(modal);
        });

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.removeElement(modal);
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Criar notificação toast
     */
    static createToast(message, type = 'info', duration = 5000) {
        let container = document.querySelector('.toast-container');
        
        if (!container) {
            container = this.createElement('div', {
                className: 'toast-container'
            });
            document.body.appendChild(container);
        }

        const toast = this.createElement('div', {
            className: `toast toast-${type}`
        }, [message]);

        container.appendChild(toast);

        setTimeout(() => {
            this.removeElement(toast);
        }, duration);

        return toast;
    }
}

// Inicializar
const domAdvanced = new DOMAdvanced();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMAdvanced;
}