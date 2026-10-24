from extensions import db

class HistoricoServicosRepository:
    @staticmethod
    def historico_servicos(id_usuario):
        query = db.text("CALL HistoricoDeServicos(:id_usuario)")
        result = db.session.execute(query, {"id_usuario": id_usuario}).fetchall()

        historico = []
        for row in result:
            historico.append({
                "idContrato": row[0],
                "papel": row[1],
                "nomeCliente": row[2],
                "nomeCuidador": row[3],
                "dataContrato": row[4].strftime('%Y-%m-%d %H:%M:%S') if row[4] else None,
                "dataAtendimento": row[5].strftime('%Y-%m-%d') if row[5] else None,
                "localizacao": row[6],
                "nomeAuxiliado": row[7],
                "statusContrato": row[8],
                "valorFinal": float(row[9]) if row[9] is not None else 0.0,
                "servicosContratados": row[10] if row[10] else "Nenhum"
            })
        return historico
