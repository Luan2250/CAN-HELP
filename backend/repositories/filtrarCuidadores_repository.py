from extensions import db

class FiltrarCuidadorRepository:
    @staticmethod
    def filtrar_cuidadores(cidade=None, ordenar_por_nota=False):
        # Converte booleano do Python para 1 ou 0 do MySQL
        ordem_nota = 1 if ordenar_por_nota else 0
        
        # Chama a procedure passando os parâmetros recebidos da rota
        query = db.text("CALL BuscarCuidadoresFiltro(:cidade, :ordem_nota)")
        result = db.session.execute(query, {"cidade": cidade, "ordem_nota": ordem_nota}).fetchall()
        
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