# CAN-HELP

## Alunos
Luan Felipe da Silva Santos — 22501630
Cauã Albano de Sousa Kamei — 22501193
Julia Maria Dutra de Souza — 22502521
Miguel David Comini Ramos — 22502785
Vinicius Veiga Freitas — 22401504

## Stack utilizada no projeto
- **Frontend:** HTML, CSS e JavaScript puros (aplicação estática, sem renderização no servidor)
- **Backend:** Python (Flask, SQLAlchemy, Flask-CORS, Flask-Bcrypt, PyJWT)
- **Banco de dados:** MySQL

## Breve descrição do sistema
Aplicativo que conecta pessoas que necessitam de assistência a cuidadores qualificados, oferecendo ferramentas de contratação, comunicação, acompanhamento de serviços, agenda de tarefas, avaliações e notificações para garantir mais segurança e praticidade no cuidado diário.

---

# Funcionalidades Implementadas

Cada funcionalidade está disponível de ponta a ponta: **Tela → API Flask → Controller → Service → Model/Repository → Banco de Dados**.

## 01 – Cadastro de usuários
Permite cadastrar usuários com informações pessoais (CPF, endereço, telefone, email, data de nascimento e senha), vinculá-los a um perfil e definir o tipo: **cliente** (pessoa que necessita de ajuda) ou **cuidador**. A senha é armazenada com hash bcrypt.

- **Backend**: `CriarUsuarioService`, `CriarPerfilService`, `CriarClienteService`, `CriarCuidadorService`
- **Endpoints**: `POST /usuarios`, `POST /perfis`, `POST /clientes`, `POST /cuidadores`
- **Frontend**: `usuarios.html`, `perfis.html`, `clientes.html`, `cuidadores.html`

## 02 – Login de usuários autenticados
Permite que usuários cadastrados façam login com email e senha. A senha é verificada contra o hash bcrypt, e a API devolve um token JWT (validade de 8 horas), guardado no navegador e enviado no header `Authorization: Bearer <token>`. A mensagem de erro é genérica, para não revelar se o email ou a senha estava incorreto.

- **Backend**: `LoginUsuarioService`, `TokenService`
- **Endpoints**: `POST /login`
- **Frontend**: `login.html` (menu com "Sair" quando há sessão)

## 03 – Diferenciação entre cuidador e pessoa que necessita de ajuda
Permite identificar se um usuário é cliente, cuidador ou ambos, para disponibilizar as funcionalidades de cada tipo.

- **Backend**: `VerificarTipoUsuarioService`, `TipoUsuarioRepository`
- **Procedure**: `IdentificarTipoUsuario`
- **Endpoints**: `GET /usuarios/<id>/tipo`
- **Frontend**: `perfis.html`, `cuidadores.html`, `clientes.html`

## 04 – Busca e visualização de cuidadores disponíveis
Permite buscar cuidadores por cidade e/ou ordenando por nota média, e listar os cuidadores disponíveis em uma data específica.

- **Backend**: `FiltrarCuidadoresService`, `CuidadoresDisponiveisService`, `FiltrarCuidadorRepository`, `CuidadoresDisponiveisRepository`
- **Procedures**: `BuscarCuidadoresFiltro`, `EncontrarCuidadoresDisponiveis`
- **Endpoints**: `GET /cuidadores/busca?cidade=&ordem_nota=`, `GET /cuidadores/disponiveis?data=`
- **Frontend**: `busca-cuidadores.html`

## 05 – Solicitação de ajuda para tarefas específicas
Permite que clientes solicitem ajuda criando um contrato com um cuidador, vinculando os serviços desejados (transporte, banho, alimentação etc.) e agendando o atendimento.

- **Backend**: `CriarContratoService`, `CriarItensContratoService`, `CriarAgendaService`
- **Endpoints**: `POST /contratos`, `POST /itensContrato`, `POST /agendas`
- **Frontend**: `contratos.html`, `itens-contrato.html`, `agenda.html`

## 06 – Exibição de perfis de usuários
Exibe perfis com informações pessoais, experiência (certificado, órgão emissor, disponibilidade, valor do serviço) e avaliações recebidas.

- **Backend**: `BuscarPerfilService`, `BuscarCuidadorService`, `AvaliacoesDoUsuarioService`
- **Endpoints**: `GET /perfis/<id>`, `GET /cuidadores/<id>`, `GET /usuarios/<id>/avaliacoes`
- **Frontend**: `perfis.html`, `cuidadores.html`, `meu-perfil.html`

