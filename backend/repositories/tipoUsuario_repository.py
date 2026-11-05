from extensions import db

class TipoUsuarioRepository:
    @staticmethod
    def identificar_tipo(id_usuario):
        query = db.text("CALL IdentificarTipoUsuario(:id_usuario)")
        result = db.session.execute(query, {"id_usuario": id_usuario}).fetchone()

        if not result:
            return None

        return {
            "idUsuario": result[0],
            "nome": result[1],
            "fotoURL": result[2],
            "Cliente": bool(result[3]),
            "Cuidador": bool(result[4])
        }