from extensions import db

class FiltrarCuidadoresAvancadoRepository:
    @staticmethod
    def filtrar_cuidadores(cidade=None, estado=None, valor_max=None, nota_min=None, data=None, ordenar=None):
        # Chama a procedure passando os filtros recebidos da rota (None = filtro não aplicado)
        query = db.text(
            "CALL FiltrarCuidadores(:cidade, :estado, :valor_max, :nota_min, :data, :ordenar)"
        )
        result = db.session.execute(query, {
            "cidade": cidade,
            "estado": estado,
            "valor_max": valor_max,
            "nota_min": nota_min,
            "data": data,
            "ordenar": ordenar
        }).fetchall()

        # Transforma o resultado do banco em uma lista de dicionários legível para o Flask
        cuidadores = []
        for row in result:
            cuidadores.append({
                "idUsuario": row[0],
                "nome": row[1],
                "fotoURL": row[2],
                "bio": row[3],
                "cidade": row[4],
                "estado": row[5],
                "valorServico": float(row[6]),
                "disponibilidade": row[7],
                "notaMedia": float(row[8])
            })
        return cuidadores
