# 🇧🇷 Brasileirinho Empório

### Website Institucional e Sistema de Gerenciamento de Produtos

**Desenvolvido por GVance | Soluções Digitais**

O **Brasileirinho Empório** é um projeto web desenvolvido para apresentar o estabelecimento no ambiente digital, divulgar seus produtos e serviços e facilitar o contato com clientes.

Além de um site institucional responsivo, o projeto conta com um **sistema administrativo integrado ao Supabase**, permitindo que usuários autorizados cadastrem, editem, ocultem e excluam produtos sem precisar modificar o código-fonte.

---

## 📌 Sobre o Projeto

O objetivo do projeto é oferecer ao Brasileirinho Empório uma presença digital moderna, organizada e de fácil manutenção.

A solução foi desenvolvida com tecnologias web, priorizando navegação intuitiva, responsividade e gerenciamento simplificado do catálogo.

O sistema é dividido em dois ambientes:

- **Área pública:** destinada aos clientes, com informações do estabelecimento, catálogo de produtos e solicitação de orçamentos.
- **Área administrativa:** destinada aos responsáveis autorizados, com recursos de gerenciamento dos produtos.

## 🚀 Funcionalidades

### 🌐 Website Institucional

- Layout responsivo para computadores, tablets e smartphones.
- Navegação entre seções com rolagem suave.
- Apresentação do estabelecimento.
- Catálogo de produtos integrado ao banco de dados.
- Seção dedicada a festas e eventos.
- Formulário de solicitação de orçamento.
- Integração com WhatsApp.
- Integração com Instagram.
- Google Maps incorporado na seção de contato.
- Rodapé institucional com identificação da desenvolvedora.

### 📦 Catálogo Dinâmico

Os produtos são carregados diretamente do Supabase, sem necessidade de cadastrá-los manualmente no HTML.

Cada produto pode conter:

- Nome.
- Categoria.
- Descrição.
- Imagem.
- Status de visibilidade.

Os produtos cadastrados são armazenados em banco de dados e ficam disponíveis aos visitantes do site.

Produtos desativados deixam de aparecer no catálogo público, mas permanecem registrados no banco de dados.

### 🔐 Painel Administrativo

O projeto possui um painel de administração separado da interface pública.

No computador, o acesso é iniciado pelo atalho:

**`Ctrl + Alt + A`**

Esse atalho permite iniciar o processo de autenticação sem exibir um botão de login na página dos clientes.

Após a autenticação e a verificação de permissão, o administrador pode:

- Cadastrar produtos.
- Editar nome, categoria e descrição.
- Excluir produtos.
- Ocultar ou reexibir produtos.
- Visualizar os produtos registrados.
- Encerrar a sessão administrativa.

**Segurança:** o atalho não substitui a autenticação. O acesso e as operações administrativas dependem das credenciais do Supabase Auth e das políticas de segurança do banco de dados.

### 🖼️ Gerenciamento de Imagens

O cadastro de produtos oferece duas formas de informar imagens:

**1. Imagem por URL**

O administrador pode informar o endereço de uma imagem hospedada na internet.

**2. Upload de arquivo**

O administrador pode selecionar uma imagem do dispositivo, que será enviada ao Supabase Storage.

Formatos aceitos:

- JPG/JPEG.
- PNG.
- WebP.

Limite configurado: **5 MB por arquivo**.

As imagens enviadas são armazenadas no bucket público `produtos`, permitindo sua exibição no catálogo.

### 🎉 Orçamentos para Festas e Eventos

O site possui um formulário para solicitações de orçamento relacionadas a festas e eventos.

O formulário coleta:

- Nome do cliente.
- Telefone para contato.
- Data da festa.
- Tipo de evento.
- Quantidade de pessoas.
- Produtos desejados.

Após o preenchimento, o JavaScript organiza as informações e abre uma conversa no WhatsApp com uma mensagem previamente formatada.

**Observação:** o serviço de entrega do estabelecimento é voltado a festas e eventos, não a entregas convencionais de produtos.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura e conteúdo das páginas |
| CSS3 | Estilização, layout e responsividade |
| JavaScript | Interatividade, formulários e integração com APIs |
| Supabase | Serviços de backend gerenciados |
| PostgreSQL | Armazenamento dos dados dos produtos |
| Supabase Auth | Autenticação dos administradores |
| Supabase Storage | Armazenamento de imagens |
| Supabase RLS | Controle de acesso aos dados |
| WhatsApp | Recebimento das solicitações de orçamento |
| Google Maps | Exibição da localização do estabelecimento |

O projeto utiliza **JavaScript puro (Vanilla JavaScript)**, sem a necessidade de frameworks de interface.

## 📁 Estrutura do Projeto

```text
brasileirinho-emporio/
│
├── index.html
├── admin.html
│
├── style.css
├── script.js
├── admin.js
├── supabase-config.js
│
└── assets/
    ├── logo.png
    └── ...imagens do projeto
```

### Principais arquivos

- `index.html`: página pública do estabelecimento.
- `admin.html`: estrutura do painel administrativo.
- `style.css`: estilização do website e dos componentes.
- `script.js`: funcionalidades da área pública, formulário de orçamento e acesso administrativo.
- `admin.js`: autenticação do painel e gerenciamento dos produtos.
- `supabase-config.js`: inicialização do cliente Supabase.
- `assets/`: recursos visuais utilizados no website.

---

## 🗄️ Banco de Dados

O sistema utiliza o PostgreSQL disponibilizado pelo Supabase.

### Tabela `produtos`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | BIGINT | Identificador único |
| `nome` | TEXT | Nome do produto |
| `descricao` | TEXT | Descrição do produto |
| `categoria` | TEXT | Categoria |
| `imagem` | TEXT | URL da imagem |
| `ativo` | BOOLEAN | Controle de visibilidade |
| `criado_em` | TIMESTAMPTZ | Data de cadastro |

