
const formulario = document.getElementById("form-orcamento");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  // Captura os dados do formulário
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const datafesta = document.getElementById("datafesta").value;

  const campoEvento = document.getElementById("tipoevento");
  const tipoevento = campoEvento.options[campoEvento.selectedIndex].text;

  const quantidadepessoas = document.getElementById("quantidadepessoas").value;
  const produtosdesejados = document
    .getElementById("produtos-desejados")
    .value.trim();

  // Formata a data para o padrão brasileiro
  const dataFormatada = datafesta.split("-").reverse().join("/");

  // Monta a mensagem para o WhatsApp
  const mensagem = `Olá, Brasileirinho Empório!
Gostaria de solicitar um orçamento para uma festa.

Nome: ${nome}
Telefone: ${telefone}
Data da festa: ${dataFormatada}
Tipo de evento: ${tipoevento}
Quantidade de pessoas: ${quantidadepessoas}
Produtos desejados: ${produtosdesejados}`;

  // Exibe a mensagem no console para testes
  console.log(mensagem);

  // Codifica a mensagem para utilizar na URL
  const mensagemCodificada = encodeURIComponent(mensagem);

  // Número do WhatsApp do Brasileirinho
  const numeroWhatsApp = "5518991609705";

  // Cria o link com a mensagem preenchida
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

  // Abre o WhatsApp em uma nova aba
  window.open(url, "_blank");
});

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();

        abrirLoginAdmin();
    }
});

async function abrirLoginAdmin() {
    const email = prompt("Digite o e-mail do administrador:");

    if (email === null) return;

    const senha = prompt("Digite a senha do administrador:");

    if (senha === null) return;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password: senha
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    const { data: admin, error: erroAdmin } = await supabaseClient
        .from("administradores")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (erroAdmin || !admin) {
        await supabaseClient.auth.signOut();
        alert("Este usuário não possui permissão administrativa.");
        return;
    }

    window.location.href = "admin.html"; 
}




async function carregarProdutosPublicos() {
    const container = document.getElementById("lista-produtos-publicos");

    if (!container) return;

    const { data: produtos, error } = await supabaseClient
        .from("produtos")
        .select("id, nome, descricao, categoria, imagem")
        .eq("ativo", true)
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao carregar produtos:", error);
        container.textContent = "Não foi possível carregar os produtos.";
        return;
    }

    container.replaceChildren();

    if (produtos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum produto cadastrado no momento.";
        container.appendChild(mensagem);
        return;
    }

    produtos.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "card-produto";

        if (produto.imagem) {
            const imagem = document.createElement("img");
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;
            imagem.loading = "lazy";
            card.appendChild(imagem);
        }

        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;
        card.appendChild(titulo);

        if (produto.descricao) {
            const descricao = document.createElement("p");
            descricao.className = "descricao-produto";
            descricao.textContent = produto.descricao;
            card.appendChild(descricao);
        }

        container.appendChild(card);
    });
}

carregarProdutosPublicos();
