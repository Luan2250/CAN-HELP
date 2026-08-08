# CAN-HELP

## Alunos
Luan Felipe da Silva Santos — 22501630
Cauã Albano de Sousa Kamei — 22501193
Julia Maria Dutra de Souza — 22502521
Miguel David Comini Ramos — 22502785
Vinicius Veiga Freitas — 22401504

## Stack utilizada no projeto
Python, MySQL

### Frontend
HTML, CSS, JavaScript (aplicação estática, sem renderização no servidor)

### Backend
Python (Flask + SQLAlchemy)

### Banco de dados
MySQL

## Breve descrição do sistema
Aplicativo que conecta pessoas que necessitam de assistência a cuidadores qualificados,
oferecendo ferramentas de contratação, comunicação, acompanhamento de serviços, agenda
de tarefas, avaliações e notificações para garantir mais segurança e praticidade no
cuidado diário.

---

# Instruções para executar o projeto (CRUD completo — 10 entidades)

Este repositório é a API e as telas do projeto **CanHelp**, seguindo a arquitetura de
camadas (Controller → Service → Model) definida no material de estudo da disciplina.

O projeto está dividido em duas aplicações **totalmente independentes**:

- **backend/** — a API Flask (Controllers, Services, Models, banco de dados). É a
  única parte que fala com o MySQL.
- **frontend/** — HTML, CSS e JavaScript puros, sem nenhum framework ou renderização
  no servidor. Consome a API do backend via `fetch`, exatamente como uma aplicação
  cliente separada deve fazer.

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
    ├── index.html
    ├── usuarios.html
    ├── perfis.html
    ├── clientes.html
    ├── cuidadores.html
    ├── contratos.html
    ├── agenda.html
    ├── tarefas.html
    ├── avaliacoes.html
    ├── denuncias.html
    ├── lista-servicos.html
    ├── itens-contrato.html
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        └── (um arquivo .js por tela)
```

## Arquitetura usada no projeto

```
Frontend (HTML/CSS/JS estático)
   ↓  fetch (HTTP + JSON)
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

Como o frontend é uma aplicação separada do backend (servida em outra porta, sem
nenhum código Python renderizando páginas), o backend tem **CORS** habilitado para
aceitar as chamadas vindas do frontend.

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

Como o frontend é 100% estático (sem Flask, sem Jinja), qualquer servidor de arquivos
simples funciona. A forma mais direta:

1. Em **outro terminal**, entre na pasta do frontend:
   ```
   cd frontend
   ```

2. Suba um servidor estático:
   ```
   python -m http.server 5500
   ```

3. Acesse no navegador:
   ```
   http://127.0.0.1:5500
   ```

⚠️ O **backend precisa estar rodando ao mesmo tempo** que o frontend, já que todas as
telas buscam os dados chamando a API na porta 5000 (`API_BASE` configurado em
`frontend/js/app.js`).

Alternativa: usar a extensão **Live Server** do VS Code, clicando com o botão direito
em `index.html` → "Open with Live Server".

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

### Cliente
| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Lista todos os clientes |
| GET | `/clientes/<id>` | Busca um cliente pelo id |
| POST | `/clientes` | Marca um usuário existente como cliente |
| DELETE | `/clientes/<id>` | Remove o vínculo de cliente |

> Cliente só tem `idUsuario` (PK/FK de Usuario) — não há campos próprios para atualizar.

### Cuidador
| Método | Rota | Descrição |
|---|---|---|
| GET | `/cuidadores` | Lista todos os cuidadores |
| GET | `/cuidadores/<id>` | Busca um cuidador pelo id |
| POST | `/cuidadores` | Cadastra um cuidador (precisa de um `idUsuario` existente) |
| PUT | `/cuidadores/<id>` | Atualiza um cuidador |
| DELETE | `/cuidadores/<id>` | Remove um cuidador |

### Contrato
| Método | Rota | Descrição |
|---|---|---|
| GET | `/contratos` | Lista todos os contratos |
| GET | `/contratos/<id>` | Busca um contrato pelo id |
| POST | `/contratos` | Cadastra um contrato (precisa de `idCliente` e `idCuidador` existentes) |
| PUT | `/contratos/<id>` | Atualiza um contrato |
| DELETE | `/contratos/<id>` | Remove um contrato |

### Agenda
| Método | Rota | Descrição |
|---|---|---|
| GET | `/agendas` | Lista todos os compromissos |
| GET | `/agendas/<id>` | Busca um compromisso pelo id |
| POST | `/agendas` | Cadastra um compromisso (precisa de um `idContrato` existente) |
| PUT | `/agendas/<id>` | Atualiza um compromisso |
| DELETE | `/agendas/<id>` | Remove um compromisso |

### Tarefa
| Método | Rota | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista todas as tarefas |
| GET | `/tarefas/<id>` | Busca uma tarefa pelo id |
| POST | `/tarefas` | Cadastra uma tarefa (precisa de um `idAgenda` existente) |
| PUT | `/tarefas/<id>` | Atualiza uma tarefa |
| DELETE | `/tarefas/<id>` | Remove uma tarefa |

### Avaliações
| Método | Rota | Descrição |
|---|---|---|
| GET | `/avaliacoess` | Lista todas as avaliações |
| GET | `/avaliacoess/<id>` | Busca uma avaliação pelo id |
| POST | `/avaliacoess` | Cadastra uma avaliação (precisa de `idAvaliador` e `idAvaliado` existentes) |
| PUT | `/avaliacoess/<id>` | Atualiza uma avaliação |
| DELETE | `/avaliacoess/<id>` | Remove uma avaliação |

### Denúncias
| Método | Rota | Descrição |
|---|---|---|
| GET | `/denuncias` | Lista todas as denúncias |
| GET | `/denuncias/<id>` | Busca uma denúncia pelo id |
| POST | `/denuncias` | Cadastra uma denúncia (precisa de `idDenunciante` e `idDenunciado` existentes) |
| PUT | `/denuncias/<id>` | Atualiza uma denúncia |
| DELETE | `/denuncias/<id>` | Remove uma denúncia |

### Lista de Serviços
| Método | Rota | Descrição |
|---|---|---|
| GET | `/listasServicos` | Lista todos os tipos de serviço |
| GET | `/listasServicos/<id>` | Busca um tipo de serviço pelo id |
| POST | `/listasServicos` | Cadastra um novo tipo de serviço |
| PUT | `/listasServicos/<id>` | Atualiza um tipo de serviço |
| DELETE | `/listasServicos/<id>` | Remove um tipo de serviço |

### Itens do Contrato
| Método | Rota | Descrição |
|---|---|---|
| GET | `/itensContrato` | Lista todos os vínculos contrato+serviço |
| GET | `/itensContrato/<idContrato>` | Lista os serviços vinculados a um contrato específico |
| POST | `/itensContrato` | Vincula um serviço a um contrato (`idContrato` + `idServico`) |
| DELETE | `/itensContrato/<idContrato>/<idServico>` | Remove um vínculo específico |

> ItensContrato tem **chave composta** (`idContrato` + `idServico` juntos, sem id
> próprio) — por isso não há rota de `PUT`: o vínculo é criado ou removido, nunca
> editado.

### Telas (frontend)
| Rota | Descrição |
|---|---|
| `/index.html` | Página inicial |
| `/usuarios.html` | CRUD de usuários |
| `/perfis.html` | CRUD de perfis |
| `/clientes.html` | Criar / listar / excluir clientes |
| `/cuidadores.html` | CRUD de cuidadores |
| `/contratos.html` | CRUD de contratos |
| `/agenda.html` | CRUD de compromissos |
| `/tarefas.html` | CRUD de tarefas |
| `/avaliacoes.html` | CRUD de avaliações |
| `/denuncias.html` | CRUD de denúncias |
| `/lista-servicos.html` | CRUD de tipos de serviço |
| `/itens-contrato.html` | Vincular / listar / remover itens de contrato |

## Status das entidades

| Model | Tabela no banco | Status |
|---|---|---|
| Usuario | `Usuario` | ✅ CRUD completo (back + front) |
| Perfil | `Perfil` | ✅ CRUD completo (back + front) |
| Cliente | `Cliente` | ✅ Criar/listar/excluir (back + front) |
| Cuidador | `Cuidador` | ✅ CRUD completo (back + front) |
| Contrato | `Contrato` | ✅ CRUD completo (back + front) |
| Agenda | `Agenda` | ✅ CRUD completo (back + front) |
| Tarefa | `Tarefa` | ✅ CRUD completo (back + front) |
| Avaliacoes | `Avaliacoes` | ✅ CRUD completo (back + front) |
| Denuncias | `Denuncias` | ✅ CRUD completo (back + front) |
| ListaServicos | `ListaServicos` | ✅ CRUD completo (back + front) |
| ItensContrato | `ItensContrato` | ✅ Vincular/listar/remover (back + front) |

## Funcionalidades além do CRUD (Repository + Procedures)

Além do CRUD básico de cada entidade, foram implementadas 4 funcionalidades que
envolvem filtros, buscas, ordenação e combinação de dados entre tabelas. Seguindo a
orientação da disciplina, essas consultas **não** ficam no Model — foram implementadas
como *procedures* no banco de dados, encapsuladas na camada **Repository**, com
Controller e Service próprios para cada caso de uso.

```
Frontend (fetch)
   ↓
Controller
   ↓
Service
   ↓
Repository  →  CALL procedure() no MySQL
```

### Procedures criadas

| Procedure | Parâmetros | O que faz |
|---|---|---|
| `BuscarCuidadoresFiltro` | `p_cidade VARCHAR(40)`, `p_ordenar_por_nota BOOLEAN` | Retorna os cuidadores (com JOIN em Perfil e Avaliações), filtrando por cidade e permitindo ordenar por nota média |
| `EncontrarCuidadoresDisponiveis` | `p_data DATE` | Retorna os cuidadores que **não** têm nenhum contrato aceito na data informada, ordenados por nota média |
| `IdentificarTipoUsuario` | `p_idUsuario INT` | Retorna os dados do usuário indicando, via JOIN com Cliente e Cuidador, se ele é cliente, cuidador ou ambos |
| `RelatorioContratosCliente` | `p_idCliente INT` | Retorna o histórico de contratos de um cliente, combinando Contrato, Perfil (do cuidador), ItensContrato e ListaServicos, com os serviços agrupados via `GROUP_CONCAT` |

### Repositories, Services e Controllers utilizados

| Funcionalidade | Repository | Service | Controller |
|---|---|---|---|
| Filtro de busca de cuidadores | `FiltrarCuidadorRepository` | `FiltrarCuidadoresService` | `CuidadorController.buscar_cuidadores` |
| Encontrar cuidadores disponíveis | `CuidadoresDisponiveisRepository` | `CuidadoresDisponiveisService` | `CuidadorController.buscar_disponiveis` |
| Diferenciar tipo de usuário | `TipoUsuarioRepository` | `VerificarTipoUsuarioService` | `UsuarioController.verificar_tipo` |
| Relatório de histórico de contratos | `RelatorioContratoRepository` | `RelatorioContratosService` | `ContratoController.relatorio_cliente` |

### Rotas da API (além do CRUD)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/cuidadores/busca?cidade=&ordem_nota=` | Busca cuidadores filtrando por cidade e/ou ordenando por nota média |
| GET | `/cuidadores/disponiveis?data=` | Lista cuidadores disponíveis (sem contrato aceito) numa data específica |
| GET | `/usuarios/<id_usuario>/tipo` | Retorna se o usuário é cliente, cuidador ou ambos |
| GET | `/clientes/<id_cliente>/relatorio-contratos` | Retorna o histórico de contratos de um cliente |

### Telas (frontend) que consomem essas rotas

| Rota da tela | Descrição |
|---|---|
| `/cuidadores.html` | Inclui filtro de busca por cidade e ordenação por nota (usa `/cuidadores/busca`) |
| `/cuidadores.html` | Inclui filtro de disponibilidade por data (usa `/cuidadores/disponiveis`) |
| `/usuarios.html` | Exibe se o usuário é cliente, cuidador ou ambos (usa `/usuarios/<id_usuario>/tipo`) |
| `/contratos.html` | Exibe o histórico de contratos por cliente (usa `/clientes/<id_cliente>/relatorio-contratos`) |

### Status das funcionalidades além do CRUD

| Funcionalidade | Status |
|---|---|
| Filtro de busca de cuidadores | ✅ Procedure + Repository + Service + Controller + tela |
| Encontrar cuidadores disponíveis | ✅ Procedure + Repository + Service + Controller + tela |
| Diferenciar tipo de usuário (cliente/cuidador) | ✅ Procedure + Repository + Service + Controller + tela |
| Relatório de histórico de contratos | ✅ Procedure + Repository + Service + Controller + tela |
