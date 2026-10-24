from models.contrato import Contrato

class ListarContratosPorStatusService:
    @staticmethod
    def executar(status=None, id_usuario=None, tipo_usuario=None):
        
        query = Contrato.query
        
        if status:
            status_validos = ['pendente', 'aceito', 'recusado', 
                             'cancelado_cliente', 'cancelado_cuidador', 'concluido']
            if status not in status_validos:
                raise ValueError(f"Status inválido: {status}")
            query = query.filter_by(statusContrato=status)
        
        if id_usuario and tipo_usuario:
            if tipo_usuario == 'cliente':
                query = query.filter_by(idCliente=id_usuario)
            elif tipo_usuario == 'cuidador':
                query = query.filter_by(idCuidador=id_usuario)
            else:
                raise ValueError("Tipo de usuário deve ser 'cliente' ou 'cuidador'")
        
        return query.all()