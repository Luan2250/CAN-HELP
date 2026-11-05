from models.lembrete import Lembrete
 
class LembreteRepository:
    @staticmethod
    def listar_por_usuario(id_usuario):
        return (Lembrete.query
                .filter_by(idUsuario=id_usuario)
                .order_by(Lembrete.dataLembrete, Lembrete.horaLembrete)
                .all())
 