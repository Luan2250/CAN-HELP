import traceback
from datetime import datetime
from extensions import db
from repositories.notificacoesDoUsuario_repository import NotificacoesDoUsuarioRepository as Repo

class ListarNotificacoesService:
    TEXTOS_CONTRATO = {
        ('cuidador', 'pendente'): 'Nova solicitação de {nome} para {data}.',
        ('cuidador', 'cancelado_cliente'): '{nome} cancelou o serviço de {data}.',
        ('cliente', 'pendente'): 'Sua solicitação para {nome} em {data} foi enviada e aguarda resposta.',
        ('cliente', 'aceito'): '{nome} aceitou o seu serviço de {data}.',
        ('cliente', 'recusado'): '{nome} recusou o seu serviço de {data}.',
        ('cliente', 'concluido'): 'Seu serviço de {data} com {nome} foi concluído.',
        ('cliente', 'cancelado_cuidador'): '{nome} cancelou o serviço de {data}.',
    }
    TEXTO_IMEDIATO = 'PEDIDO DE AJUDA IMEDIATA de {nome} para {data}.'

    @staticmethod
    def executar(id_usuario, agora=None):
        if not id_usuario:
            raise ValueError("O ID do usuário é obrigatório para consultar as notificações.")

        agora = agora or datetime.now()

        notificacoes = []
        notificacoes += ListarNotificacoesService._coletar(ListarNotificacoesService._de_contratos, id_usuario)
        notificacoes += ListarNotificacoesService._coletar(ListarNotificacoesService._de_lembretes, id_usuario, agora)
        notificacoes += ListarNotificacoesService._coletar(ListarNotificacoesService._de_avaliacoes, id_usuario, agora)
        notificacoes += ListarNotificacoesService._coletar(ListarNotificacoesService._de_tarefas, id_usuario, agora)
        notificacoes += ListarNotificacoesService._coletar(ListarNotificacoesService._de_mensagens, id_usuario)

        notificacoes.sort(key=lambda n: n["quando"] or "", reverse=True)
        return {"total": len(notificacoes), "notificacoes": notificacoes}

    # ---------- uma fonte por método ----------

    @staticmethod
    def _de_contratos(id_usuario):
        lista = []
        for c in Repo.contratos(id_usuario):
            if c["papel"] == 'cuidador' and c["statusContrato"] == 'pendente' and c["imediato"]:
                texto = ListarNotificacoesService.TEXTO_IMEDIATO
            else:
                texto = ListarNotificacoesService.TEXTOS_CONTRATO.get((c["papel"], c["statusContrato"]))
            if not texto:
                continue
            lista.append({
                "id": f'contrato-{c["idContrato"]}-{c["statusContrato"]}',
                "categoria": 'contrato',
                "tipo": c["statusContrato"],
                "idContrato": c["idContrato"],
                "imediato": c["imediato"],
                "mensagem": texto.format(
                    nome=c["nomeOutraPessoa"] or 'Alguém',
                    data=ListarNotificacoesService._data_br(c["dataAtendimento"])
                ),
                "quando": c["dataContrato"],
                "link": 'meus-contratos.html'
            })
        return lista

    @staticmethod
    def _de_lembretes(id_usuario, agora):
        lista = []
        for l in Repo.lembretes_proximos(id_usuario, agora):
            lista.append({
                "id": f'lembrete-{l["idLembrete"]}-{l["quando"]}',
                "categoria": 'lembrete',
                "tipo": 'proximo',
                "idContrato": None,
                "imediato": False,
                "mensagem": f'Lembrete: {l["titulo"]} — {ListarNotificacoesService._quando_texto(l["quando"], agora)}.',
                "quando": l["quando"],
                "link": 'lembretes.html'
            })
        return lista

    @staticmethod
    def _de_avaliacoes(id_usuario, agora):
        lista = []
        for a in Repo.avaliacoes_recentes(id_usuario, agora):
            lista.append({
                "id": f'avaliacao-{a["idAvaliacao"]}',
                "categoria": 'avaliacao',
                "tipo": 'recebida',
                "idContrato": None,
                "imediato": False,
                "mensagem": f'{a["nomeAvaliador"] or "Alguém"} avaliou você: nota {a["nota"]}/5.',
                "quando": a["dataAvaliacao"],
                "link": 'avaliacoes.html'
            })
        return lista

    @staticmethod
    def _de_tarefas(id_usuario, agora):
        lista = []
        for t in Repo.tarefas_proximas(id_usuario, agora):
            descricao = (t["descricao"] or '').strip()
            if len(descricao) > 60:
                descricao = descricao[:60] + '…'
            lista.append({
                "id": f'tarefa-{t["idTarefa"]}-{t["quando"]}',
                "categoria": 'tarefa',
                "tipo": 'proxima',
                "idContrato": t["idContrato"],
                "imediato": False,
                "mensagem": f'Tarefa: {descricao} — {ListarNotificacoesService._quando_texto(t["quando"], agora)}.',
                "quando": t["quando"],
                "link": 'minha-agenda.html'
            })
        return lista

    @staticmethod
    def _de_mensagens(id_usuario):
        lista = []
        for m in Repo.mensagens_nao_lidas(id_usuario):
            plural = 'mensagem não lida' if m["qtd"] == 1 else 'mensagens não lidas'
            lista.append({
                "id": f'mensagem-{m["idContrato"]}-{m["qtd"]}',
                "categoria": 'mensagem',
                "tipo": 'nao_lida',
                "idContrato": m["idContrato"],
                "imediato": False,
                "mensagem": f'{m["nomeRemetente"] or "Alguém"} enviou {m["qtd"]} {plural}.',
                "quando": m["ultima"],
                "link": 'chat.html'
            })
        return lista


    @staticmethod
    def _coletar(funcao, *args):
        try:
            return funcao(*args)
        except Exception:
            traceback.print_exc()
            db.session.rollback()
            return []

    @staticmethod
    def _data_br(data_iso):
        return '/'.join(reversed(data_iso.split('-'))) if data_iso else ''

    @staticmethod
    def _quando_texto(quando, agora):
        dt = datetime.strptime(quando, '%Y-%m-%d %H:%M:%S')
        hora = dt.strftime('%H:%M')
        dias = (dt.date() - agora.date()).days
        if dias == 0:
            return f'hoje às {hora}'
        if dias == 1:
            return f'amanhã às {hora}'
        if dias == -1:
            return f'ontem às {hora}'
        return f'{dt.strftime("%d/%m")} às {hora}'