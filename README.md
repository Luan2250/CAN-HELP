# CAN-HELP
# Alunos
Luan Felipe da SIlva Santos  22501630|
Cauã Albano de Sousa Kamei  22501193 |
Julia Maria Dutra de Souza  22502521 |
Miguel David Comini Ramos  22502785 |
Vinicius Veiga Freitas  22401504 |

# Stack utilizada no projeto
Flask,Jinja2, MySql
### frontend
JINJA2 / HTML, CSS, JS
### backend
Flask
### banco de dados
MySql

# Breve descrição do sistema
Aplicativo que conecta pessoas que necessitam de assistência a cuidadores qualificados, oferecendo ferramentas de contratação, comunicação, acompanhamento de serviços, agenda de tarefas, avaliações e notificações para garantir mais segurança e praticidade no cuidado diário.

# Instruções básicas para executar o projeto(por enquanto CRUD API)
# CanHelp — CRUD com Flask + SQLAlchemy

Este repositório é a API e as telas do projeto **CanHelp**, seguindo a arquitetura de
camadas (Controller → Service → Model) definida no material de estudo da disciplina.

O projeto está dividido em dois apps Flask independentes:

- **backend/** — a API (Controllers, Services, Models, banco de dados);
- **frontend/** — as telas (Jinja + HTML/CSS/JS) que consomem a API.

## Estrutura do projeto

```
CAN-HELP/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── database/
│   │   └── CanHelp.sql
│   ├── extensions.py
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── templates/
    ├── static/
    │   ├── css/
    │   └── js/
    ├── app.py
    └── requirements.txt
```

## Arquitetura usada no projeto

```
Frontend (Jinja + fetch)
   ↓  HTTP (JSON)
Controller
   ↓
Service
   ↓
Model (db.Model + CRUD)
   ↓
Banco de dados MySQL
```

- **Controller**: recebe a requisição HTTP, lê o JSON e devolve a resposta. Não acessa `db.session` diretamente.
- **Service**: executa o caso de uso (criar, listar, buscar, atualizar, deletar) e valida regras.
- **Model**: representa a tabela do banco e concentra os métodos de persistência (`salvar`, `atualizar`, `deletar`, `listar_todos`, `buscar_por_id`).
- **Repository**: reservado para consultas que não são CRUD simples (filtros, relatórios, rankings) — ainda não utilizado neste estágio do projeto.

Como backend e frontend são dois servidores diferentes (portas 5000 e 5001), o backend
tem CORS habilitado para aceitar as chamadas do frontend.

## Models implementadas até agora

| Model | Tabela no banco | Status |
|---|---|---|
| Usuario | `Usuario` | ✅ CRUD completo |
| Perfil | `Perfil` | ✅ CRUD completo |
| Cliente | `Cliente` | ✅ ..|
| Cuidador | `Cuidador` | ✅..  |
| Avaliacoes | `Avaliacoes` | ⏳ |
| Denuncias | `Denuncias` | ⏳  |
| ListaServicos | `ListaServicos` | ⏳  |
| Contrato | `Contrato` | ✅ .. |
| Agenda | `Agenda` | ⏳  |
| Tarefa | `Tarefa` | ⏳  |

## Funcionalidades implementadas

**CRUD de Usuário:**
- Cadastrar usuário
- Listar usuários
- Buscar usuário por id
- Atualizar usuário
- Excluir usuário

**CRUD de Perfil:**
- Cadastrar perfil (vinculado a um `idUsuario` existente)
- Listar perfis
- Buscar perfil por id
- Atualizar perfil
- Excluir perfil

Cada funcionalidade acima já possui: tela no frontend + rota na API + Controller + Service + Model + persistência real no banco (testado via Thunder Client e pela tela).

## Pré-requisitos

- Python 3.10+ instalado
- MySQL Server instalado e rodando localmente
- Banco de dados `canhelp` criado a partir do script `backend/database/CanHelp.sql`

## Como executar o backend

1. Entre na pasta do backend:
   ```
   cd backend
   ```

2. (Opcional, mas recomendado) Crie um ambiente virtual:
   ```
   python -m venv .venv
   ```

3. Ative o ambiente virtual.

   No Windows:
   ```
   .venv\Scripts\activate
   ```
   No Linux ou macOS:
   ```
   source .venv/bin/activate
   ```

4. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

5. Confira em `app.py` se a string de conexão do banco está com o usuário/senha corretos:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:SUA_SENHA@localhost/canhelp'
   ```

6. Execute o backend:
   ```
   python app.py
   ```

A API ficará disponível em:
```
http://127.0.0.1:5000
```

## Como executar o frontend

1. Em **outro terminal**, entre na pasta do frontend:
   ```
   cd frontend
   ```

2. (Opcional) Crie e ative um ambiente virtual, do mesmo jeito que no backend.

3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

4. Execute o frontend:
   ```
   python app.py
   ```

Acesse:
```
http://127.0.0.1:5001
```

⚠️ O backend precisa estar rodando **ao mesmo tempo** que o frontend, já que as telas
buscam os dados chamando a API na porta 5000.

## Rotas da API

### Usuário

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/<id>` | Busca um usuário pelo id |
| POST | `/usuarios` | Cadastra um usuário |
| PUT | `/usuarios/<id>` | Atualiza um usuário |
| DELETE | `/usuarios/<id>` | Remove um usuário (remove o perfil vinculado junto, por CASCADE) |

### Perfil

| Método | Rota | Descrição |
|---|---|---|
| GET | `/perfis` | Lista todos os perfis |
| GET | `/perfis/<id>` | Busca um perfil pelo id |
| POST | `/perfis` | Cadastra um perfil (precisa de um `idUsuario` existente) |
| PUT | `/perfis/<id>` | Atualiza um perfil |
| DELETE | `/perfis/<id>` | Remove um perfil |

### Telas (frontend)

| Rota | Descrição |
|---|---|
| `/` | Página inicial |
| `/usuarios` | Lista, cadastra, edita e exclui usuários |
| `/perfis` | Lista, cadastra, edita e exclui perfis |





