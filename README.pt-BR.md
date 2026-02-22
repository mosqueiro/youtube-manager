# 📺 YouTube Manager

> Um calendário visual para acompanhar seus canais do YouTube. Veja todos os vídeos publicados, defina metas diárias de upload e nunca perca uma postagem.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

🌐 [English](README.md)

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

- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (obrigatório)
- Uma **chave da YouTube API** (grátis — veja abaixo como conseguir)

---

### 🔑 Como Conseguir uma Chave da YouTube API (Grátis)

Você precisa de uma chave da YouTube API para o app buscar dados de canais e vídeos. É grátis e leva uns 2 minutos:

1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**
2. Faça login com sua conta Google
3. Clique em **"Selecionar um projeto"** no topo → depois **"Novo Projeto"**
4. Dê qualquer nome (ex: "YouTube Manager") e clique em **Criar**
5. Espere alguns segundos e certifique-se que o novo projeto está selecionado no topo
6. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
7. Pesquise por **"YouTube Data API v3"** e clique nela
8. Clique no botão azul **"Ativar"**
9. Agora vá em **"APIs e Serviços"** → **"Credenciais"** (no menu lateral)
10. Clique em **"+ Criar Credenciais"** → **"Chave de API"**
11. Copie a chave que aparecer — essa é sua `YOUTUBE_API_KEY`! 🎉

> 💡 O plano gratuito dá **10.000 unidades/dia**, mais que suficiente. Cada sync gasta cerca de 3-5 unidades por canal.

---

### 📦 Instalação Rápida (Recomendado)

Execute **um único comando** — ele vai pedir sua chave da API, baixar tudo e iniciar o app automaticamente.

#### 🍎 macOS / 🐧 Linux

```bash
curl -fsSL https://raw.githubusercontent.com/mosqueiro/youtube-manager/main/install/install.sh | bash
```

#### 🪟 Windows

**Opção A** — Baixe e dê duplo clique:

1. Baixe o **[install.zip](https://github.com/mosqueiro/youtube-manager/raw/main/install/install.zip)**
2. Extraia e dê duplo clique no `install.bat`

**Opção B** — PowerShell:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/mosqueiro/youtube-manager/main/install/install.bat" -OutFile install.bat; .\install.bat
```

> O instalador vai: pedir sua chave da API → criar a pasta do projeto → baixar as imagens Docker → iniciar o PostgreSQL + o app → abrir **http://localhost:3000** no seu navegador. Pronto! 🎉

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

**3. Configure o ambiente**

```bash
cp .env.example .env.local
```

Abra o `.env.local` e cole sua chave da YouTube API:

```env
YOUTUBE_API_KEY=cole_sua_chave_aqui
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/youtube_manager
```

**4. Inicie o banco de dados**

```bash
docker compose up -d
```

**5. Inicie o app**

```bash
npm run dev
```

**6. Abra no navegador** em **http://localhost:3000** 🎉

> As tabelas do banco são criadas automaticamente — nenhuma configuração extra necessária!

---

## 📖 Como Usar

### ➕ Adicionando Canais

1. Vá em **Settings** (no menu lateral)
2. Na seção "Add Channel", cole qualquer um desses:
   - URL do canal (ex: `https://youtube.com/@MrBeast`)
   - Handle (ex: `@MrBeast`)
   - ID do canal (ex: `UCX6OQ3DkcsbYNE6H8uQQuVA`)
3. Clique em **Add** — o app busca automaticamente o nome, avatar e informações do canal

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

### 2. Adicione o PostgreSQL

- Dentro do projeto, clique em **+ New Service** → **Postgres**
- Mantenha as configurações padrão (o EasyPanel cria o banco automaticamente)
- Copie a **URL de conexão interna** — você vai precisar no passo 4

### 3. Adicione o App

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

### 4. Configure as Variáveis de Ambiente

- Vá na aba **Environment** e adicione:
  | Variável | Valor |
  |---|---|
  | `DATABASE_URL` | A URL de conexão do PostgreSQL do passo 2 |
  | `YOUTUBE_API_KEY` | Sua chave da YouTube API |

### 5. Configure o Domínio

- Vá na aba **Domains**
- Adicione seu domínio ou use a URL gerada automaticamente pelo EasyPanel
- Porta: **3000**

### 6. Deploy

- Clique em **Deploy** — o EasyPanel vai clonar o repo, buildar a imagem e conectar ao PostgreSQL
- Abra a URL e pronto! 🎉

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
| 🐘 | PostgreSQL 16 |
| 📺 | YouTube Data API v3 |
| 📦 | Zustand |
| 📆 | date-fns |
| 🎯 | Lucide React icons |

---

## ❓ FAQ

**P: A chave da YouTube API é grátis?**
Sim! O Google dá 10.000 unidades gratuitas por dia. Cada sync gasta cerca de 3-5 unidades por canal, então você precisaria sincronizar centenas de canais diariamente para atingir o limite.

**P: O app publica ou modifica algo no YouTube?**
Não. É completamente **somente leitura**. Ele só busca dados públicos (títulos, thumbnails, estatísticas). Não pode publicar, excluir ou modificar nada na sua conta do YouTube.

**P: Onde meus dados são armazenados?**
Tudo é armazenado em um **banco PostgreSQL local** rodando no Docker na sua máquina. Nada é enviado para servidores externos (exceto as chamadas à API do YouTube durante o sync).

**P: Quantos vídeos ele busca por canal?**
Os últimos **50 vídeos** por canal a cada sync.

**P: Posso adicionar qualquer canal do YouTube?**
Sim, qualquer canal público — seu ou de qualquer outra pessoa.

---

## 📄 Licença

MIT

---

<p align="center">
  Feito com ❤️ e ☕<br/>
  Powered by <strong>YouTube Data API v3</strong> + <strong>Next.js</strong> + <strong>PostgreSQL</strong>
</p>
