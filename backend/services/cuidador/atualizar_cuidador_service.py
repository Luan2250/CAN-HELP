from models.cuidador import Cuidador

class AtualizarCuidadorService:
    @staticmethod
    def executar(id_usuario, dados):
        cuidador = Cuidador.buscar_por_id(id_usuario)
        if not cuidador:
            return None
        
        cuidador.atualizar(
            certificado=dados.get('certificado'),
            orgaoEmissor=dados.get('orgaoEmissor'),
            valorServico=dados.get('valorServico'),
            disponibilidade=dados.get('disponibilidade')
        )
        return cuidador