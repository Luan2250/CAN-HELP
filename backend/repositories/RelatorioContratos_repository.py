from extensions import db

class RelatorioContratoRepository:
    @staticmethod
    def relatorio_contratos(id_cliente):
        query = db.text("CALL RelatorioContratosCliente(:id_cliente)")
        result = db.session.execute(query, {"id_cliente": id_cliente}).fetchall()
        
        historico = []
        for row in result:
            historico.append({
                "idContrato": row[0],
                "nomeCuidador": row[1],
                "dataAtendimento": row[2].strftime('%Y-%m-%d') if row[2] else None,
                "nomeAuxiliado": row[3],
                "statusContrato": row[4],
                "valorFinal": float(row[5]),
                "servicosContratados": row[6] if row[6] else "Nenhum"
            })
        return historico