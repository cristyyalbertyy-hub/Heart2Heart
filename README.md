# talk-to-2

Conversa privada entre duas pessoas. Uma cria a sala, a outra entra com um código.

## O que faz

- **Criar conversa** — escolhes um nome e um PIN de 4 dígitos, e recebes um código
- **Entrar** — a outra pessoa usa o código (ou o link `/r/CODIGO`) e o próprio PIN
- **Só a dois** — cada sala aceita no máximo duas pessoas
- **Instalável no telemóvel** — funciona como app (PWA) no Android e iPhone
- **Apagar tudo** — se alguém enviar exatamente `Adeus` ou `goodbye`, as mensagens dessa conversa desaparecem

## Começar em desenvolvimento

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis

Cria um ficheiro `.env` com:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="uma-frase-longa-e-secreta"
```

### 3. Criar o esquema da base de dados

```bash
npm run db:setup
```

### 4. Arrancar a app

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Instalar no telemóvel

### iPhone (Safari)

1. Abre o site da app no Safari
2. Toca no botão **Partilhar** (quadrado com seta)
3. Escolhe **Adicionar ao Ecrã Principal**

### Android (Chrome)

1. Abre o site no Chrome
2. Menu (⋮) → **Adicionar ao ecrã inicial** ou **Instalar app**

## Publicar online

Usa **GitHub** (código) + **Vercel** (app) + **Neon** (mensagens).

**Guia:** [DEPLOY.md](./DEPLOY.md)

Já não são precisas contas pré-criadas. Quem quiser falar cria uma conversa e partilha o código.

## Estrutura

```
src/
  app/
    page.tsx     → criar / entrar
    r/[code]     → convite por link
    chat/        → conversa
    api/         → salas, mensagens, sessão
  lib/           → autenticação, salas, base de dados
prisma/          → schema
public/          → ícone e manifest PWA
```
