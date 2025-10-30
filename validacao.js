// validacao.js - Validação completa do formulário de voluntário

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formVoluntario');
    
    if (!form) return;
    
    // Prevenir submit padrão e validar
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remover mensagens de erro anteriores
        limparErros();
        
        // Validar todos os campos
        let formValido = true;
        
        // Validar nome completo
        const nomeCompleto = document.getElementById('nomeCompleto');
        if (!validarNome(nomeCompleto)) {
            formValido = false;
        }
        
        // Validar e-mail
        const email = document.getElementById('email');
        if (!validarEmail(email)) {
            formValido = false;
        }
        
        // Validar telefone
        const telefone = document.getElementById('telefone');
        if (!validarTelefone(telefone)) {
            formValido = false;
        }
        
        // Validar CPF
        const cpf = document.getElementById('cpf');
        if (!validarCampoCPF(cpf)) {
            formValido = false;
        }
        
        // Validar data de nascimento
        const dataNascimento = document.getElementById('dataNascimento');
        if (!validarDataNascimento(dataNascimento)) {
            formValido = false;
        }
        
        // Validar gênero
        const genero = document.getElementById('genero');
        if (!validarSelect(genero, 'Por favor, selecione um gênero')) {
            formValido = false;
        }
        
        // Validar CEP
        const cep = document.getElementById('cep');
        if (!validarCEP(cep)) {
            formValido = false;
        }
        
        // Validar endereço
        const logradouro = document.getElementById('logradouro');
        if (!validarCampoObrigatorio(logradouro, 'O endereço é obrigatório')) {
            formValido = false;
        }
        
        const numero = document.getElementById('numero');
        if (!validarCampoObrigatorio(numero, 'O número é obrigatório')) {
            formValido = false;
        }
        
        const bairro = document.getElementById('bairro');
        if (!validarCampoObrigatorio(bairro, 'O bairro é obrigatório')) {
            formValido = false;
        }
        
        const cidade = document.getElementById('cidade');
        if (!validarCampoObrigatorio(cidade, 'A cidade é obrigatória')) {
            formValido = false;
        }
        
        const estado = document.getElementById('estado');
        if (!validarSelect(estado, 'Por favor, selecione um estado')) {
            formValido = false;
        }
        
        // Validar áreas de interesse (pelo menos uma)
        const areasCheckboxes = document.querySelectorAll('input[name="areas[]"]');
        if (!validarCheckboxGroup(areasCheckboxes, 'Selecione pelo menos uma área de interesse')) {
            formValido = false;
        }
        
        // Validar motivação
        const motivacao = document.getElementById('motivacao');
        if (!validarMotivacao(motivacao)) {
            formValido = false;
        }
        
        // Validar termos
        const termos = document.getElementById('termos');
        if (!validarTermos(termos)) {
            formValido = false;
        }
        
        // Se tudo estiver válido, enviar formulário
        if (formValido) {
            enviarFormulario(form);
        } else {
            // Scroll para o primeiro erro
            const primeiroErro = document.querySelector('.invalido');
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
                primeiroErro.focus();
            }
        }
    });
    
    // Validação em tempo real
    adicionarValidacaoTempoReal();
});

// Limpar todas as mensagens de erro
function limparErros() {
    const camposInvalidos = document.querySelectorAll('.invalido');
    camposInvalidos.forEach(campo => {
        campo.classList.remove('invalido');
    });
    
    const mensagensErro = document.querySelectorAll('.erro-msg');
    mensagensErro.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });
}

// Mostrar erro em um campo
function mostrarErro(campo, mensagem) {
    campo.classList.add('invalido');
    const erroMsg = campo.nextElementSibling;
    if (erroMsg && erroMsg.classList.contains('erro-msg')) {
        erroMsg.textContent = mensagem;
        erroMsg.style.display = 'block';
    }
}

// Validar nome completo
function validarNome(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'O nome completo é obrigatório');
        return false;
    }
    
    if (valor.length < 3) {
        mostrarErro(campo, 'O nome deve ter pelo menos 3 caracteres');
        return false;
    }
    
    if (!/^[a-záàâãéèêíïóôõöúçñ\s]+$/i.test(valor)) {
        mostrarErro(campo, 'O nome deve conter apenas letras');
        return false;
    }
    
    const partesNome = valor.split(' ').filter(parte => parte.length > 0);
    if (partesNome.length < 2) {
        mostrarErro(campo, 'Por favor, informe o nome completo');
        return false;
    }
    
    return true;
}

// Validar e-mail
function validarEmail(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'O e-mail é obrigatório');
        return false;
    }
    
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(valor)) {
        mostrarErro(campo, 'Por favor, informe um e-mail válido');
        return false;
    }
    
    return true;
}

// Validar telefone
function validarTelefone(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'O telefone é obrigatório');
        return false;
    }
    
    const telefoneLimpo = valor.replace(/\D/g, '');
    if (telefoneLimpo.length !== 11) {
        mostrarErro(campo, 'O telefone deve ter 11 dígitos (DDD + número)');
        return false;
    }
    
    return true;
}

