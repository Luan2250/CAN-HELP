from models.mensagem import Mensagem
from models.contrato import Contrato


class CriarMensagemService:
    @staticmethod
    def executar(dados):
        idContrato = dados.get('idContrato')
        idRemetente = dados.get('idRemetente')
        texto = (dados.get('texto') or '').strip()

        if not idContrato or not idRemetente:
            raise ValueError("idContrato e idRemetente são obrigatórios")

        if not texto:
            raise ValueError("A mensagem não pode ser vazia")

        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")

        # Só o cliente e o cuidador daquele contrato podem conversar entre si
        if int(idRemetente) not in (contrato.idCliente, contrato.idCuidador):
            raise ValueError("Usuário não faz parte deste contrato")

        nova_mensagem = Mensagem(
            idContrato=idContrato,
            idRemetente=idRemetente,
            texto=texto
        )
        nova_mensagem.salvar()

        return nova_mensagem
