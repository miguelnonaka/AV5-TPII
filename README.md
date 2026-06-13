# AV5-TPII - Atlantis

Sistema Atlantis migrado para aplicacao web, com backend em Node.js/TypeScript, banco MySQL via Prisma e frontend em Next.js.

## Como executar o projeto

### 1. Clone o repositorio

```bash
git clone <url-do-repositorio>
cd AV5-TPII
```

### 2. Configure o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `backend` com a conexao do MySQL:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/atlantis"
```

Exemplo:

```env
DATABASE_URL="mysql://root:senha@localhost:3306/atlantis"
```

### 3. Crie as tabelas no banco

Ainda dentro de `backend`, rode:

```bash
npm run prisma:migrate
```

No Windows, se o PowerShell bloquear `npm`, use:

```bash
npm.cmd run prisma:migrate
```

### 4. Cadastre dados iniciais

O seed cria:

- 6 acomodacoes padrao da AV3
- titulares
- dependentes
- documentos
- telefones
- enderecos
- hospedagens de exemplo

Rode:

```bash
npm run seed
```

Ou, no Windows:

```bash
npm.cmd run seed
```

### 5. Rode o backend

```bash
npm run dev
```

Ou:

```bash
npm.cmd run dev
```

O backend ficara disponivel em:

```text
http://localhost:3000
```

## Rodando o frontend

Abra outro terminal na raiz do projeto e entre na pasta do frontend:

```bash
cd frontend/atlantis
```

Instale as dependencias:

```bash
npm install
```

Rode o frontend:

```bash
npm run dev -- -p 3001
```

Ou, no Windows:

```bash
npm.cmd run dev -- -p 3001
```

Acesse:

```text
http://localhost:3001
```

## Comandos uteis

Backend:

```bash
cd backend
npm run build
npm run prisma:studio
npm run seed
```

Frontend:

```bash
cd frontend/atlantis
npm run lint
npm run build
```
