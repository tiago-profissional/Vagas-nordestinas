# Vagas Nordestinas

Plataforma de vagas (job board) com foco no Nordeste do Brasil. Candidatos buscam vagas e se candidatam; recrutadores publicam e gerenciam as vagas.

> **Status:** em desenvolvimento. Veja a tabela de status mais abaixo.

> **Online:** https://vagasnordestinas.com/
> **Análise de currículo com IA:** https://app.vagasnordestinas.com/dashboard

<!-- TODO: tire 2 ou 3 prints, salve em docs/images/ e linke aqui, por exemplo:
![Lista de vagas](docs/images/vagas.png) -->
<!-- TODO: coloque aqui o link do vídeo de demonstração quando ele existir. Não deixe link de exemplo. -->

## O que funciona hoje

- Cadastro e login de usuários
- Listagem e pesquisa de vagas, com filtros por cargo, localização e modalidade, e página de detalhe
- Criar, editar e excluir vagas (com confirmação antes de excluir), com painel (dashboard) para gerenciá-las
- Análise de currículo com IA, primeira versão: o usuário envia o currículo e vê dados profissionais, experiências e habilidades detectadas
- Termos de uso e política de privacidade, com consentimento
- Interface responsiva, com tratamento de carregamento e de erros
- Página 404

<!-- TODO: confira item por item no navegador. Só deixe aqui o que realmente funciona hoje. -->

## Arquitetura

- **Em desenvolvimento:** o frontend (Vite, porta 5173) encaminha `/api` e `/uploads` para `http://localhost:3001`, onde roda a API Node.js de `backend/`. O banco é um MariaDB em Docker. <!-- TODO: confirme que o server.js do backend/ escuta na porta 3001 -->
- **Em produção (Hostinger):** o site chama a API em PHP, em `/api/index.php?route=...`, com MySQL. <!-- TODO: em que pasta está o código PHP? Ele ainda é o que roda em produção? -->
- **`backend-node/`:** API em Node.js com TypeScript; a listagem e os detalhes das vagas são consultados no MySQL por essa API.

## Tecnologias

- **Site principal:** React 19, Vite 7, React Router 7 e Tailwind CSS 4 (código em JavaScript e TypeScript)
- **Bibliotecas do frontend:** axios, react-hot-toast e lucide-react
- **`backend/`:** Node.js, Express 4, MySQL (`mysql2`), autenticação com JWT e bcrypt, upload de arquivos com multer
- **`backend-node/`:** Node.js, Express 5, TypeScript, MySQL (`mysql2`), JWT e cookie-parser
- **Banco de dados:** MariaDB 10.11 em Docker (desenvolvimento) e MySQL (produção)
- **Análise de currículo com IA:** Next.js e TypeScript, em `app.vagasnordestinas.com` <!-- TODO: em que pasta ou repositório está o código desse app? -->
- **Hospedagem:** Hostinger, com domínio próprio e HTTPS <!-- TODO: e o app em Next.js, onde está hospedado? -->

## Principais rotas do frontend

| Rota | Tela |
|---|---|
| `/` | Home: lista de vagas e busca |
| `/jobs/:id` | Detalhe da vaga (mesma tela da Home) |
| `/signup` | Cadastro |
| `/login` | Login |
| `/dashboard` | Painel para gerenciar vagas |
| `/create-job` | Criar vaga |
| `/edit-job/:id` | Editar vaga |
| `/tickets` | Chamados de suporte (em desenvolvimento) |
| `/termos-de-uso` | Termos de uso |
| `/politica-de-privacidade` | Política de privacidade |
| `*` | Página não encontrada (404) |

## API REST de vagas (produção)

O parâmetro `route` leva o caminho do recurso, por exemplo `/api/index.php?route=/jobs`.

| Método | Caminho (`route`) | O que faz |
|---|---|---|
| `POST` | `/jobs` | Cria uma vaga |
| `GET` | `/jobs` | Lista as vagas |
| `GET` | `/jobs/:id` | Mostra os detalhes de uma vaga |
| `PUT` | `/jobs/:id` | Atualiza uma vaga |
| `DELETE` | `/jobs/:id` | Exclui uma vaga |

