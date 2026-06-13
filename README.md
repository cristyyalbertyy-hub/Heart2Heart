# Heart2Heart

App privada de conversa entre mãe e filho. Pensada para quem precisa de falar em privado no telemóvel, sem misturar com outras conversas no WhatsApp.

## O que faz

- **Login separado** — só a mãe e o filho têm conta
- **Chat privado** — mensagens só visíveis para quem está autenticado
- **Instalável no telemóvel** — funciona como app (PWA) no Android e iPhone
- **Apagar tudo com "Adeus"** — quando alguém envia exatamente a palavra `Adeus`, toda a conversa é eliminada

## Começar em desenvolvimento

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis

Copia `.env.example` para `.env` e personaliza as passwords:

```bash
cp .env.example .env
```

Edita o ficheiro `.env` com passwords fortes para a mãe e o filho.

### 3. Criar base de dados e contas

```bash
npm run db:setup
```

Isto cria a base de dados SQLite e as duas contas (mãe e filho).

> Se já tiveres a app a correr, podes repetir este comando em segurança — só recria/atualiza as contas.

### 4. Arrancar a app

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser ou no telemóvel (na mesma rede Wi‑Fi, usa o IP do computador, ex.: `http://192.168.1.10:3000`).

## Instalar no telemóvel

### iPhone (Safari)

1. Abre o site da app no Safari
2. Toca no botão **Partilhar** (quadrado com seta)
3. Escolhe **Adicionar ao Ecrã Principal**
4. Confirma — fica como uma app normal

### Android (Chrome)

1. Abre o site no Chrome
2. Menu (⋮) → **Adicionar ao ecrã inicial** ou **Instalar app**
3. Confirma

> Para instalar fora da rede local, precisas de publicar a app online (ver abaixo).

## Publicar online (Qatar ↔ Itália)

Usa o teu **GitHub** (código) + **Vercel** (app online) + **Neon** (mensagens, login com GitHub).

**Guia completo:** [DEPLOY.md](./DEPLOY.md)

Resumo:
1. Enviar projeto para o GitHub
2. Criar base de dados grátis no [Neon](https://neon.tech) (entra com GitHub)
3. Ligar repositório GitHub à Vercel
4. Correr `npm run db:setup:remote` para criar as contas
5. Enviar o link https://heart2heart-sepia.vercel.app à mãe e ao filho

## Como funciona o "Adeus"

Quando qualquer um dos dois envia uma mensagem que é **exatamente** `Adeus` (maiúsculas ou minúsculas), o servidor apaga **todas** as mensagens. A conversa fica vazia e podem começar de novo quando quiserem.

## Estrutura

```
src/
  app/
    login/     → página de entrada
    chat/      → conversa
    api/       → login, mensagens
  lib/         → autenticação, base de dados
prisma/        → schema e seed
public/        → ícone e manifest PWA
```

## Contas por defeito (desenvolvimento)

| Utilizador | Password (dev) |
|------------|----------------|
| `mae`      | `mae123`       |
| `filho`    | `filho123`     |

**Importante:** muda estas passwords antes de dar a app à tua amiga.
