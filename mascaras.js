// mascaras.js - Máscaras para CPF, Telefone e CEP

// Aplicar máscara de CPF (###.###.###-##)
function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 segundos dígitos
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen antes dos 2 últimos dígitos
}

// Aplicar máscara de Telefone ((##) #####-####)
function mascaraTelefone(valor) {
    return valor
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos 2 primeiros dígitos
        .replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o 5º e o 6º dígitos
}

// Aplicar máscara de CEP (#####-###)
function mascaraCEP(valor) {
    return valor
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca hífen após os 5 primeiros dígitos
}

// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Buscar CEP na API ViaCEP
async function buscarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) return null;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) return null;
        
        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

// Event Listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Máscara CPF
    const inputCPF = document.getElementById('cpf');
    if (inputCPF) {
        inputCPF.addEventListener('input', function(e) {
            e.target.value = mascaraCPF(e.target.value);
        });
        
        inputCPF.addEventListener('blur', function(e) {
            const cpfValor = e.target.value;
            if (cpfValor && !validarCPF(cpfValor)) {
                e.target.classList.add('invalido');
                const erroMsg = e.target.nextElementSibling;
                if (erroMsg && erroMsg.classList.contains('erro-msg')) {
                    erroMsg.textContent = 'CPF inválido';
                    erroMsg.style.display = 'block';
                }
            } else {
                e.target.classList.remove('invalido');
                const erroMsg = e.target.nextElementSibling;
                if (erroMsg && erroMsg.classList.contains('erro-msg')) {
                    erroMsg.style.display = 'none';
                }
            }
        });
    }
    
    // Máscara Telefone
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            e.target.value = mascaraTelefone(e.target.value);
        });
    }
    
    // Máscara CEP e busca automática
    const inputCEP = document.getElementById('cep');
    if (inputCEP) {
        inputCEP.addEventListener('input', function(e) {
            e.target.value = mascaraCEP(e.target.value);
        });
        
        inputCEP.addEventListener('blur', async function(e) {
            const cep = e.target.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                // Mostrar loading
                const logradouro = document.getElementById('logradouro');
                const bairro = document.getElementById('bairro');
                const cidade = document.getElementById('cidade');
                const estado = document.getElementById('estado');
                
                if (logradouro) logradouro.value = 'Buscando...';
                
                const dadosCEP = await buscarCEP(cep);
                
                if (dadosCEP) {
                    if (logradouro) logradouro.value = dadosCEP.logradouro || '';
                    if (bairro) bairro.value = dadosCEP.bairro || '';
                    if (cidade) cidade.value = dadosCEP.localidade || '';
                    if (estado) estado.value = dadosCEP.uf || '';
                    
                    // Focar no campo número
                    const numero = document.getElementById('numero');
                    if (numero) numero.focus();
                } else {
                    if (logradouro) logradouro.value = '';
                    alert('CEP não encontrado. Por favor, preencha manualmente.');
                }
            }
        });
    }
    
    // Contador de caracteres para textarea motivação
    const motivacaoTextarea = document.getElementById('motivacao');
    if (motivacaoTextarea) {
        const contador = motivacaoTextarea.nextElementSibling;
        
        motivacaoTextarea.addEventListener('input', function(e) {
            const caracteres = e.target.value.length;
            if (contador && contador.classList.contains('contador')) {
                contador.textContent = `${caracteres}/500 caracteres`;
                
                if (caracteres < 50) {
                    contador.style.color = '#e74c3c';
                } else if (caracteres > 500) {
                    contador.style.color = '#e74c3c';
                } else {
                    contador.style.color = '#27ae60';
                }
            }
        });
    }
    
    // Mostrar/ocultar campo de experiência anterior
    const radiosExperiencia = document.querySelectorAll('input[name="experienciaVoluntario"]');
    const experienciaDetalhes = document.getElementById('experienciaDetalhes');
    
    radiosExperiencia.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'sim' && experienciaDetalhes) {
                experienciaDetalhes.style.display = 'block';
            } else if (experienciaDetalhes) {
                experienciaDetalhes.style.display = 'none';
            }
        });
    });
    
    // Limitar data de nascimento (maior de 18 anos)
    const dataNascimento = document.getElementById('dataNascimento');
    if (dataNascimento) {
        const hoje = new Date();
        const dataMaxima = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
        const dataMaximaFormatada = dataMaxima.toISOString().split('T')[0];
        dataNascimento.setAttribute('max', dataMaximaFormatada);
    }
});

// Exportar funções para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mascaraCPF,
        mascaraTelefone,
        mascaraCEP,
        validarCPF,
        buscarCEP
    };
}