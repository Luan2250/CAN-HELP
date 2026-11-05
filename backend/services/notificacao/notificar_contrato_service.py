from services.notificacao.criar_notificacao_service import CriarNotificacaoService

class NotificarContratoService:
    POR_STATUS = {
        'aceito': ('cliente', 'Seu serviço de {data} foi aceito pelo cuidador.'),
        'recusado': ('cliente', 'Seu serviço de {data} foi recusado pelo cuidador.'),
        'concluido': ('cliente', 'Seu serviço de {data} foi concluído.'),
        'cancelado_cuidador': ('cliente', 'O cuidador cancelou o serviço de {data}.'),
        'cancelado_cliente': ('cuidador', 'O cliente cancelou o serviço de {data}.'),
    }

    @staticmethod
    def nova_solicitacao(contrato):
        data = NotificarContratoService._data(contrato)
        CriarNotificacaoService.executar(
            contrato.idCuidador,
            f'Você recebeu uma nova solicitação de serviço para {data}.',
            contrato.idContrato
        )

    @staticmethod
    def status_alterado(contrato, novo_status):
        regra = NotificarContratoService.POR_STATUS.get(novo_status)
        if not regra:
            return 

        destinatario, texto = regra
        id_destino = contrato.idCliente if destinatario == 'cliente' else contrato.idCuidador
        CriarNotificacaoService.executar(
            id_destino,
            texto.format(data=NotificarContratoService._data(contrato)),
            contrato.idContrato
        )

    @staticmethod
    def _data(contrato):
        return contrato.dataAtendimento.strftime('%d/%m/%Y') if contrato.dataAtendimento else ''