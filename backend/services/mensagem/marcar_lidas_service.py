from models.contrato import Contrato
from models.mensagem import Mensagem


class MarcarLidasService:
    @staticmethod
    def executar(idContrato, idUsuario):
        if not idUsuario:
            raise ValueError("idUsuario é obrigatório")

        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")

        idUsuario = int(idUsuario)
        if idUsuario not in (contrato.idCliente, contrato.idCuidador):
            raise ValueError("Usuário não faz parte deste contrato")

        total = Mensagem.marcar_lidas_por_contrato(idContrato, idUsuario)
        return {"mensagensMarcadas": total}
