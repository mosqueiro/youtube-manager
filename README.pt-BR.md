# 📺 YouTube Manager

> Um calendário visual para acompanhar seus canais do YouTube. Veja todos os vídeos publicados, defina metas diárias de upload e nunca perca uma postagem.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

🌐 [English](README.md)

---

## 📸 Screenshots

![Calendário — Visualização semanal com vídeos por canal](images/1.png)

![Canais — Todos os canais acompanhados](images/2.png)

![Configurações — Adicionar canais, fuso horário, status do sync](images/3.png)

---

## ✨ O Que Você Pode Fazer?

### 📅 Veja Todos os Seus Canais em Um Calendário
Navegue por um **calendário semanal** que mostra cada vídeo publicado pelos canais que você acompanha. Cada canal tem sua própria linha com uma cor única, para você identificar instantaneamente quem postou o quê e quando.

### 🎯 Defina Metas Diárias de Upload
Para cada canal, defina quantos vídeos por dia você espera. O calendário mostra **slots âmbar "Precisa de vídeo"** para dias com uploads faltando, e **slots "Perdido"** para dias passados que não bateram a meta. Perfeito para criadores de conteúdo acompanhando seus próprios canais ou de olho nos concorrentes.

### 📊 Veja Estatísticas Completas
Clique em qualquer vídeo para ver todos os detalhes — **visualizações, curtidas, comentários, duração, descrição** e um link direto para assistir no YouTube. Todas as estatísticas são salvas localmente para você consultar a qualquer hora.

### 🔄 Sincronize Quando Quiser
Clique no botão **Sync** para buscar os dados mais recentes do YouTube. O app salva tudo localmente, então você só gasta cota da API do YouTube quando sincroniza — navegar no calendário depois disso é de graça.

### 🌍 Seu Fuso Horário, Sua Agenda
Configure seu fuso horário nas Configurações e todos os horários de publicação serão exibidos de acordo. Suporta todos os fusos de UTC-12 a UTC+12.

### 🌙 Modo Escuro e Claro
Alterne entre temas escuro e claro. O modo escuro usa as cores oficiais do YouTube para uma aparência nativa.

### 📱 Funciona no Desktop e Mobile
Navegação completa com sidebar no desktop, menu hambúrguer no mobile. O calendário se adapta ao tamanho da sua tela.

---

## 🚀 Como Começar

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (único requisito para instalação rápida)
- **Credenciais Google OAuth** (grátis — veja abaixo como conseguir)