## 07 – Avaliação de usuários após conclusão de serviço
Permite avaliar outro usuário após a conclusão de um serviço, com nota (1 a 5), comentário e gorjeta.

- **Backend**: `CriarAvaliacoesService`
- **Validações**: nota entre 1 e 5; não pode avaliar a si mesmo; só avalia após o serviço concluído; não pode avaliar duas vezes
- **Endpoints**: `POST /avaliacoess`, `GET /avaliacoess/<id>`
- **Frontend**: `avaliacoes.html`

## 08 – Acompanhamento do status das solicitações de ajuda
Permite acompanhar o status das solicitações, com transições válidas entre: `pendente`, `aceito`, `recusado`, `cancelado_cliente`, `cancelado_cuidador` e `concluido`.

- **Backend**: `AtualizarStatusContratoService`, `ListarContratosPorStatusService`
- **Validações**: transições válidas; permissões por tipo de usuário
- **Endpoints**: `PATCH /contratos/<id>/status`, `GET /contratos/acompanhar`, `GET /contratos/<id>/acompanhar`
- **Frontend**: `contratos.html`

## 09 – Chat entre usuários
Disponibiliza um chat por contrato para comunicação entre cliente e cuidador durante a solicitação e a prestação do serviço, com lista de conversas e controle de mensagens lidas.

- **Backend**: `CriarMensagemService`, `ListarMensagensService`, `MarcarLidasService`, `DeletarMensagemService`, `ListarConversasService`, `MensagemRepository`, `ConversasRepository`
- **Endpoints**: `POST /mensagens`, `GET /contratos/<id>/mensagens`, `PATCH /contratos/<id>/mensagens/lidas`, `DELETE /mensagens/<id>`, `GET /usuarios/<id>/conversas`
- **Frontend**: `mensagens.html`

## 10 – Cancelamento de solicitações de ajuda
Permite cancelar uma solicitação antes da conclusão do serviço, pelo cliente ou pelo cuidador, com regras próprias para cada caso.

- **Backend**: `CancelarContratoService`
- **Validações**: só o cliente cancela como `cancelado_cliente` e só o cuidador como `cancelado_cuidador`; não é possível cancelar contrato concluído ou recusado
- **Endpoints**: `POST /contratos/<id>/cancelar`, `POST /contratos/<id>/cancelar-cuidador`, `GET /contratos/<id>/verificar-cancelamento`
- **Frontend**: `contratos.html`

## 11 – Visualização de avaliações de outros usuários
Permite ver as avaliações recebidas por um usuário, com nome do avaliador, tipo, nota, comentário e data, da mais recente para a mais antiga.

- **Backend**: `AvaliacoesDoUsuarioService`, `AvaliacoesDoUsuarioRepository`
- **Procedure**: `AvaliacoesDoUsuario`
- **Endpoints**: `GET /usuarios/<id>/avaliacoes`
- **Frontend**: `avaliacoes.html`, `meu-perfil.html`

## 12 – Criação de lembretes
Permite ao usuário autenticado criar e listar lembretes com título, descrição (opcional), data e hora. Cada lembrete pertence ao usuário do token JWT, e só ele o vê.

- **Backend**: `CriarLembreteService`, `ListarLembretesService`, `LembreteRepository`, decorator `exigir_autenticacao`
- **Validações**: título obrigatório (máx. 100 caracteres); descrição com máx. 255; data `AAAA-MM-DD` e hora `HH:MM` válidas; o `idUsuario` vem do token, nunca do corpo da requisição
- **Endpoints**: `POST /lembretes`, `GET /lembretes`
- **Frontend**: `lembretes.html`

## 13 – Consulta e organização da agenda de tarefas
Permite consultar, em ordem cronológica, as tarefas dos contratos em que o usuário atua como cliente ou cuidador, com filtro por período e status, e organizá-las: concluir ou reabrir, alterar o horário, mover para outra data e excluir.

