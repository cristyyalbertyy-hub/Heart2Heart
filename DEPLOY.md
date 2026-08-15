# Publicar same-room — GitHub + Vercel + Neon

Guia para publicar a app usando o teu GitHub (como as tuas outras apps).

**Custo:** grátis  
**Tempo:** ~15 minutos

---

## Como funciona (3 peças)

| Serviço | O que faz |
|---------|-----------|
| **GitHub** | Guarda o código da app |
| **Vercel** | Publica a app online (liga ao GitHub) |
| **Neon** | Guarda as mensagens (base de dados PostgreSQL grátis, login com GitHub) |

> O GitHub **não pode** guardar mensagens em tempo real — só o código. Para as mensagens usamos o **Neon**, que também entras com a conta GitHub.

**URL da app:** https://sameroom.vercel.app

---

## Passo 1 — Enviar código para o GitHub

1. Vai a [github.com/new](https://github.com/new)
2. Cria repositório **Heart2Heart** (privado recomendado)
3. No terminal, na pasta do projeto:

```bash
git add .
git commit -m "Heart2Heart: app privada mãe-filho"
git branch -M main
git remote add origin https://github.com/TEU_USER/Heart2Heart.git
git push -u origin main
```

Substitui `TEU_USER` pelo teu utilizador GitHub.

---

## Passo 2 — Criar base de dados no Neon (com GitHub)

1. Vai a [neon.tech](https://neon.tech) e clica **Sign up with GitHub**
2. **New Project** → nome: `heart2heart`
3. Região: **Frankfurt** (boa para Qatar e Itália)
4. No dashboard, copia as connection strings:
   - **Pooled connection** → vai para `DATABASE_URL`
   - **Direct connection** → vai para `DIRECT_URL`

---

## Passo 3 — Ligar GitHub à Vercel

1. Vai a [vercel.com](https://vercel.com) → projeto **heart2heart**
2. **Settings → Git** → **Connect Git Repository**
3. Escolhe o repositório **Heart2Heart** no GitHub
4. A partir daí, cada `git push` atualiza a app automaticamente

---

## Passo 4 — Variáveis de ambiente na Vercel

Em **Settings → Environment Variables**, adiciona:

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | pooled connection do Neon |
| `DIRECT_URL` | direct connection do Neon |
| `JWT_SECRET` | frase longa aleatória |

Depois: **Deployments → ⋮ → Redeploy**

---

## Passo 5 — Criar tabelas

No teu computador, edita o `.env` com `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET`, depois corre:

```bash
npm run db:setup:remote
```

---

## Passo 6 — Testar

1. Abre a URL da Vercel
2. Cria uma conversa, copia o código e entra noutro browser
3. Envia mensagens e testa **Adeus**

---

## Instalar no telemóvel

**iPhone:** Safari → Partilhar → Adicionar ao Ecrã Principal  
**Android:** Chrome → Menu → Adicionar ao ecrã inicial

---

## Alternativa: Postgres direto na Vercel

Se preferires não usar Neon separado:

1. Na Vercel → projeto **heart2heart** → **Storage** → **Create Database** → Postgres
2. A Vercel cria automaticamente `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING`
3. Mapeia na Vercel:
   - `DATABASE_URL` = valor de `POSTGRES_PRISMA_URL`
   - `DIRECT_URL` = valor de `POSTGRES_URL_NON_POOLING`

---

## Problemas comuns

**"Não encontrámos essa conversa"** → Confirma o código de 6 caracteres

**Erro 500** → Verifica `DATABASE_URL` e `DIRECT_URL` na Vercel

**Mensagens não aparecem** → Espera 2–3 segundos ou recarrega
