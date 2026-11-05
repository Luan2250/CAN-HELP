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

# Funcionalidades Implementadas

## 01 – Cadastro de usuários
O sistema permite o cadastro de usuários com informações pessoais (CPF, endereço, telefone, email, data de nascimento e senha). Após o cadastro, o usuário pode ser vinculado a um perfil e classificado como **cliente** ou **cuidador**.

- **Backend**: `CriarUsuarioService`, `CriarPerfilService`, `CriarClienteService`, `CriarCuidadorService`
- **Endpoints**: `POST /usuarios`, `POST /perfis`, `POST /clientes`, `POST /cuidadores`
- **Frontend**: `usuarios.html`, `perfis.html`, `clientes.html`, `cuidadores.html`

---

## 02 – Login de usuários autenticados
O sistema permite que usuários autenticados realizem login utilizando suas credenciais cadastradas.

- **Backend**: Autenticação com JWT (JSON Web Token)
- **Endpoints**: `POST /login`, `GET /usuarios/<id>/tipo`
- **Frontend**: `login.html`

---

## 03 – Contratação de cuidadores
O sistema permite que usuários contratem cuidadores para prestação de serviços, criando contratos com informações como data de atendimento, localização, nome do auxiliado e valor final.

- **Backend**: `CriarContratoService`
- **Endpoints**: `POST /contratos`
- **Frontend**: `contratos.html`

---

## 04 – Busca e visualização de cuidadores disponíveis
O sistema permite buscar cuidadores filtrando por cidade e/ou ordenando por nota média, além de listar cuidadores disponíveis em uma data específica.

- **Backend**: `FiltrarCuidadorRepository`, `CuidadoresDisponiveisRepository`, `FiltrarCuidadoresService`, `CuidadoresDisponiveisService`
- **Procedures**: `BuscarCuidadoresFiltro`, `EncontrarCuidadoresDisponiveis`
- **Endpoints**: `GET /cuidadores/busca?cidade=&ordem_nota=`, `GET /cuidadores/disponiveis?data=`
- **Frontend**: `cuidadores.html`

---

## 05 – Solicitação de ajuda para tarefas específicas
O sistema permite que clientes solicitem ajuda para tarefas específicas, criando contratos com a possibilidade de adicionar serviços (transporte, banho, alimentação, etc.) e agendar o atendimento.

- **Backend**: `CriarContratoService`, `ItensContrato`, `Agenda`
- **Endpoints**: `POST /contratos`, `POST /itensContrato`, `POST /agendas`
- **Frontend**: `contratos.html`, `itens-contrato.html`, `agenda.html`

---

## 06 – Exibição de perfis de usuários
O sistema exibe perfis de usuários contendo informações pessoais, experiência (certificados, disponibilidade) e avaliações recebidas (nota média e comentários).

- **Backend**: `Perfil`, `Cuidador`, `Avaliacoes`
- **Endpoints**: `GET /perfis/<id>`, `GET /cuidadores/<id>`
- **Frontend**: `perfis.html`, `cuidadores.html`

---

## 07 – Avaliação de usuários após conclusão de serviço
O sistema permite que usuários avaliem outros usuários após a conclusão de um serviço, enviando nota (1 a 5), comentário e gorjeta.

- **Backend**: `CriarAvaliacoesService`
- **Validações**: nota entre 1 e 5, não pode auto-avaliar, só pode avaliar após serviço concluído, não pode avaliar duas vezes
- **Endpoints**: `POST /avaliacoess`, `GET /avaliacoess/<id>`
- **Frontend**: `avaliacoes.html`

---

## 08 – Acompanhamento do status das solicitações de ajuda
O sistema permite o acompanhamento do status das solicitações de ajuda, com transições válidas entre os estados: pendente, aceito, recusado, cancelado_cliente, cancelado_cuidador e concluido.

- **Backend**: `AtualizarStatusContratoService`, `ListarContratosPorStatusService`
- **Validações**: transições válidas, permissões por tipo de usuário
- **Endpoints**: `PATCH /contratos/<id>/status`, `GET /contratos/acompanhar`, `GET /contratos/<id>/acompanhar`
- **Frontend**: `contratos.html`

---

## 09 – Chat para comunicação entre usuários
O sistema disponibiliza um chat para comunicação entre usuários durante o processo de solicitação e prestação do serviço.

- **Backend**: Chat em tempo real com WebSocket
- **Endpoints**: `POST /mensagens`, `GET /mensagens/<id_contrato>`
- **Frontend**: `chat.html`

---

## 10 – Cancelamento de solicitações de ajuda
O sistema permite o cancelamento de solicitações de ajuda antes da conclusão do serviço, tanto pelo cliente quanto pelo cuidador, com regras específicas para cada caso.

- **Backend**: `CancelarContratoService`
- **Validações**: apenas o cliente pode cancelar como `cancelado_cliente`, apenas o cuidador pode cancelar como `cancelado_cuidador`, não pode cancelar contrato concluído ou recusado
- **Endpoints**: `POST /contratos/<id>/cancelar`, `POST /contratos/<id>/cancelar-cuidador`, `GET /contratos/<id>/verificar-cancelamento`
- **Frontend**: `contratos.html`

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
|    ├── route.py
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

### Status das funcionalidades além do CRUD

| Funcionalidade | Status |
|---|---|
| Filtro de busca de cuidadores | ✅ Procedure + Repository + Service + Controller  |
| Encontrar cuidadores disponíveis | ✅ Procedure + Repository + Service + Controller |
| Diferenciar tipo de usuário (cliente/cuidador) | ✅ Procedure + Repository + Service + Controller  |
| Relatório de histórico de contratos | ✅ Procedure + Repository + Service + Controller  |