- **Backend**: `ConsultarAgendaTarefasService`, `AlterarStatusTarefaService`, `AlterarHorarioTarefaService`, `MoverTarefaAgendaService`, `ExcluirTarefaAgendaService`, `AgendaTarefasRepository`
- **Validações**: o usuário só acessa tarefas dos seus contratos (as demais retornam 404); status `pendente` ou `concluida`; hora `HH:MM`; mover só para uma agenda do mesmo contrato na data informada
- **Endpoints**: `GET /minha-agenda?inicio=&fim=&status=`, `PATCH /minha-agenda/<id>/status`, `PATCH /minha-agenda/<id>/horario`, `PATCH /minha-agenda/<id>/mover`, `DELETE /minha-agenda/<id>`
- **Frontend**: `minha-agenda.html`

## 14 – Visualização dos preços dos serviços
Permite visualizar o preço base de cada tipo de serviço e o valor cobrado por cada cuidador.

- **Backend**: `ListarListaServicosService` (campo `precoBase` de `ListaServicos`), `ListarCuidadorService` (campo `valorServico`)
- **Endpoints**: `GET /listasServicos`, `GET /cuidadores`
- **Frontend**: `lista-servicos.html`, `busca-cuidadores.html`

## 15 – Solicitação de ajuda imediata
Permite ao cliente solicitar ajuda de forma imediata, criando o contrato sem passar pelo fluxo de agendamento.

- **Backend**: `SolicitarAjudaImediataService`, `CuidadorImediatoRepository`
- **Endpoints**: `POST /contratos/imediato`
- **Frontend**: `busca-cuidadores.html`, `contratos.html`

## 16 – Edição das informações de perfil
Permite ao usuário editar as informações do seu perfil: nome, cidade, estado, bio e foto.

- **Backend**: `AtualizarPerfilService`
- **Endpoints**: `PUT /perfis/<id>`
- **Frontend**: `meu-perfil.html`, `perfis.html`

## 17 – Upload de foto de perfil
Permite enviar uma foto de perfil. O navegador converte a imagem em Data URL (base64), e ela é gravada em `Perfil.fotoURL` (`LONGTEXT`).

- **Backend**: `CriarPerfilService`, `AtualizarPerfilService`
- **Endpoints**: `POST /perfis`, `PUT /perfis/<id>`
- **Frontend**: `perfis.html`, `meu-perfil.html`

## 18 – Filtros avançados na busca de cuidadores
Permite refinar a busca de cuidadores por cidade, estado, valor máximo, nota mínima e disponibilidade em uma data, com ordenação por nota ou valor.

- **Backend**: `FiltrarCuidadoresAvancadoService`, `FiltrarCuidadoresAvancadoRepository`
- **Procedure**: `FiltrarCuidadores`
- **Endpoints**: `GET /cuidadores/filtrar`
- **Frontend**: `busca-cuidadores.html`

## 19 – Histórico de serviços realizados
Permite consultar o histórico de contratos do usuário, como cliente ou cuidador, com papel, partes, datas, status, valor e serviços contratados, do mais recente ao mais antigo.

- **Backend**: `HistoricoServicosService`, `HistoricoServicosRepository`
- **Procedure**: `HistoricoDeServicos`
- **Endpoints**: `GET /meu-historico`
- **Frontend**: `historico.html`

## 20 – Notificações sobre solicitações e serviços
Gera notificações a partir dos contratos do usuário e permite listá-las e marcá-las como lidas, uma a uma ou todas de uma vez.

- **Backend**: `CriarNotificacaoService`, `NotificarContratoService`, `ListarNotificacoesService`, `MarcarNotificacaoLidaService`, `MarcarTodasLidasService`
- **Tabela**: `Notificacao`
- **Endpoints**: `GET /notificacoes`, `PATCH /notificacoes/<id>/lida`, `PATCH /notificacoes/lidas`
- **Frontend**: `notificacoes.html`

---

# Instruções para executar o projeto

Este repositório contém a API e as telas do **CanHelp**, seguindo a arquitetura de camadas (Controller → Service → Model/Repository) da disciplina. O projeto tem duas aplicações **independentes**:

