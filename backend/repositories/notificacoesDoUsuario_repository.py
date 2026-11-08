from datetime import datetime, timedelta
from sqlalchemy import or_
from sqlalchemy.orm import aliased
from extensions import db
from models.contrato import Contrato
from models.lembrete import Lembrete
from models.avaliacoes import Avaliacoes
from models.tarefa import Tarefa
from models.agenda import Agenda
from models.mensagem import Mensagem
from models.perfil import Perfil

class NotificacoesDoUsuarioRepository:

    @staticmethod
    def _texto_dt(valor):
        return valor.strftime('%Y-%m-%d %H:%M:%S') if valor else None

    @staticmethod
    def _hora(valor):
        if isinstance(valor, timedelta):
            return (datetime.min + valor).time()
        return valor

    @staticmethod
    def contratos(id_usuario):
        cliente = aliased(Perfil)
        cuidador = aliased(Perfil)
        linhas = (db.session.query(Contrato, cliente.nome, cuidador.nome)
                  .outerjoin(cliente, Contrato.idCliente == cliente.idUsuario)
                  .outerjoin(cuidador, Contrato.idCuidador == cuidador.idUsuario)
                  .filter(or_(Contrato.idCliente == id_usuario, Contrato.idCuidador == id_usuario))
                  .order_by(Contrato.dataContrato.desc(), Contrato.idContrato.desc())
                  .limit(50)
                  .all())

        lista = []
        for contrato, nome_cliente, nome_cuidador in linhas:
            sou_cuidador = contrato.idCuidador == id_usuario
            lista.append({
                "idContrato": contrato.idContrato,
                "papel": 'cuidador' if sou_cuidador else 'cliente',
                "statusContrato": contrato.statusContrato,
                "imediato": bool(contrato.imediato),
                "dataContrato": NotificacoesDoUsuarioRepository._texto_dt(contrato.dataContrato),
                "dataAtendimento": contrato.dataAtendimento.strftime('%Y-%m-%d') if contrato.dataAtendimento else None,
                "nomeOutraPessoa": nome_cliente if sou_cuidador else nome_cuidador
            })
        return lista

    @staticmethod
    def lembretes_proximos(id_usuario, agora=None):
        agora = agora or datetime.now()
        inicio = agora - timedelta(hours=1)
        fim = agora + timedelta(hours=24)

        candidatos = (Lembrete.query
                      .filter(Lembrete.idUsuario == id_usuario,
                              Lembrete.dataLembrete >= inicio.date(),
                              Lembrete.dataLembrete <= fim.date())
                      .all())

        lista = []
        for l in candidatos:
            quando = datetime.combine(l.dataLembrete, NotificacoesDoUsuarioRepository._hora(l.horaLembrete))
            if inicio <= quando <= fim:
                lista.append({"idLembrete": l.idLembrete, "titulo": l.titulo,
                              "quando": NotificacoesDoUsuarioRepository._texto_dt(quando)})
        lista.sort(key=lambda item: item["quando"])
        return lista

    @staticmethod
    def avaliacoes_recentes(id_usuario, agora=None):
        # Avaliações recebidas nos últimos 7 dias
        agora = agora or datetime.now()
        linhas = (db.session.query(Avaliacoes, Perfil.nome)
                  .outerjoin(Perfil, Avaliacoes.idAvaliador == Perfil.idUsuario)
                  .filter(Avaliacoes.idAvaliado == id_usuario,
                          Avaliacoes.dataAvaliacao >= agora - timedelta(days=7))
                  .order_by(Avaliacoes.dataAvaliacao.desc(), Avaliacoes.idAvaliacao.desc())
                  .limit(20)
                  .all())
        return [{
            "idAvaliacao": a.idAvaliacao,
            "nomeAvaliador": nome,
            "nota": a.nota,
            "dataAvaliacao": NotificacoesDoUsuarioRepository._texto_dt(a.dataAvaliacao)
        } for a, nome in linhas]

    @staticmethod
    def tarefas_proximas(id_usuario, agora=None):
        # Tarefas pendentes, com aviso ligado, nas próximas 24 horas
        agora = agora or datetime.now()
        fim = agora + timedelta(hours=24)

        linhas = (db.session.query(Tarefa, Agenda, Contrato)
                  .join(Agenda, Tarefa.idAgenda == Agenda.idAgenda)
                  .join(Contrato, Agenda.idContrato == Contrato.idContrato)
                  .filter(or_(Contrato.idCliente == id_usuario, Contrato.idCuidador == id_usuario),
                          Tarefa.statusTarefa == 'pendente',
                          Tarefa.notificacao.is_(True),
                          Contrato.statusContrato.in_(['pendente', 'aceito']),
                          Agenda.dataAgenda >= agora.date(),
                          Agenda.dataAgenda <= fim.date())
                  .all())

        lista = []
        for tarefa, agenda, contrato in linhas:
            quando = datetime.combine(agenda.dataAgenda, NotificacoesDoUsuarioRepository._hora(tarefa.horaTarefa))
            if agora <= quando <= fim:
                lista.append({"idTarefa": tarefa.idTarefa, "idContrato": contrato.idContrato,
                              "descricao": tarefa.descricao,
                              "quando": NotificacoesDoUsuarioRepository._texto_dt(quando)})
        lista.sort(key=lambda item: item["quando"])
        return lista

    @staticmethod
    def mensagens_nao_lidas(id_usuario):
        linhas = (db.session.query(Mensagem, Perfil.nome)
                  .join(Contrato, Mensagem.idContrato == Contrato.idContrato)
                  .outerjoin(Perfil, Mensagem.idRemetente == Perfil.idUsuario)
                  .filter(or_(Contrato.idCliente == id_usuario, Contrato.idCuidador == id_usuario),
                          Mensagem.idRemetente != id_usuario,
                          or_(Mensagem.lida.is_(False), Mensagem.lida.is_(None)))
                  .all())

        conversas = {}
        for mensagem, nome in linhas:
            chave = (mensagem.idContrato, mensagem.idRemetente)
            c = conversas.setdefault(chave, {"idContrato": mensagem.idContrato, "nomeRemetente": nome,
                                             "qtd": 0, "ultima": None})
            c["qtd"] += 1
            if mensagem.dataEnvio and (c["ultima"] is None or mensagem.dataEnvio > c["ultima"]):
                c["ultima"] = mensagem.dataEnvio

        lista = list(conversas.values())
        for c in lista:
            c["ultima"] = NotificacoesDoUsuarioRepository._texto_dt(c["ultima"])
        return lista