### Tabela `administradores`

| Campo | Tipo | Descrição |
|---|---|---|
| `user_id` | UUID | Identificador do usuário autorizado |

A tabela `administradores` referencia os usuários cadastrados no Supabase Auth.

### Controle de Acesso

O banco utiliza **Row Level Security (RLS)** para controlar as operações:

- Visitantes podem consultar produtos ativos.
- Administradores autorizados podem consultar todos os produtos.
- Somente administradores autorizados podem cadastrar, atualizar e excluir produtos.

O Supabase Storage também possui uma política que restringe o envio de imagens aos administradores autorizados.

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Navegador atualizado.
- Editor de código, como Visual Studio Code.
- Projeto configurado no Supabase.
- Tabelas, políticas e bucket de armazenamento criados.

### 1. Obtenha os arquivos

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Ou baixe os arquivos do projeto.

### 2. Configure o Supabase

No arquivo `supabase-config.js`, informe os dados públicos do projeto:

```javascript
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";

const SUPABASE_KEY = "SUA_CHAVE_PUBLICA";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
```

Substitua os valores pelos fornecidos no painel do Supabase.

**Importante:** utilize somente a chave pública (`publishable` ou `anon`). Nunca disponibilize uma chave `service_role`, uma chave secreta ou senhas de usuários no código do navegador.

### 3. Execute o projeto

Abra o `index.html` utilizando um servidor local de desenvolvimento, como o Live Server do VS Code.

O site consultará o Supabase para carregar o catálogo de produtos.

### 4. Acesse a administração

1. Abra a página pública.
2. Pressione `Ctrl + Alt + A`.
3. Informe as credenciais do administrador.
4. Aguarde a verificação de autorização.
5. Acesse o painel administrativo.

O usuário precisa estar registrado no Supabase Auth e autorizado na tabela `administradores`.

---

## 🔄 Funcionamento do Sistema

```text
                  CLIENTE
                     |
                     v
              Site Institucional
                     |
           +---------+----------+
           |                    |
           v                    v
    Visualizar Produtos   Solicitar Orçamento
           |                    |
           v                    v
       Supabase              WhatsApp


                ADMINISTRADOR
                     |
                     v
              Ctrl + Alt + A
                     |
                     v
               Supabase Auth
                     |
                     v
           Verificação de Permissão
                     |
                     v
           Painel Administrativo
                     |
          +----------+-----------+
          |                      |
          v                      v
   Gerenciar Produtos      Enviar Imagens
          |                      |
          v                      v
      PostgreSQL          Supabase Storage
```

## 📱 Responsividade

O website foi desenvolvido com layouts adaptáveis a diferentes resoluções.

Foram utilizados recursos como:

- CSS Flexbox.
- CSS Grid.
- Media queries.
- Imagens responsivas.
- Formulários adaptáveis.
- Organização dos cartões em diferentes quantidades de colunas.

A navegação pública foi testada em visualização de dispositivos móveis.

## 🔒 Segurança

O projeto utiliza autenticação e políticas de acesso para proteger os dados administrativos.

As principais medidas implementadas incluem:

- Autenticação pelo Supabase Auth.
- Identificação dos administradores autorizados.
- Políticas RLS nas tabelas.
- Restrições de upload no Supabase Storage.
- Verificação de autorização antes de exibir o painel.
- Separação entre área pública e administrativa.

**Observação de segurança:** a versão atual utiliza janelas nativas `prompt()` para o login administrativo e para a edição de alguns dados. Recomenda-se substituir a entrada de senha por um formulário HTML com campo `type="password"` antes da disponibilização em produção.

O endereço do painel e o atalho de teclado não devem ser considerados mecanismos de proteção por si só.

## 📋 Status do Projeto

**Estado atual: desenvolvimento funcional, em preparação para publicação.**

| Funcionalidade | Status |
|---|---|
| Website institucional | ✅ Implementado |
| Responsividade | ✅ Testada |
| Formulário para eventos | ✅ Funcional |
| Integração com WhatsApp | ✅ Funcional |
| Integração com Google Maps | ✅ Implementada |
| Catálogo dinâmico | ✅ Funcional |
| Login administrativo | ✅ Funcional |
| Cadastro de produtos | ✅ Funcional |
| Upload de imagens | ✅ Funcional |
| Edição de produtos | ✅ Funcional |
| Exclusão de produtos | ✅ Funcional |
| Controle de visibilidade | ✅ Funcional |
| Edição de imagens existentes | 📌 Melhoria futura |
| Login adaptado para celular | 📌 Melhoria futura |
| Publicação em hospedagem | ⏳ Pendente |
| Domínio personalizado | ⏳ Pendente |

## 🔮 Melhorias Futuras

Entre as possíveis evoluções do sistema estão:

- Substituição das janelas nativas por formulários e modais personalizados.
- Interface de login acessível em dispositivos móveis.
- Edição e substituição das imagens dos produtos.
- Pesquisa e filtros por categoria no painel.
- Melhorias de SEO e desempenho.
- Otimização das imagens.
- Organização e refinamento visual do painel administrativo.

---

## 👨‍💻 Desenvolvimento

**GVance — Soluções Digitais**

Projeto desenvolvido como uma solução digital personalizada para o Brasileirinho Empório, com foco em presença online, divulgação de produtos e autonomia no gerenciamento do catálogo.

**Tecnologias principais:** HTML5, CSS3, JavaScript e Supabase.

**Ano de desenvolvimento:** 2026.

---

© 2026 GVance. Documentação do projeto Brasileirinho Empório.