- **backend/**: API Flask (Controllers, Services, Models, Repositories). É a única parte que acessa o MySQL.
- **frontend/**: HTML, CSS e JavaScript puros. Consome a API via `fetch`, como uma aplicação cliente separada.

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
│   ├── routes.py
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── index.html, login.html
    ├── usuarios.html, perfis.html, meu-perfil.html
    ├── clientes.html, cuidadores.html, busca-cuidadores.html
    ├── contratos.html, itens-contrato.html, lista-servicos.html
    ├── agenda.html, tarefas.html, minha-agenda.html, lembretes.html
    ├── avaliacoes.html, denuncias.html
    ├── mensagens.html, notificacoes.html, historico.html
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js        (acesso à API, token JWT, toasts, modais)
        ├── auth.js       (sessão do usuário e menu)
        └── (um arquivo .js por tela)
```

## Arquitetura

```
Frontend (HTML/CSS/JS estático)
   ↓  fetch (HTTP + JSON, token JWT no header Authorization)
Controller
   ↓
Service
   ↓
Model (db.Model + CRUD)   ou   Repository (consultas especiais / procedures)
   ↓
Banco de dados MySQL
```

- **Controller**: recebe a requisição HTTP, lê o JSON, chama o Service e devolve a resposta. Não contém regra de negócio nem acessa `db.session`.
- **Service**: executa um caso de uso (criar, listar, atualizar etc.), valida os dados e as permissões.
- **Model**: representa a tabela e concentra o CRUD básico (`salvar`, `atualizar`, `deletar`, `listar_todos`, `buscar_por_id`).
- **Repository**: encapsula consultas especiais (filtros, relatórios, rankings) e as chamadas `CALL` às procedures do MySQL.

O backend habilita **CORS**, porque o frontend roda em outra porta.

## Autenticação
O login (`POST /login`) devolve um token JWT. O frontend o guarda no `localStorage` e o envia em cada requisição no header `Authorization: Bearer <token>`. As rotas protegidas usam o decorator `exigir_autenticacao`, que valida o token e identifica o usuário. Hoje exigem token: `/lembretes` e `/minha-agenda/*`. Se o token for inválido ou expirar, a API responde 401 e o frontend encerra a sessão.

## Pré-requisitos
- Python 3.10 ou superior
- MySQL Server em execução local
- Banco `canhelp` criado a partir do script `backend/database/CanHelp.sql` (tabelas e procedures)

## Como executar o backend
1. Entre na pasta do backend:
   ```
   cd backend
   ```
2. (Recomendado) Crie e ative um ambiente virtual:
   ```
   python -m venv .venv
   .venv\Scripts\activate          # Windows
   source .venv/bin/activate       # Linux/macOS
   ```
3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
4. Confira em `app.py` a string de conexão com o banco:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:SUA_SENHA@localhost/canhelp'
   ```
5. (Recomendado) Defina a chave do JWT, sem versioná-la:
   ```
   $env:JWT_SECRET="uma-chave-longa-e-secreta"     # PowerShell
   export JWT_SECRET="uma-chave-longa-e-secreta"   # Linux/macOS
   ```
6. Execute:
   ```
   python app.py
   ```
A API ficará em `http://127.0.0.1:5000`.

## Como executar o frontend
1. Em **outro terminal**:
   ```
   cd frontend
   python -m http.server 5500
   ```
2. Acesse `http://127.0.0.1:5500`.

O **backend precisa estar rodando ao mesmo tempo**. A URL da API fica em `API_BASE`, no `frontend/js/app.js`. Alternativa: extensão **Live Server** do VS Code.

> Os usuários devem ser criados pela própria aplicação, pois a senha é gravada com hash bcrypt. Usuários inseridos direto no SQL com senha em texto puro não conseguem fazer login.

## Rotas da API

### Usuário e autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autentica e devolve o token JWT |
| POST | `/usuarios` | Cadastra um usuário |
| GET | `/usuarios` | Lista usuários |
| GET | `/usuarios/<id>` | Busca um usuário |
| PUT | `/usuarios/<id>` | Atualiza um usuário |
| DELETE | `/usuarios/<id>` | Remove um usuário (e o perfil vinculado, por CASCADE) |
| GET | `/usuarios/<id>/tipo` | Indica se é cliente, cuidador ou ambos |
| GET | `/usuarios/<id>/avaliacoes` | Avaliações recebidas pelo usuário |
| GET | `/usuarios/<id>/conversas` | Conversas do usuário |

### Perfil
| Método | Rota | Descrição |
|---|---|---|
| POST | `/perfis` | Cria usuário, perfil e tipo (cliente/cuidador) |
| GET | `/perfis` | Lista perfis |
| GET | `/perfis/<id>` | Busca um perfil |
| PUT | `/perfis/<id>` | Atualiza o perfil (inclui a foto) |
| DELETE | `/perfis/<id>` | Remove um perfil |

### Cliente
| Método | Rota | Descrição |
|---|---|---|
| POST | `/clientes` | Marca um usuário como cliente |
| GET | `/clientes` | Lista clientes |
| GET | `/clientes/<id>` | Busca um cliente |
| DELETE | `/clientes/<id>` | Remove o vínculo de cliente |
| GET | `/clientes/<id>/relatorio-contratos` | Histórico de contratos do cliente |

> Cliente só tem `idUsuario` (PK/FK de Usuario), então não há rota de atualização.

### Cuidador
| Método | Rota | Descrição |
|---|---|---|
| POST | `/cuidadores` | Cadastra um cuidador |
| GET | `/cuidadores` | Lista cuidadores |
| GET | `/cuidadores/<id>` | Busca um cuidador |
| PUT | `/cuidadores/<id>` | Atualiza um cuidador |
| DELETE | `/cuidadores/<id>` | Remove um cuidador |
| GET | `/cuidadores/busca?cidade=&ordem_nota=` | Busca por cidade e/ou nota |
| GET | `/cuidadores/filtrar` | Busca avançada (cidade, estado, valor, nota, data, ordenação) |
| GET | `/cuidadores/disponiveis?data=` | Cuidadores disponíveis em uma data |

### Contrato
| Método | Rota | Descrição |
|---|---|---|
| POST | `/contratos` | Cria um contrato |
| POST | `/contratos/imediato` | Solicita ajuda imediata |
| GET | `/contratos` | Lista contratos |
| GET | `/contratos/<id>` | Busca um contrato |
| PUT | `/contratos/<id>` | Atualiza um contrato |
| DELETE | `/contratos/<id>` | Remove um contrato |
| PATCH | `/contratos/<id>/status` | Altera o status |
| GET | `/contratos/acompanhar` | Lista contratos por status |
| GET | `/contratos/<id>/acompanhar` | Acompanha um contrato |
| POST | `/contratos/<id>/cancelar` | Cancelamento pelo cliente |
| POST | `/contratos/<id>/cancelar-cuidador` | Cancelamento pelo cuidador |
| GET | `/contratos/<id>/verificar-cancelamento` | Verifica se pode cancelar |
| GET | `/meu-historico` | Histórico de serviços do usuário |

### Itens do contrato
| Método | Rota | Descrição |
|---|---|---|
| POST | `/itensContrato` | Vincula um serviço a um contrato |
| GET | `/itensContrato` | Lista os vínculos |
| GET | `/itensContrato/<idContrato>` | Serviços de um contrato |
| DELETE | `/itensContrato/<idContrato>/<idServico>` | Remove um vínculo |

> A chave é composta (`idContrato` + `idServico`), então não há rota `PUT`.

### Lista de serviços
| Método | Rota | Descrição |
|---|---|---|
| POST | `/listasServicos` | Cadastra um tipo de serviço |
| GET | `/listasServicos` | Lista serviços e preços base |
| GET | `/listasServicos/<id>` | Busca um serviço |
| PUT | `/listasServicos/<id>` | Atualiza um serviço |
| DELETE | `/listasServicos/<id>` | Remove um serviço |

### Agenda, tarefas e lembretes
| Método | Rota | Descrição |
|---|---|---|
| POST / GET | `/agendas` | Cria e lista compromissos |
| GET / PUT / DELETE | `/agendas/<id>` | Busca, atualiza e remove um compromisso |
| POST / GET | `/tarefas` | Cria e lista tarefas |
| GET / PUT / DELETE | `/tarefas/<id>` | Busca, atualiza e remove uma tarefa |
| GET | `/minha-agenda?inicio=&fim=&status=` | Agenda do usuário (JWT) |
| PATCH | `/minha-agenda/<id>/status` | Conclui ou reabre uma tarefa (JWT) |
| PATCH | `/minha-agenda/<id>/horario` | Altera o horário (JWT) |
| PATCH | `/minha-agenda/<id>/mover` | Move para outra data (JWT) |
| DELETE | `/minha-agenda/<id>` | Exclui a tarefa da agenda (JWT) |
| POST / GET | `/lembretes` | Cria e lista lembretes do usuário (JWT) |

### Avaliações e denúncias
| Método | Rota | Descrição |
|---|---|---|
| POST / GET | `/avaliacoess` | Cria e lista avaliações |
| GET / PUT / DELETE | `/avaliacoess/<id>` | Busca, atualiza e remove uma avaliação |
| POST / GET | `/denuncias` | Cria e lista denúncias |
| GET / PUT / DELETE | `/denuncias/<id>` | Busca, atualiza e remove uma denúncia |

> A rota de avaliações usa o prefixo `/avaliacoess` (com dois "s"), exatamente como está no código.

### Chat e notificações
| Método | Rota | Descrição |
|---|---|---|
| POST | `/mensagens` | Envia uma mensagem |
| GET | `/contratos/<id>/mensagens` | Mensagens de um contrato |
| PATCH | `/contratos/<id>/mensagens/lidas` | Marca mensagens como lidas |
| DELETE | `/mensagens/<id>` | Remove uma mensagem |
| GET | `/notificacoes` | Lista as notificações |
| PATCH | `/notificacoes/lidas` | Marca todas como lidas |
| PATCH | `/notificacoes/<id>/lida` | Marca uma notificação como lida |

## Telas (frontend)
| Tela | Descrição |
|---|---|
| `index.html` | Página inicial |
| `login.html` | Login |
| `usuarios.html`, `perfis.html`, `meu-perfil.html` | Usuários, perfis e perfil do usuário logado |
| `clientes.html`, `cuidadores.html`, `busca-cuidadores.html` | Clientes, cuidadores e busca com filtros |
| `contratos.html`, `itens-contrato.html`, `lista-servicos.html` | Contratos, serviços do contrato e preços |
| `agenda.html`, `tarefas.html`, `minha-agenda.html`, `lembretes.html` | Agenda, tarefas, agenda do usuário e lembretes |
| `avaliacoes.html`, `denuncias.html` | Avaliações e denúncias |
| `mensagens.html`, `notificacoes.html`, `historico.html` | Chat, notificações e histórico de serviços |

## Banco de dados

### Tabelas
`Usuario`, `Perfil`, `Cliente`, `Cuidador`, `Contrato`, `ItensContrato`, `ListaServicos`, `Agenda`, `Tarefa`, `Avaliacoes`, `Denuncias`, `Mensagem`, `Notificacao`, `Lembrete`.

### Procedures (chamadas apenas pelos Repositories)
| Procedure | Parâmetros | O que faz |
|---|---|---|
| `BuscarCuidadoresFiltro` | `p_cidade`, `p_ordenar_por_nota` | Cuidadores por cidade, com opção de ordenar pela nota média |
| `EncontrarCuidadoresDisponiveis` | `p_data` | Cuidadores sem contrato aceito na data, ordenados por nota |
| `IdentificarTipoUsuario` | `p_idUsuario` | Indica se o usuário é cliente, cuidador ou ambos |
| `RelatorioContratosCliente` | `p_idCliente` | Histórico de contratos do cliente, com serviços agrupados |
| `HistoricoDeServicos` | `p_idUsuario` | Contratos do usuário como cliente ou cuidador, com serviços agrupados |
| `FiltrarCuidadores` | `p_cidade`, `p_estado`, `p_valor_max`, `p_nota_min`, `p_data`, `p_ordenar` | Filtro avançado de cuidadores |
| `AvaliacoesDoUsuario` | `p_idUsuario` | Avaliações recebidas por um usuário |

### Repositories
| Repository (arquivo) | Uso |
|---|---|
| `filtrarCuidadores_repository`, `filtrarCuidadoresAvancado_repository` | Busca e filtros de cuidadores |
| `cuidadoresDisponiveis_repository` | Cuidadores disponíveis por data |
| `cuidadorImediato_repository` | Ajuda imediata |
| `tipoUsuario_repository` | Tipo do usuário |
| `RelatorioContratos_repository`, `historicoServicos_repository` | Relatório e histórico de contratos |
| `avaliacoesDoUsuario_repository` | Avaliações recebidas |
| `agenda_tarefas_repository` | Agenda de tarefas do usuário |
| `lembrete_repository` | Lembretes do usuário |
| `mensagem_repository`, `conversas_repository` | Mensagens e conversas |

## Status das entidades
| Entidade | Status |
|---|---|
| Usuario, Perfil, Cuidador, Contrato, Agenda, Tarefa, Avaliacoes, Denuncias, ListaServicos | ✅ CRUD completo (back + front) |
| Cliente, ItensContrato | ✅ Criar, listar e excluir (back + front) |
| Mensagem, Notificacao, Lembrete | ✅ Funcionalidades específicas (back + front) |