Para desenvolvimento a partir do código fonte, você também precisa de:
- [**Node.js**](https://nodejs.org/) (v18 ou superior)

---

### 🔑 Como Configurar o Google OAuth (Grátis)

Você precisa de um Client ID e Secret do Google OAuth para o app buscar dados dos seus canais, incluindo **vídeos agendados e privados**. É grátis e leva uns 5 minutos:

#### 1. Criar um Projeto no Google Cloud

1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**
2. Faça login com sua conta Google
3. Clique em **"Selecionar um projeto"** no topo → depois **"Novo Projeto"**
4. Dê qualquer nome (ex: "YouTube Manager") e clique em **Criar**
5. Espere alguns segundos e certifique-se que o novo projeto está selecionado

#### 2. Ativar a YouTube API

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Pesquise por **"YouTube Data API v3"** e clique nela
3. Clique no botão azul **"Ativar"**

#### 3. Configurar a Tela de Consentimento OAuth

1. Vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"** (ou pesquise "Google Auth Platform")
2. Vá em **"Branding"** e preencha o nome do app e seu email
3. Vá em **"Audience"** → defina como **External** e deixe no modo **Testing** (não precisa verificar)
4. Em **"Test users"**, adicione seu email do Google

#### 4. Criar Credenciais OAuth

1. Vá em **"Clients"** (no menu lateral do Google Auth Platform)
2. Clique em **"+ Create Client"**
3. Tipo de aplicativo: **Web application**
4. Nome: qualquer um (ex: "YT Manager")
5. Em **"Authorized redirect URIs"**, clique em **"Add URI"** e coloque:
   ```
   http://localhost:3000/api/auth/callback
   ```
6. Clique em **Create**
7. Copie o **Client ID** e o **Client Secret** — você vai precisar deles! 🎉

> 💡 O plano gratuito dá **10.000 unidades/dia**, mais que suficiente. Cada sync gasta cerca de 3-5 unidades por canal.

> 💡 Se você tem múltiplos canais do YouTube (contas de marca), pode renomeá-los em [myaccount.google.com/brandaccounts](https://myaccount.google.com/brandaccounts) para facilitar a identificação durante o login OAuth.

---

### 📦 Instalação Rápida (Recomendado)

Execute **um único comando** — ele vai baixar tudo e iniciar o app automaticamente. No primeiro acesso pelo navegador, você insere suas credenciais Google OAuth.

#### 🍎 macOS / 🐧 Linux

```bash
curl -fsSL https://raw.githubusercontent.com/mosqueiro/youtube-manager/main/install/install.sh | bash
```

#### 🪟 Windows

1. Crie uma pasta no seu PC (ex: `C:\yt-manager`)
2. Baixe o **[install.zip](https://github.com/mosqueiro/youtube-manager/raw/main/install/install.zip)** e extraia o `install.bat` para dentro dessa pasta
3. Dê duplo clique no `install.bat` — ele configura tudo dentro dessa pasta

> O instalador vai: criar a pasta do projeto → baixar a imagem Docker → iniciar o app → abrir **http://localhost:3000** no seu navegador → você insere suas credenciais Google na tela de Setup. Pronto! 🎉

---

### 📦 Instalação Manual (Para Desenvolvedores)

Se preferir rodar a partir do código fonte:

**1. Clone o repositório**

```bash
git clone https://github.com/mosqueiro/youtube-manager.git
cd youtube-manager
```

**2. Instale as dependências**

```bash
npm install
```

**3. Inicie o app**

```bash
npm run dev
```

**4. Abra no navegador** em **http://localhost:3000** 🎉

No primeiro acesso, você será redirecionado para a **tela de Setup** onde insere seu Google OAuth Client ID e Client Secret. Eles são salvos no banco SQLite local — nenhum arquivo `.env` necessário!

> O banco de dados (SQLite) e as tabelas são criados automaticamente na pasta `data/` — não precisa de Docker ou banco externo para desenvolvimento!

---

## 📖 Como Usar

### ➕ Adicionando Canais

1. Vá em **Settings** (no menu lateral)
2. Na seção "Add Channel", cole qualquer um desses:
   - URL do canal (ex: `https://youtube.com/@MrBeast`)
   - Handle (ex: `@MrBeast`)
   - ID do canal (ex: `UCX6OQ3DkcsbYNE6H8uQQuVA`)
3. Clique em **Add** — o app busca automaticamente o nome, avatar e informações do canal

### 🔗 Conectando o Google (por canal)

Cada canal tem um botão **"Conectar com Google"**. Isso permite que o app veja seus **vídeos agendados e privados**:

1. Em **Settings** ou **Channels**, clique em **"Connect with Google"** no card do canal
2. O Google vai pedir para escolher uma conta e um canal (conta de marca) — escolha o correspondente
3. Autorize o app — o token é salvo automaticamente
4. No próximo **Sync**, os vídeos agendados aparecem no calendário com um badge amarelo "Agendado"

> Você precisa conectar cada canal separadamente, pois cada canal do YouTube pode pertencer a uma conta de marca diferente. Se o token expirar (após 7 dias no modo Testing), basta clicar em "Reconectar".

### 🔄 Sincronizando Vídeos

1. Clique no botão vermelho **Sync** no canto superior direito
2. Aguarde finalizar (você verá um spinner e depois "Done!" ✅)
3. O calendário atualiza automaticamente com os vídeos mais recentes

> Você só precisa sincronizar quando quiser dados atualizados. No resto do tempo, tudo é servido do seu banco local — rápido e grátis.

### 📅 Navegando no Calendário

- Use as setas **← →** ao lado da data para navegar entre semanas
- Alterne entre visualização **Semanal** e **Mensal** com os botões de toggle
- Cada canal é uma linha separada — olhe a borda colorida na esquerda para identificá-los
- Clique em qualquer **card de vídeo** para ver os detalhes completos (estatísticas, descrição, link do YouTube)

### 🎯 Definindo Metas de Upload

1. Vá em **Settings** e role até seus canais
2. Use os botões **+/-** ao lado de cada canal para definir a meta diária
3. Volte ao **Calendário** — agora você verá slots âmbar "Needs video" para dias abaixo da meta

### 🌍 Mudando o Fuso Horário

1. Vá em **Settings**
2. Selecione seu fuso horário no dropdown
3. Todos os horários dos vídeos no app atualizam instantaneamente

---

## ☁️ Deploy no EasyPanel

Se você tem um servidor com [EasyPanel](https://easypanel.io), pode fazer o deploy do YouTube Manager em poucos cliques.

### 1. Crie um novo projeto

- Abra o painel do EasyPanel
- Clique em **+ New Project** e nomeie como `youtube-manager`

### 2. Adicione o App

- Clique em **+ New Service** → **App**
- Vá na aba **Build** e selecione **GitHub**
- Preencha os campos:
  | Campo | Valor |
  |---|---|
  | Owner | `mosqueiro` |
  | Repository | `youtube-manager` |
  | Branch | `main` |
  | Path | `/` |
- O EasyPanel vai detectar o `Dockerfile` e buildar a imagem automaticamente

### 3. Configure Volumes

- Adicione um volume persistente para o banco SQLite: monte em `/app/data`
- Adicione um volume persistente para imagens: monte em `/app/public/images`

### 4. Configure Variáveis de Ambiente (opcional)

- Só necessário se seu domínio não for localhost:
  | Variável | Valor |
  |---|---|
  | `GOOGLE_REDIRECT_URI` | `https://seudominio.com/api/auth/callback` |

### 5. Configure o Domínio

- Vá na aba **Domains**
- Adicione seu domínio ou use a URL gerada automaticamente pelo EasyPanel
- Porta: **3000**

### 6. Deploy

- Clique em **Deploy** — o EasyPanel vai clonar o repo, buildar a imagem e iniciar o app
- Abra a URL — no primeiro acesso você insere suas credenciais Google na tela de Setup 🎉

> 💡 O EasyPanel cuida de SSL, reinícios automáticos e auto-deploy a cada novo commit.

---

## 🛑 Parar e Iniciar

```bash
cd ~/youtube-manager   # ou onde você instalou

docker compose down    # parar tudo
docker compose up -d   # iniciar novamente
```

Seus dados são preservados — não precisa sincronizar de novo! 🎉

---

## 🛠️ Feito Com

| | Tecnologia |
|---|-----------|
| ⚡ | Next.js 16 |
| 🔷 | TypeScript |
| 🎨 | Tailwind CSS 4 |
| 🗄️ | SQLite (better-sqlite3) |
| 📺 | YouTube Data API v3 |
| 📦 | Zustand |
| 📆 | date-fns |
| 🎯 | Lucide React icons |

---

## ❓ FAQ

**P: O Google OAuth é grátis?**
Sim! O Google dá 10.000 unidades gratuitas por dia. Cada sync gasta cerca de 3-5 unidades por canal, então você precisaria sincronizar centenas de canais diariamente para atingir o limite.

**P: O app publica ou modifica algo no YouTube?**
Não. É completamente **somente leitura**. Ele usa o scope `youtube.readonly` — só pode ler dados. Não pode publicar, excluir ou modificar nada na sua conta do YouTube.

**P: Consigo ver vídeos agendados/privados?**
Sim! Clique em **"Connect with Google"** no card de cada canal. Uma vez conectado, o app consegue ver vídeos agendados e mostra no calendário com um badge amarelo "Agendado".

**P: Onde meus dados são armazenados?**
Tudo é armazenado em um **banco SQLite local** (`data/youtube-manager.db`). No Docker, isso é persistido pelo volume `data`. Nada é enviado para servidores externos (exceto as chamadas à API do YouTube durante o sync).

**P: Onde ficam minhas credenciais Google?**
Seu Google OAuth Client ID e Client Secret são armazenados no banco SQLite (na tabela `settings`). Nenhum arquivo `.env` é necessário.

**P: Quantos vídeos ele busca por canal?**
Os últimos **50 vídeos** por canal a cada sync.

**P: Posso adicionar qualquer canal do YouTube?**
Sim, qualquer canal público — seu ou de qualquer outra pessoa. Para ver vídeos agendados, você precisa conectar via Google e ser dono do canal.

**P: O token OAuth expirou, o que faço?**
No modo Testing, os tokens do Google expiram após 7 dias. Basta clicar em **"Reconectar"** no card do canal em Settings para re-autorizar.

---

## 📄 Licença

MIT

---

<p align="center">
  Feito com ❤️ e ☕<br/>
  Powered by <strong>YouTube Data API v3</strong> + <strong>Next.js</strong> + <strong>SQLite</strong>
</p>
