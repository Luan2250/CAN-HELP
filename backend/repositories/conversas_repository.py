from models.contrato import Contrato
from models.mensagem import Mensagem
from models.perfil import Perfil


class ConversasRepository:
    @staticmethod
    def listar_por_usuario(idUsuario):
        """Retorna, para cada contrato em que o usuário é cliente ou
        cuidador, um resumo da conversa (com quem é, última mensagem e
        quantidade de mensagens não lidas) pra montar a lista de chats."""
        contratos = Contrato.query.filter(
            (Contrato.idCliente == idUsuario) | (Contrato.idCuidador == idUsuario)
        ).all()

        conversas = []
        for contrato in contratos:
            eh_cliente = contrato.idCliente == idUsuario
            idOutroUsuario = contrato.idCuidador if eh_cliente else contrato.idCliente
            perfilOutro = Perfil.buscar_por_id(idOutroUsuario)

            ultimaMensagem = Mensagem.query.filter_by(idContrato=contrato.idContrato) \
                .order_by(Mensagem.dataEnvio.desc(), Mensagem.idMensagem.desc()).first()

            naoLidas = Mensagem.contar_nao_lidas(contrato.idContrato, idUsuario)

            conversas.append({
                "idContrato": contrato.idContrato,
                "nomeAuxiliado": contrato.nomeAuxiliado,
                "statusContrato": contrato.statusContrato,
                "idOutroUsuario": idOutroUsuario,
                "nomeOutroUsuario": perfilOutro.nome if perfilOutro else "Usuário",
                "fotoOutroUsuario": perfilOutro.fotoURL if perfilOutro else None,
                "papelOutroUsuario": "cuidador" if eh_cliente else "cliente",
                "ultimaMensagem": ultimaMensagem.texto if ultimaMensagem else None,
                "dataUltimaMensagem": ultimaMensagem.dataEnvio.isoformat() if ultimaMensagem and ultimaMensagem.dataEnvio else None,
                "naoLidas": naoLidas
            })

        conversas.sort(key=lambda c: c["dataUltimaMensagem"] or "", reverse=True)
        return conversas
