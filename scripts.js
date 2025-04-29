// var do form de entrada

const nameInput = document.querySelector("#name")
const emailInput = document.querySelector("#email")
const senhaInput = document.querySelector("#senha")
const entrarBtn = document.querySelector("#entrar")
const cadastrarBtn = document.querySelector("#cadastrar")

// divs

const hideFormEnt = document.querySelector(".hideFormEnt")
const hideCadastro = document.querySelector(".hideCadastro")
const hideDados = document.querySelector(".hideDados")

// var do form de cadastro

const nomeCadastroInput = document.querySelector("#nomeCadastro")
const emailCadastroInput = document.querySelector("#emailCadastro")
const senhaCadastroInput = document.querySelector("#senhaCadastro")
const passwordConfirmInput = document.querySelector("#passwordConfirm")
const dataNasCadastroInput = document.querySelector("#dataNasCadastro")
const cpfCadastroInput = document.querySelector("#cpfCadastro")
const RGCadastroInput = document.querySelector("#RGCadastro")
const naciCadastroInput = document.querySelector("#naciCadastro")
const estCivilCadInput = document.querySelector("#estadoCivilCadastro")
const enviarBtn = document.querySelector("#enviar")

// var do form de dados cadastrados

const dataNas = document.querySelector("#dataNas")
const cpf = document.querySelector("#cpf")
const RG = document.querySelector("#RG")
const nacionalidade = document.querySelector("#nacionalidade")
const estadoCivil = document.querySelector("#estadoCivil")
const editarBtn = document.querySelector("#editar")

// Chave secreta para criptografia (não use algo assim em produção real)
const SECRET_KEY = "chave-super-secreta";


// Funções de criptografia
function criptografar(texto) {
    return CryptoJS.AES.encrypt(texto, SECRET_KEY).toString();
}

function descriptografar(textoCriptografado) {
    const bytes = CryptoJS.AES.decrypt(textoCriptografado, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

//let dadosUsuario = null
//funções 
function verificadorDeRg(rg){
//  22.222.222-2
    const rgTudoMin = rg.toLowerCase();
    const temLetra = /[a-z]/.test(rgTudoMin);
    const apenasNum = rg.replace(/\D/g, '')
    
    return apenasNum.length === 9 && !temLetra
        ? true 
        : false;
   

}
function verificadorDeCpf(cpf){
// 222.222.222.22
    const cpfTudoMin = cpf.toLowerCase();
    const temLetra = /[a-z]/.test(cpfTudoMin);
    const apenasNum = cpf.replace(/\D/g, '')
    
    return apenasNum.length === 11 && !temLetra
    ? true 
    : false;

}
function verificadorDeSenha(password) {
    const temNumero = /\d/.test(password);
    const temMaiuscula = /[A-Z]/.test(password);
    const temMinuscula = /[a-z]/.test(password);
    
    return temNumero && temMaiuscula && temMinuscula 
        ? true 
        : false;
}

function pegarDados() {
    const dados = JSON.parse(localStorage.getItem("dados"));

    if (Array.isArray(dados)) {
        return dados;
    } else {
        return [];
    }
}

function salvar(dado){  // Recebe um objeto com todos os dados
    try {
        const dados = pegarDados();
        dados.push(dado);
        localStorage.setItem("dados", JSON.stringify(dados));
    } catch (e) {
        console.error("Erro ao salvar no localStorage:", e);
        alert("Erro ao salvar. O armazenamento pode estar cheio ou sem suporte.");
    }
}

function atualizarLocalStorage(usuarioAtualizado){
    const dadosSalvos = pegarDados()
    let index = dadosSalvos.findIndex(user => user.email === emailInput.value)

    if (index !== -1) {
        dadosSalvos[index].dataNascimento = usuarioAtualizado.dataNascimento;
        dadosSalvos[index].cpf = usuarioAtualizado.cpf;
        dadosSalvos[index].rg = usuarioAtualizado.rg;
        dadosSalvos[index].nacionalidade = usuarioAtualizado.nacionalidade;
        dadosSalvos[index].estadoCivil = usuarioAtualizado.estadoCivil;

        localStorage.setItem("dados", JSON.stringify(dadosSalvos));
        alert("Dados atualizados com sucesso!");
    } else {
        alert("Usuário não encontrado para atualização.");
    }
}
// eventos
cadastrarBtn.addEventListener("click", (e) =>{
    e.preventDefault()
    
    hideFormEnt.style.display = "none"
    hideCadastro.style.display = "block"

})


enviarBtn.addEventListener("click", (e) => {
    e.preventDefault()

    const verificarSenha = verificadorDeSenha(senhaCadastroInput.value)
    const verificarRg = verificadorDeRg(RGCadastroInput.value)
    const verificarCpf = verificadorDeCpf(cpfCadastroInput.value)

    if(senhaCadastroInput.value === passwordConfirmInput.value && verificarSenha && verificarRg && verificarCpf){
        
        let dadosUsuario = {
            nome: nomeCadastroInput.value,
            email: emailCadastroInput.value,
            senha: criptografar(senhaCadastroInput.value),
            dataNascimento: dataNasCadastroInput.value,
            cpf: criptografar(cpfCadastroInput.value),
            rg: criptografar(RGCadastroInput.value),
            nacionalidade: naciCadastroInput.value,
            estadoCivil: estCivilCadInput.value
        };

        salvar(dadosUsuario)// Salva o objeto completo de uma vez
        alert("Dados salvos com sucesso!");

        hideFormEnt.style.display = "block"
        hideCadastro.style.display = "none"
    } else{
        alert("senha diferentes ou senha fraca (senha precisar ter um número, uma letra maiúscula e uma minúscula) ou RG e CPF inválidos.")
    }
    
})

entrarBtn.addEventListener("click", handleEntrar);
entrarBtn.addEventListener("touchstart", handleEntrar);
function handleEntrar(e){
    e.preventDefault()
    
    // Pega os dados salvos no localStorage
    const dadosSalvos = pegarDados();
    const usuario = dadosSalvos.find(user => user.email === emailInput.value)

    if(usuario) {
       const senhaDescriptografada = descriptografar(usuario.senha);
        if(nameInput.value === usuario.nome && senhaInput.value === senhaDescriptografada) {
            
               hideFormEnt.style.display = "none";
               hideCadastro.style.display = "none";
               hideDados.style.display = "block";

               dataNas.value = usuario.dataNascimento;
           cpf.value = descriptografar(usuario.cpf);
           RG.value = descriptografar(usuario.rg);
           nacionalidade.value = usuario.nacionalidade;
           estadoCivil.value = usuario.estadoCivil;
            
        } else {
            alert("Credenciais inválidas");
        }
    } else {
        alert("Nenhum usuário cadastrado");
    }
}
/*
entrarBtn.addEventListener("click", (e) =>{
   

   
})*/

editarBtn.addEventListener("click", () =>{

    const dadosSalvos = pegarDados();
    const usuarioExistente = dadosSalvos.find(user => user.email === emailInput.value);

    if (!usuarioExistente) return;

    const usuarioAtualizado = {
        ...usuarioExistente,
        dataNascimento: dataNas.value,
        cpf: criptografar(cpf.value),
        rg: criptografar(RG.value),
        nacionalidade: nacionalidade.value,
        estadoCivil: estadoCivil.value
    };

    atualizarLocalStorage(usuarioAtualizado);
    alert("Dados atualizados com sucesso!");

    
})
