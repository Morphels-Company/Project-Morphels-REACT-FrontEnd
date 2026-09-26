# Frontend - Projeto M.O.R.P.H.E.L.S

Frontend React para o sistema de gestão financeira de instituições do 3° sertor - Morphels

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **Vite** - Build too e dev server
- **React Routter Dom** - Roteamento
- **React Hook Form** - Gerenciado de valores dos Formulários
- **Axios** - Client HTTP
- **Tunstack Query** - Gerenciamento de requisições 
- **Tailwind** - Framework de estilização
- **Quagga** - Leitor de código de barras
- **Lucide React** - Icones

## 📦 Instalação

```Bash
npm install
```

## ⚙️ Configuração

A rota de consumo do Frontend está configurada para se conectar ao backend em `http://localhost:3000`

Para ajustar, edite `.env`

```angular2html
VITE_DATABASE_URL_ROOT='http://SEU_BACKEND:3000'
```
> [!IMPORTANT]
> O nome da variavel de ambiente não deve ser, em hipotese alguma, alterada, visto que é o mesmo nome utilizado em produção.

## 🏃Executar

### Modo de desenvolvimento

```angular2html
npm run dev
```
Abre na porta padrão do Vite `http://localhost:5173`

### Buid para produção

```angular2html
npm run build
```
Gera arquivos otimizados em `dist/`

### Preview do build

```angular2html
npm run preview
```

# 📂 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos (HTML principal, ícones, imagens)
├── src/                    # Código-fonte principal da aplicação
│   ├── compnents/          # Componentes visuais e reutilizáveis da interface
│   │   ├── balons.jsx              # Componente de exibição de balões/cards de métricas
│   │   ├── dataBalons.jsx          # Componente para processamento de dados dos balões
│   │   ├── filt.jsx                # Componente de filtros de busca ou seleção 
│   │   ├── formButtons.jsx         # Botões de ação do formulário (enviar, limpar, etc.)
│   │   ├── graphics.jsx             # Renderização de gráficos e relatórios visuais
│   │   ├── header.jsx              # Cabeçalho principal da aplicação
│   │   ├── header2.jsx             # Cabeçalho secundário
│   │   ├── infoParagraf.jsx
│   │   ├── inputs.jsx
│   │   ├── menu.jsx
│   │   ├── menuButtons.jsx
│   │   ├── modalExpences.jsx
│   │   ├── modalReports.jsx
│   │   ├── modalRevenues.jsx
│   │   ├── modelInfor.jsx
│   │   ├── openFormButton.jsx
│   │   ├── registerPages.jsx
│   │   ├── scanner.jsx
│   │   ├── searchArea.jsx
│   │   ├── searchBar.jsx
│   │   ├── settingPages.jsx
│   │   ├── settingsBallons.jsx
│   │   └── table.jsx
│   │
│   ├── content/
│   │   ├── withoutPermissionContext.jsx
│   │   └── withoutPermissionModal.js
│   │
│   │
│   ├── fonts/
│   │   ├──inter/
│   │       ├── Inter_18pt-Bold
│   │       └── Inter_18pt-Regular
│   │
│   ├── pages/
│   │   ├── expensesPage.jsx
│   │   ├── localReportsPage.jsx
│   │   ├── dashBoard.jsx
│   │   ├── registe.jsx
│   │   ├── reportsPage.jxs
│   │   ├── revenuesPage.jsx
│   │   └── settingsPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── requests.js
│   │   └── verification.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-look.json
├── READEME.md
└── vite.config.js
```

## 🔐 Autenticação

O sistema usa autenticalçai via Login:
1. O usuário tem o login criado pelo administrador da insituição cadastrada
2. Acessa o `/` e faz o login com o email e senha cadastrados
3. Backend valida os dados de login e carrega as permissões de acesso do usuário conforme sua role de acesso
4. Backend retorna JWT para seção web
5. Frontend armazena o JWT nos cookies
6. Todas as requisições incluem `Authorization: Bearer {jwt}`

### Fluxo Login

```jsx
// 1. Usuário submete formulário
POST /login
{
    "email": "user@gmail.com",
    "password": "12345..."
}

// 2. Backend valida e retorna JWT
{
    "jwtTonken": "easEjna21...",
    "sub": "UUID",
    "user": "user@gmail.com",
    "success": true,
    "route": "/main"
}

