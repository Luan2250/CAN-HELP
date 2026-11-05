from extensions import db


class MensagemRepository:
    @staticmethod
    def listar_por_contrato(idContrato):
        """Lista as mensagens de um contrato já trazendo o nome/foto do
        remetente (via JOIN com Perfil), pra o chat não precisar fazer
        uma requisição extra pra cada mensagem."""
        query = db.text("""
            SELECT m.idMensagem, m.idContrato, m.idRemetente, m.texto,
                   m.dataEnvio, m.lida, p.nome, p.fotoURL
            FROM Mensagem m
            LEFT JOIN perfil p ON p.idUsuario = m.idRemetente
            WHERE m.idContrato = :idContrato
            ORDER BY m.dataEnvio ASC, m.idMensagem ASC
        """)
        result = db.session.execute(query, {"idContrato": idContrato}).fetchall()

        mensagens = []
        for row in result:
            mensagens.append({
                "idMensagem": row[0],
                "idContrato": row[1],
                "idRemetente": row[2],
                "texto": row[3],
                "dataEnvio": row[4].isoformat() if row[4] else None,
                "lida": bool(row[5]),
                "nomeRemetente": row[6] or "Usuário",
                "fotoRemetente": row[7]
            })
        return mensagens
