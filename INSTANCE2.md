# Heart2Heart — 2ª instância (para a amiga)

## Instância 1 (tua / teste)
- **URL:** https://heart2heart-sepia.vercel.app
- **Contas:** Heart1 / Heart2

## Instância 2 (amiga + filho)
- **URL:** https://heart2heart-family.vercel.app *(após configurar)*
- **Contas:** ver abaixo

---

## Passo 1 — Criar 2.ª base de dados no Neon

1. [console.neon.tech](https://console.neon.tech)
2. **New Project** → nome: `heart2heart-family`
3. Região: **Frankfurt**
4. Copia **Pooled** → `DATABASE_URL`
5. Copia **Direct** (pooling OFF + Show password) → `DIRECT_URL`

Cola no ficheiro `.env.family` nesta pasta (copia de `.env.family.example`).

---

## Passo 2 — Criar contas

```bash
npm run db:setup:family
```

---

## Contas da instância 2

| Quem | Username | Password |
|------|----------|----------|
| Mãe | Sofia | sofia2026 |
| Filho | Lucas | lucas2026 |

*(Podes mudar em `.env.family` antes de correr o setup)*

---

## Passo 3 — Variáveis na Vercel

Projeto **heart2heart-family** → Settings → Environment Variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET` (usa um segredo diferente da instância 1)
- `MAE_USERNAME`, `MAE_PASSWORD`, `MAE_NAME`
- `FILHO_USERNAME`, `FILHO_PASSWORD`, `FILHO_NAME`

Depois **Redeploy**.

---

## Comando rápido (depois do .env.family preenchido)

```bash
npm run setup:family
```

Este comando cria a base de dados, envia variáveis para a Vercel e faz deploy.
