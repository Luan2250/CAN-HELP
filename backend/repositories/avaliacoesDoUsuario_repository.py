from extensions import db

class AvaliacoesDoUsuarioRepository:
    @staticmethod
    def avaliacoes_do_usuario(id_usuario):
        query = db.text("CALL AvaliacoesDoUsuario(:id_usuario)")
        result = db.session.execute(query, {"id_usuario": id_usuario}).fetchall()

        avaliacoes = []
        for row in result:
            avaliacoes.append({
                "idAvaliacao": row[0],
                "nomeAvaliador": row[1],
                "tipoAvaliador": row[2],
                "nota": row[3],
                "comentario": row[4],
                "dataAvaliacao": row[5].strftime('%Y-%m-%d') if row[5] else None
            })
        return avaliacoes