// Validar CPF (usando função do mascaras.js)
function validarCampoCPF(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'O CPF é obrigatório');
        return false;
    }
    
    const cpfLimpo = valor.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        mostrarErro(campo, 'O CPF deve ter 11 dígitos');
        return false;
    }
    
    // Validação de CPF já é feita no mascaras.js
    if (!validarCPF(valor)) {
        mostrarErro(campo, 'CPF inválido');
        return false;
    }
    
    return true;
}

// Validar data de nascimento
function validarDataNascimento(campo) {
    const valor = campo.value;
    
    if (valor === '') {
        mostrarErro(campo, 'A data de nascimento é obrigatória');
        return false;
    }
    
    const dataNasc = new Date(valor);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNasc = dataNasc.getMonth();
    
    let idadeReal = idade;
    if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) {
        idadeReal--;
    }
    
    if (idadeReal < 18) {
        mostrarErro(campo, 'Você deve ter pelo menos 18 anos');
        return false;
    }
    
    if (idadeReal > 100) {
        mostrarErro(campo, 'Por favor, verifique a data de nascimento');
        return false;
    }
    
    return true;
}

// Validar CEP
function validarCEP(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'O CEP é obrigatório');
        return false;
    }
    
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        mostrarErro(campo, 'O CEP deve ter 8 dígitos');
        return false;
    }
    
    return true;
}

// Validar campo obrigatório genérico
function validarCampoObrigatorio(campo, mensagem) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, mensagem);
        return false;
    }
    
    return true;
}

// Validar select
function validarSelect(campo, mensagem) {
    const valor = campo.value;
    
    if (valor === '') {
        mostrarErro(campo, mensagem);
        return false;
    }
    
    return true;
}

// Validar grupo de checkboxes
function validarCheckboxGroup(checkboxes, mensagem) {
    const algumMarcado = Array.from(checkboxes).some(cb => cb.checked);
    
    if (!algumMarcado) {
        const primeiroCheckbox = checkboxes[0];
        const container = primeiroCheckbox.closest('.form-group');
        if (container) {
            const erroMsg = container.querySelector('.erro-msg');
            if (erroMsg) {
                erroMsg.textContent = mensagem;
                erroMsg.style.display = 'block';
            }
        }
        return false;
    }
    
    return true;
}

// Validar motivação
function validarMotivacao(campo) {
    const valor = campo.value.trim();
    
    if (valor === '') {
        mostrarErro(campo, 'Por favor, conte-nos sua motivação');
        return false;
    }
    
    if (valor.length < 50) {
        mostrarErro(campo, 'A motivação deve ter pelo menos 50 caracteres');
        return false;
    }
    
    if (valor.length > 500) {
        mostrarErro(campo, 'A motivação deve ter no máximo 500 caracteres');
        return false;
    }
    
    return true;
}

// Validar termos
function validarTermos(campo) {
    if (!campo.checked) {
        const container = campo.closest('.form-group');
        if (container) {
            const erroMsg = container.querySelector('.erro-msg');
            if (erroMsg) {
                erroMsg.textContent = 'Você deve aceitar os termos e condições';
                erroMsg.style.display = 'block';
            }
        }
        return false;
    }
    
    return true;
}

// Adicionar validação em tempo real
function adicionarValidacaoTempoReal() {
    // Nome
    const nomeCompleto = document.getElementById('nomeCompleto');
    if (nomeCompleto) {
        nomeCompleto.addEventListener('blur', () => validarNome(nomeCompleto));
    }
    
    // E-mail
    const email = document.getElementById('email');
    if (email) {
        email.addEventListener('blur', () => validarEmail(email));
    }
    
    // Telefone
    const telefone = document.getElementById('telefone');
    if (telefone) {
        telefone.addEventListener('blur', () => validarTelefone(telefone));
    }
    
    // Data de nascimento
    const dataNascimento = document.getElementById('dataNascimento');
    if (dataNascimento) {
        dataNascimento.addEventListener('blur', () => validarDataNascimento(dataNascimento));
    }
    
    // Motivação
    const motivacao = document.getElementById('motivacao');
    if (motivacao) {
        motivacao.addEventListener('blur', () => validarMotivacao(motivacao));
    }
}

// Enviar formulário (simulação)
function enviarFormulario(form) {
    // Mostrar loading
    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;
    
    // Simular envio (em produção, aqui seria uma chamada AJAX real)
    setTimeout(() => {
        // Esconder formulário
        form.style.display = 'none';
        
        // Mostrar mensagem de sucesso
        const mensagemSucesso = document.getElementById('mensagemSucesso');
        if (mensagemSucesso) {
            mensagemSucesso.style.display = 'block';
            mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Em produção, você faria algo como:
        // fetch('/api/cadastro-voluntario', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(new FormData(form))
        // })
        // .then(response => response.json())
        // .then(data => {
        //     // Tratar resposta
        // });
        
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }, 2000);
}