## Estrutura de pastas

| Pasta | O que tem |
|---|---|
| `src/components/` | Telas e componentes (Home, Login, Signup, dashboard, CreateJob, EditJob, `support/`...) |
| `src/hooks/` | `useAuth`, `useJobs`, `useCurrentUser`, `useLocalStorage` |
| `src/services/` | Chamadas à API (`jobsApi`, `profileApi`) |
| `src/types/` | Tipos TypeScript (`job`, `user`, `ticket`, `api`) |
| `src/utils/` | `formatDate`, `validateEmail`, `parseResume` |
| `src/styles/` | CSS de cada tela |
| `src/constants/` | `config.ts` e `routes.ts` |
| `src/lib/` | `auth.ts`, `db.ts`, `openai.ts` <!-- TODO: explique para que servem, ou remova se não são usados --> |
| `backend/` | API Node.js (Express + MySQL) usada em desenvolvimento |
| `backend-node/` | API em Node.js com TypeScript (em desenvolvimento) |
| `docker/mysql/init/` | Scripts que criam o banco na primeira vez que o Docker sobe |

## Como rodar (desenvolvimento)

Você precisa de Node.js e Docker. <!-- TODO: diga a versão do Node.js que você usa -->

### 1. Banco de dados

```bash
docker compose up -d
```

Isso sobe um MariaDB em `localhost:3307` e o phpMyAdmin em http://localhost:8081. Na primeira vez, o banco `vagas_nordestinas` é criado com os scripts de `docker/mysql/init/`. As credenciais de desenvolvimento estão no `docker-compose.yml` e **servem só para o seu computador**.

### 2. API (`backend/`)

```bash
cd backend
npm install
npm start        # ou: npm run dev (reinicia sozinho ao salvar)
```

Antes de iniciar, crie o `backend/.env` a partir do `backend/.env.example` e preencha os valores (veja "Variáveis de ambiente" abaixo). <!-- TODO: a busca não achou backend/.env. Confirme de onde o backend/ lê o .env (dotenv.config no server.js) -->

### 3. Frontend

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Se aparecer `ERR_CONNECTION_REFUSED`, o servidor de desenvolvimento não está rodando.

Para subir o frontend e a API de `backend/` juntos, use `npm run dev:all`.

### 4. Backend Node.js com TypeScript (`backend-node/`)

```bash
cd backend-node
npm install
npm run dev      # desenvolvimento (tsx watch)
npm run build    # compila para dist/
npm start        # roda dist/server.js
```

Antes de iniciar, crie o `backend-node/.env` a partir do `backend-node/.env.example`. <!-- TODO: diga a porta em que o backend-node escuta -->

### API PHP (produção / XAMPP)

1. Coloque a pasta da API PHP dentro de `htdocs` do XAMPP <!-- TODO: nome da pasta -->
2. Inicie o Apache e o MySQL
3. Configure as credenciais do banco no arquivo de configuração
4. Importe o banco de dados: `01-vagas_nordestinas.sql` <!-- TODO: confirme se ele fica em docker/mysql/init/ -->
5. Acesse a API em `localhost`

## Scripts disponíveis

**Raiz do projeto (frontend):**

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento do frontend (Vite) |
| `npm run dev:all` | Frontend e `backend/` ao mesmo tempo |
| `npm run api` | Só o `backend/` (`npm start` dentro da pasta) |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Abre a versão de produção localmente |
| `npm run lint` | Verifica o código com o ESLint |

**`backend/`:** `npm start`, `npm run dev` e `npm test` (executa `test-api.js`). <!-- TODO: diga em uma linha o que o test-api.js testa -->

**`backend-node/`:** `npm run dev`, `npm run build` e `npm start`.

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `VITE_API_BASE_URL` | Endpoint PHP; no deploy atual: `https://vagasnordestinas.com/api/index.php` |

O arquivo `.env.production` contém somente a URL pública da API PHP. Para desenvolvimento local, copie `.env.example` para `.env.local`, que o git ignora.

Toda variável que começa com `VITE_` vai para o código que roda no navegador. **Nunca coloque chaves secretas nela.**

