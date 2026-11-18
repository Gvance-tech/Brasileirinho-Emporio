async function verificarAdministrador() {
    const { data: { user }, error } =
        await supabaseClient.auth.getUser();

    if (error || !user) {
        window.location.replace("index.html");
        return;
    }

    const { data: admin, error: erroAdmin } = await supabaseClient
        .from("administradores")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (erroAdmin || !admin) {
        window.location.replace("index.html");
        return;
    }

    document.getElementById("painel-admin").hidden = false;
    await carregarProdutosAdmin();
}

verificarAdministrador();

document.getElementById("sair-admin").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.replace("index.html");
});
const tipoImagem = document.getElementById("tipo-imagem");
const campoUrl = document.getElementById("campo-url");
const campoArquivo = document.getElementById("campo-arquivo");

tipoImagem.addEventListener("change", function () {
    const usarArquivo = tipoImagem.value === "arquivo";

    campoUrl.hidden = usarArquivo;
    campoArquivo.hidden = !usarArquivo;
});


const formProduto = document.getElementById("form-produto");

formProduto.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome-produto").value.trim();
    const categoria = document.getElementById("categoria-produto").value.trim();
    const descricao = document.getElementById("descricao-produto").value.trim();
    const tipoImagem = document.getElementById("tipo-imagem").value;

    const botao = formProduto.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = "Cadastrando...";

    try {
        let imagem = null;

        if (tipoImagem === "url") {
            imagem = document.getElementById("imagem-produto").value.trim();

            if (imagem && !/^https?:\/\//i.test(imagem)) {
                throw new Error("Informe uma URL válida.");
            }
        } else {
            const arquivo = document.getElementById("arquivo-produto").files[0];

            if (!arquivo) {
                throw new Error("Selecione uma imagem.");
            }

            const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

            if (!tiposPermitidos.includes(arquivo.type)) {
                throw new Error("Utilize uma imagem JPG, PNG ou WebP.");
            }

            if (arquivo.size > 5 * 1024 * 1024) {
                throw new Error("A imagem deve ter no máximo 5 MB.");
            }

            const extensao = {
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/webp": "webp"
            }[arquivo.type];

            const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;

            const { error: erroUpload } = await supabaseClient.storage
                .from("produtos")
                .upload(nomeArquivo, arquivo, {
                    contentType: arquivo.type,
                    upsert: false
                });

            if (erroUpload) {
                throw erroUpload;
            }

            const { data } = supabaseClient.storage
                .from("produtos")
                .getPublicUrl(nomeArquivo);

            imagem = data.publicUrl;
        }

        const { error } = await supabaseClient
            .from("produtos")
            .insert({
                nome,
                categoria,
                descricao,
                imagem,
                ativo: true
            });

        if (error) {
            throw error;
        }

        alert("Produto cadastrado com sucesso!");
        await carregarProdutosAdmin();

        formProduto.reset();
        document.getElementById("campo-url").hidden = false;
        document.getElementById("campo-arquivo").hidden = true;

    } catch (erro) {
        console.error("Erro ao cadastrar produto:", erro);
        alert("Erro ao cadastrar: " + erro.message);
    } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar produto";
    }
});




async function carregarProdutosAdmin() {
    const lista = document.getElementById("lista-produtos");

    lista.textContent = "Carregando produtos...";

    const { data: produtos, error } = await supabaseClient
        .from("produtos")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error(error);
        lista.textContent = "Erro ao carregar produtos.";
        return;
    }

    lista.replaceChildren();

    if (produtos.length === 0) {
        lista.textContent = "Nenhum produto cadastrado.";
        return;
    }

    produtos.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "produto-admin";

        const informacoes = document.createElement("div");
        informacoes.className = "produto-admin-info";

        if (produto.imagem) {
            const imagem = document.createElement("img");
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;
            informacoes.appendChild(imagem);
        }

        const detalhes = document.createElement("div");

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const categoria = document.createElement("p");
        categoria.textContent = produto.categoria;

        const status = document.createElement("p");
        status.textContent = produto.ativo ? "Visível no site" : "Oculto";

        detalhes.append(nome, categoria, status);
        informacoes.appendChild(detalhes);

        const acoes = document.createElement("div");
        acoes.className = "acoes-produto";

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.onclick = () => editarProduto(produto);

        const visibilidade = document.createElement("button");
        visibilidade.textContent = produto.ativo ? "Ocultar" : "Mostrar";
        visibilidade.onclick = () => alterarVisibilidade(produto);

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.onclick = () => excluirProduto(produto);

        acoes.append(editar, visibilidade, excluir);
        card.append(informacoes, acoes);
        lista.appendChild(card);
    });
}

async function alterarVisibilidade(produto) {
    const { error } = await supabaseClient
        .from("produtos")
        .update({ ativo: !produto.ativo })
        .eq("id", produto.id)
        .select("id");

    if (error) {
        alert("Erro: " + error.message);
        return;
    }

    await carregarProdutosAdmin();
}

async function excluirProduto(produto) {
    if (!confirm(`Deseja realmente excluir "${produto.nome}"?`)) {
        return;
    }

    const { error } = await supabaseClient
        .from("produtos")
        .delete()
        .eq("id", produto.id)
        .select("id");

    if (error) {
        alert("Erro: " + error.message);
        return;
    }

    await carregarProdutosAdmin();
}

async function editarProduto(produto) {
    const nome = prompt("Nome do produto:", produto.nome);
    if (nome === null) return;

    const categoria = prompt("Categoria:", produto.categoria);
    if (categoria === null) return;

    const descricao = prompt("Descrição:", produto.descricao || "");
    if (descricao === null) return;

    if (!nome.trim() || !categoria.trim()) {
        alert("Nome e categoria são obrigatórios.");
        return;
    }

    const { error } = await supabaseClient
        .from("produtos")
        .update({
            nome: nome.trim(),
            categoria: categoria.trim(),
            descricao: descricao.trim()
        })
        .eq("id", produto.id)
        .select("id");

    if (error) {
        alert("Erro: " + error.message);
        return;
    }

    await carregarProdutosAdmin();
}
