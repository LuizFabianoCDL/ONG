// validacao-avancada.js - Sistema Avançado de Validação de Formulários

/**
 * Sistema de validação com verificação de consistência
 * e avisos ao usuário em tempo real
 */

class ValidacaoAvancada {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.campos = new Map();
        this.erros = new Map();
        this.avisos = new Map();
        this.touchedFields = new Set();
        
        if (this.form) {
            this.init();
        }
    }

    /**
     * Inicializar validação
     */
    init() {
        this.setupValidationRules();
        this.attachEventListeners();
        this.createProgressBar();
    }

    /**
     * Configurar regras de validação
     */
    setupValidationRules() {
        // Nome Completo
        this.addRule('nomeCompleto', [
            { 
                rule: 'required', 
                message: 'O nome completo é obrigatório' 
            },
            { 
                rule: 'minLength', 
                value: 3, 
                message: 'O nome deve ter pelo menos 3 caracteres' 
            },
            { 
                rule: 'pattern', 
                value: /^[a-záàâãéèêíïóôõöúçñ\s]+$/i, 
                message: 'O nome deve conter apenas letras' 
            },
            { 
                rule: 'custom', 
                validate: (value) => value.trim().split(' ').length >= 2,
                message: 'Por favor, informe o nome completo (nome e sobrenome)'
            }
        ]);

        // E-mail
        this.addRule('email', [
            { 
                rule: 'required', 
                message: 'O e-mail é obrigatório' 
            },
            { 
                rule: 'email', 
                message: 'Por favor, informe um e-mail válido' 
            },
            {
                rule: 'custom',
                validate: (value) => !value.includes('..'),
                message: 'E-mail inválido: não pode conter ".." consecutivos'
            }
        ]);

        // CPF
        this.addRule('cpf', [
            { 
                rule: 'required', 
                message: 'O CPF é obrigatório' 
            },
            { 
                rule: 'cpf', 
                message: 'CPF inválido' 
            }
        ]);

        // Telefone
        this.addRule('telefone', [
            { 
                rule: 'required', 
                message: 'O telefone é obrigatório' 
            },
            { 
                rule: 'phone', 
                message: 'Telefone inválido (use formato: (11) 98765-4321)' 
            }
        ]);

        // Data de Nascimento
        this.addRule('dataNascimento', [
            { 
                rule: 'required', 
                message: 'A data de nascimento é obrigatória' 
            },
            { 
                rule: 'date', 
                message: 'Data inválida' 
            },
            { 
                rule: 'age', 
                min: 18, 
                max: 100,
                message: 'Você deve ter entre 18 e 100 anos' 
            }
        ]);

        // CEP
        this.addRule('cep', [
            { 
                rule: 'required', 
                message: 'O CEP é obrigatório' 
            },
            { 
                rule: 'cep', 
                message: 'CEP inválido' 
            }
        ]);

        // Motivação
        this.addRule('motivacao', [
            { 
                rule: 'required', 
                message: 'Por favor, conte-nos sua motivação' 
            },
            { 
                rule: 'minLength', 
                value: 50, 
                message: 'A motivação deve ter pelo menos 50 caracteres' 
            },
            { 
                rule: 'maxLength', 
                value: 500, 
                message: 'A motivação deve ter no máximo 500 caracteres' 
            }
        ]);

        // Termos
        this.addRule('termos', [
            { 
                rule: 'checked', 
                message: 'Você deve aceitar os termos e condições' 
            }
        ]);

        // Áreas de Interesse
        this.addRule('areas[]', [
            { 
                rule: 'minChecked', 
                value: 1, 
                message: 'Selecione pelo menos uma área de interesse' 
            }
        ]);
    }

    /**
     * Adicionar regra de validação
     */
    addRule(fieldName, rules) {
        this.campos.set(fieldName, rules);
    }

    /**
     * Anexar event listeners
     */
    attachEventListeners() {
        // Validação em tempo real (blur)
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            // Blur - validar quando sair do campo
            field.addEventListener('blur', (e) => {
                this.touchedFields.add(field.name || field.id);
                this.validateField(field);
                this.updateProgress();
            });

            // Input - limpar erro ao digitar
            field.addEventListener('input', (e) => {
                if (this.erros.has(field.name || field.id)) {
                    this.clearFieldError(field);
                }
                this.updateProgress();
            });

            // Focus - mostrar dicas
            field.addEventListener('focus', (e) => {
                this.showFieldHint(field);
            });
        });

        // Submit - validar tudo
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAll();
        });

        // Validação de consistência entre campos
        this.setupCrossFieldValidation();
    }

    /**
     * Validação cruzada entre campos
     */
    setupCrossFieldValidation() {
        // Validar consistência CPF x Data de Nascimento
        const cpfField = this.form.querySelector('#cpf');
        const dataNascField = this.form.querySelector('#dataNascimento');

        if (cpfField && dataNascField) {
            dataNascField.addEventListener('blur', () => {
                this.validateConsistency();
            });
        }

        // Validar consistência E-mail x Nome
        const emailField = this.form.querySelector('#email');
        const nomeField = this.form.querySelector('#nomeCompleto');

        if (emailField && nomeField) {
            emailField.addEventListener('blur', () => {
                this.checkEmailNameConsistency(emailField, nomeField);
            });
        }

        // Validar CEP x Cidade/Estado
        const cepField = this.form.querySelector('#cep');
        const cidadeField = this.form.querySelector('#cidade');
        const estadoField = this.form.querySelector('#estado');

        if (cepField && cidadeField && estadoField) {
            cepField.addEventListener('blur', async () => {
                await this.validateAddressConsistency(cepField, cidadeField, estadoField);
            });
        }
    }

    /**
     * Validar campo individual
     */
    validateField(field) {
        const fieldName = field.name || field.id;
        const rules = this.campos.get(fieldName);

        if (!rules) return true;

        const value = this.getFieldValue(field);
        let isValid = true;

        for (const rule of rules) {
            const result = this.applyRule(value, rule, field);
            
            if (!result.valid) {
                this.showError(field, result.message);
                this.erros.set(fieldName, result.message);
                isValid = false;
                break;
            }
        }

        if (isValid) {
            this.clearFieldError(field);
            this.erros.delete(fieldName);
        }

        return isValid;
    }

    /**
     * Aplicar regra de validação
     */
    applyRule(value, rule, field) {
        switch (rule.rule) {
            case 'required':
                return {
                    valid: value.trim() !== '',
                    message: rule.message
                };

            case 'minLength':
                return {
                    valid: value.length >= rule.value,
                    message: rule.message
                };

            case 'maxLength':
                return {
                    valid: value.length <= rule.value,
                    message: rule.message
                };

            case 'pattern':
                return {
                    valid: rule.value.test(value),
                    message: rule.message
                };

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    valid: emailRegex.test(value),
                    message: rule.message
                };

            case 'cpf':
                return {
                    valid: this.validateCPF(value),
                    message: rule.message
                };

            case 'phone':
                const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
                return {
                    valid: phoneRegex.test(value),
                    message: rule.message
                };

            case 'cep':
                const cepRegex = /^\d{5}-\d{3}$/;
                return {
                    valid: cepRegex.test(value),
                    message: rule.message
                };

            case 'date':
                return {
                    valid: !isNaN(Date.parse(value)),
                    message: rule.message
                };

            case 'age':
                const age = this.calculateAge(value);
                return {
                    valid: age >= rule.min && age <= rule.max,
                    message: rule.message
                };

            case 'checked':
                return {
                    valid: field.checked,
                    message: rule.message
                };

            case 'minChecked':
                const checked = this.form.querySelectorAll(`[name="${field.name}"]:checked`);
                return {
                    valid: checked.length >= rule.value,
                    message: rule.message
                };

            case 'custom':
                return {
                    valid: rule.validate(value),
                    message: rule.message
                };

            default:
                return { valid: true };
        }
    }

    /**
     * Validar CPF
     */
    validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    /**
     * Calcular idade
     */
    calculateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Validar consistência de dados
     */
    validateConsistency() {
        const cpf = this.form.querySelector('#cpf')?.value;
        const dataNasc = this.form.querySelector('#dataNascimento')?.value;

        if (cpf && dataNasc) {
            const idade = this.calculateAge(dataNasc);
            
            // Avisar se idade muito baixa para CPF
            if (idade < 16) {
                this.showWarning(
                    this.form.querySelector('#cpf'),
                    'Atenção: Pessoas com menos de 16 anos não podem ter CPF próprio'
                );
            }
        }
    }

    /**
     * Verificar consistência E-mail x Nome
     */
    checkEmailNameConsistency(emailField, nomeField) {
        const email = emailField.value.toLowerCase();
        const nome = nomeField.value.toLowerCase().split(' ')[0];

        if (nome && email) {
            // Se o nome não aparece no e-mail, mostrar aviso
            if (!email.includes(nome) && nome.length > 3) {
                this.showWarning(
                    emailField,
                    'Aviso: O e-mail parece não estar relacionado ao nome informado. Verifique se está correto.'
                );
            }
        }
    }

    /**
     * Validar consistência de endereço
     */
    async validateAddressConsistency(cepField, cidadeField, estadoField) {
        const cep = cepField.value.replace(/\D/g, '');
        const cidade = cidadeField.value.trim();
        const estado = estadoField.value;

        if (cep.length === 8 && cidade && estado) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    // Verificar inconsistência
                    if (data.localidade.toLowerCase() !== cidade.toLowerCase()) {
                        this.showWarning(
                            cidadeField,
                            `Atenção: O CEP informado pertence a ${data.localidade}/${data.uf}. Verifique os dados.`
                        );
                    }

                    if (data.uf !== estado) {
                        this.showWarning(
                            estadoField,
                            `Atenção: O CEP pertence ao estado ${data.uf}. Verifique os dados.`
                        );
                    }
                }
            } catch (error) {
                console.error('Erro ao validar endereço:', error);
            }
        }
    }

    /**
     * Obter valor do campo
     */
    getFieldValue(field) {
        if (field.type === 'checkbox' || field.type === 'radio') {
            return field.checked ? field.value : '';
        }
        return field.value.trim();
    }

    /**
     * Mostrar erro
     */
    showError(field, message) {
        field.classList.add('invalido');
        
        const errorElement = field.parentElement.querySelector('.erro-msg');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Adicionar shake animation
        field.classList.add('animate-shake');
        setTimeout(() => field.classList.remove('animate-shake'), 500);
    }

    /**
     * Mostrar aviso
     */
    showWarning(field, message) {
        // Criar elemento de aviso se não existir
        let warningElement = field.parentElement.querySelector('.aviso-msg');
        
        if (!warningElement) {
            warningElement = document.createElement('div');
            warningElement.className = 'aviso-msg';
            warningElement.style.cssText = `
                display: block;
                color: #f39c12;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                padding: 0.5rem;
                background-color: rgba(243, 156, 18, 0.1);
                border-radius: 0.25rem;
            `;
            field.parentElement.appendChild(warningElement);
        }

        warningElement.textContent = `⚠️ ${message}`;
        this.avisos.set(field.name || field.id, message);

        // Remover após 10 segundos
        setTimeout(() => {
            warningElement.remove();
            this.avisos.delete(field.name || field.id);
        }, 10000);
    }

    /**
     * Limpar erro do campo
     */
    clearFieldError(field) {
        field.classList.remove('invalido');
        
        const errorElement = field.parentElement.querySelector('.erro-msg');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Mostrar dica do campo
     */
    showFieldHint(field) {
        const hints = {
            cpf: 'Digite apenas números. Exemplo: 123.456.789-00',
            telefone: 'Digite com DDD. Exemplo: (11) 98765-4321',
            cep: 'Digite apenas números. Exemplo: 12345-678',
            email: 'Digite um e-mail válido. Exemplo: seu@email.com'
        };

        const fieldName = field.name || field.id;
        const hint = hints[fieldName];

        if (hint) {
            // Implementar tooltip ou mensagem de ajuda
            console.log(`Dica: ${hint}`);
        }
    }

    /**
     * Validar todos os campos
     */
    validateAll() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');

        // Marcar todos como touched
        fields.forEach(field => {
            this.touchedFields.add(field.name || field.id);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.onSuccess();
        } else {
            this.onError();
        }

        return isValid;
    }

    /**
     * Sucesso na validação
     */
    onSuccess() {
        // Mostrar mensagem de sucesso
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        console.log('Formulário válido:', data);

        // Simular envio
        this.showSuccessMessage();
    }

    /**
     * Erro na validação
     */
    onError() {
        // Scroll para o primeiro erro
        const firstError = this.form.querySelector('.invalido');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }

        // Mostrar notificação
        this.showNotification('Por favor, corrija os erros antes de continuar', 'erro');
    }

    /**
     * Mostrar mensagem de sucesso
     */
    showSuccessMessage() {
        this.form.style.display = 'none';
        const mensagemSucesso = document.getElementById('mensagemSucesso');
        if (mensagemSucesso) {
            mensagemSucesso.style.display = 'block';
            mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Mostrar notificação
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Criar barra de progresso
     */
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.innerHTML = `
            <p><strong>Progresso do formulário:</strong> <span id="progress-percentage">0%</span></p>
            <div class="form-progress-bar">
                <div class="form-progress-fill" id="progress-fill"></div>
            </div>
        `;

        this.form.insertBefore(progressContainer, this.form.firstChild);
    }

    /**
     * Atualizar progresso
     */
    updateProgress() {
        const totalFields = this.form.querySelectorAll('input[required], select[required], textarea[required]').length;
        const filledFields = Array.from(this.form.querySelectorAll('input[required], select[required], textarea[required]'))
            .filter(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    return field.checked;
                }
                return field.value.trim() !== '';
            }).length;

        const percentage = Math.round((filledFields / totalFields) * 100);

        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');

        if (progressFill && progressPercentage) {
            progressFill.style.width = `${percentage}%`;
            progressPercentage.textContent = `${percentage}%`;
        }
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    const formVoluntario = new ValidacaoAvancada('formVoluntario');
});

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidacaoAvancada;
}