// 3. Frontend armazena nos cookies
// 4. Redireciona para a página inicial
```

## 🖌️ Páginas

### Login (`/`)
* Pública (não exige autenticação)
* Login do usuário
* Validação e redirecionamento

### Main Page (`/main`)
* Dashboard com resumo do mês
* Pop-Up de gastos, receita, e saldo
* Gráfico com balanço anual de gastas

### Revenues Page (`/revenues`)
* CRUD de entradas
* Cadastro de entradas financeiras
* Barra de membros integrado a tabela members
* Filtragem com base no tipo e na data
* Barra de pesquisa (usa o nome do membro e a descrição para a busca)

### Expenses Page (`/expenses`)
* CRUD de despesas
* Cadastro de saidas financeiras
* Barra de beneficiários integrado a tabela companies
* Filtragem com base no tipo e na data
* Barra de pesquisa (usa o titulo e a descrição para a busca)

### Registe (`/register`)
* Cadastro de membros, companias (parceiros) e cartões (cartões de fidelidade)
* CRUD de membros, companias e cartões

### Reports (`/reports`)
* CRUD das especificações de renderizações do relatórios
* Botão de renderização do relatório

### Settings (`/settings`)
* Página com renderização condicional (precisa de role expecífica pra poder acessar)
* CRUD de usuários
* CRUD de setores
* CRUD de filiais
* CRUD de Roles e Permissions

## 🧩 Componentes principais
### `<Header />`
Cabeçalho principal:
- Cabeçalho fixo 
- Navegação entre páginas
- Botão de troca do modos (Light, Dark)
- Botão logout

### `<Balons />`
Balão de iformações resumidas:
- Dados resumidos e generalitas
- Dados vem do Backend

### `<DataBalons />`
Balões de dados listados:
- Dados detalhados
- Botão para chamar o model de edição
- Usado para as listagens de dados financeiros

## 🌐 API Endpoints

### Autenticação

```js
POST /user/login    //Login via email e senha
```

### User

```js
POST    /users          // Cria a receita
GET     /users          // Lista os usuários
GET     /users/infos    // Busca informações do usuários logado
PUT     /users/{id}     // Edita os dados do usuário
DELETE  /users/{id}     // Deleta o usuário
```

### Sectors

```js
POST    /sectors        // Cria um setor
GET     /sectors        // Lista os setores
PUT     /sectors/{id}   // Edita os dados
DELETE  /sector/{id}    // Deleta o setor
```

### Roles

```js
POST    /roles          // Cria uma role
GET     /roles          // Lista todas as roles da instituição
PUT     /roles/{id}     // Edita os dados da role (inclusive os acessos)
DELETE  /roles/{id}     // Deleta role e exclui as permissões
```

### Revenues

```js
POST    /revenues           // Cria uma receita
GET     /revenues           // Lista todas as receitas (com base no nível de visualização do usuário)
POST    /revenues/filter    // FIltra a exibição com base na data de criação e no tipo
PUT     /revenues/{id}      // Edita os dados da receita
DELETE  /revenues/{id}      // Deleta o registro
```

### Reports 

```js
POST    /reports                // Cria um preset de relatorio
GET     /reports                // Lista todos os presets
PUT     /reports                // Edita os dados do preset
DELETE  /reports                // Deleta o preset
POST    /reports/finance/{id}   // Busca os dados financeiros que com base no preset
```

### Pages 
Esses endpoints são exclusivos do painel de admin **eles não devem ser implementados para os usuário comuns**

```js
POST    /members        // Cria um membro
GET     /members        // Lista os membros (até o momento lista todos cadastrados na instituição do usuário)
PUT     /members/{id}   // Edita os dados do usuário
DELETE  /members/{id}    // Deleta o usuário
```

### Expenses 

```js
POST    /expenses           // Cria uma despesa
GET     /expenses           // Lista todas as despesas (com base no nível de visualização do usuário)
GET     /expenses/filter    // Filtra a exibição com base na data de criação e no tipo
PUT     /expenses/{id}      // Edita os dados da despesa
DELETE  /expenses/{id}      // Delete ao registro
```

### Companies

```js
POST    /companies        // Cria o registro de um parceiro
GET     /companies        // Lista os parceiros
PUT     /companies/{id}   // Edita os dados do parceiro
DELETE  /companies/{id}    // Deleta o parceiro
```

### Cards

```js
POST    /cards        // Cria um cartão de fidelidade
GET     /cards        // Lista os cartões
PUT     /cards/{id}   // Edita os dados do cartão
DELETE  /cards/{id}    // Deleta o cartão
```

### Branches

```js
POST    /branches        // Cria uma filial
GET     /branches        // Lista as filiais (exclusiva para usuário com nível de visualização acima de setorial)
PUT     /branches/{id}   // Edita os dados da filial (exclusivo dos usuário com acesso global)
DELETE  /branches/{id}    // Deleta a filial (exclusivo dos usuário com acesso global)
```

## 🛠️ Funcionalidades implementadas

### ✅ Autenticação
- [x] Login com email e senha
- [x] JWT storage nos coockies
- [ ] Logout

### ✅ Dashboard
- [ ] Balões com dados financieros
- [ ] Gráfico com levantamento dos gastos

### ✅ Revenues
- [x] CRUD de receitas
- [x] Filtro de receitas
- [x] Integração com a tabela de membros

### ✅ Expenses
- [x] CRUD de despesas
- [x] Filtro de despesas
- [x] Integração com a tabela de parceiros

### ✅ Register
- [x] CRUD membros
- [x] CRUD parceiros
- [x] CRUD cartões

