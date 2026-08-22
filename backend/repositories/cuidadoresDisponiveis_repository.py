from extensions import db

class CuidadoresDisponiveisRepository:
    @staticmethod
    def buscar_disponiveis(data):
        query = db.text("CALL EncontrarCuidadoresDisponiveis(:data)")
        result = db.session.execute(query, {"data": data}).fetchall()

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