### API PHP na Hostinger

O código PHP fica em `backend/`; não existe uma pasta `api/` no repositório. Envie para `public_html/api/` `index.php`, `router.php`, `jwt_helper.php`, `config/database.php`, os três controllers PHP (`AuthController.php`, `JobController.php`, `UserController.php`), `.htaccess` e a pasta `vendor/` (necessária para JWT). Não envie os arquivos de teste, Node.js, `.env.example` nem `schema.sql` para a pasta pública. Execute `backend/schema.sql` no banco Aiven antes de usar a API. Se `users` ou `jobs` já existirem, confirme as colunas `users.role` e `jobs.url`; adicione apenas as que faltam (`ALTER TABLE users ADD COLUMN role ENUM('user','recruiter','admin') NOT NULL DEFAULT 'user';` e `ALTER TABLE jobs ADD COLUMN url VARCHAR(500) DEFAULT NULL;`).

Configure no ambiente PHP da Hostinger, nunca em `VITE_*`:

| Variável | Valor a conferir |
|---|---|
| `DB_HOST` | Host MySQL fornecido pela Aiven |
| `DB_PORT` | Porta fornecida pela Aiven (não presuma `3306`) |
| `DB_NAME` | Nome exato do banco Aiven |
| `DB_USER` | Usuário MySQL Aiven |
| `DB_PASSWORD` | Senha MySQL Aiven |
| `DB_SSL_CA` | Caminho absoluto legível para o certificado CA da Aiven |
| `JWT_SECRET` | Segredo aleatório com pelo menos 32 caracteres |

Em desenvolvimento local, o PHP carrega opcionalmente `backend/.env` apenas quando `SERVER_NAME` é `localhost` ou `127.0.0.1`; as variáveis de ambiente do processo têm prioridade. Configure nele `DB_HOST=localhost`, `DB_NAME=vagas_nordestinas`, `DB_USER=root`, `DB_PASSWORD=`, `DB_PORT=3306` e um `JWT_SECRET` aleatório com pelo menos 32 caracteres. Em produção, configure as variáveis no ambiente PHP e não envie `backend/.env` ao servidor. O template `backend/.env.example` documenta os nomes usados na configuração de produção. Mantenha a CA fora de uma pasta publicamente acessível quando possível. Confirme também que a Aiven permite conexões de saída do servidor Hostinger. Não envie credenciais ao repositório nem ao build do Vite.

## Status

| Parte | Estado |
|---|---|
| Cadastro, login, vagas (CRUD) e painel | Implementado |
| Pesquisa e filtros de vagas | Implementado |
| Integração com vagas do GitHub | Implementado |
| Análise de currículo com IA | Primeira versão |
| Termos de uso e política de privacidade | Implementado |
| Deploy online (Hostinger, HTTPS) | Implementado |
| Docker (banco e phpMyAdmin locais) | Implementado |
| `backend-node/` (autenticação) | Em desenvolvimento |
| Chamados de suporte (`/tickets`) | Em desenvolvimento |
| Testes automatizados | Parcial: teste da API em `backend/` (`npm test`); o frontend não tem testes |
| CI (GitHub Actions) | Planejado |

<!-- TODO: ajuste a tabela ao que é verdade hoje. -->

## Limitações conhecidas

- A busca não trata consultas complexas
- Filtros por salário e categoria ainda não existem <!-- TODO: confira. O README antigo dizia que local também não existia, mas o post do LinkedIn diz que há filtros por cargo, localização e modalidade -->
- A autenticação da API PHP é baseada em sessão, sem JWT
- O frontend não tem testes automatizados (não existe o script `test`)
- A interface pode melhorar em responsividade e usabilidade
- Tratamento de erros e validação podem melhorar em alguns pontos

## Contribuição

- Crie uma branch para cada funcionalidade ou correção
- Use mensagens de commit claras
- Abra um pull request explicando o que mudou
- Teste suas mudanças antes de enviar

## Mais documentação

- [Fluxo do `import-jobs.php`](docs/import-jobs.md)

## Autor

Tiago, desenvolvedor web júnior.