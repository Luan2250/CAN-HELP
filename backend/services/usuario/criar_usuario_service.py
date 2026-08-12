# app/services/usuario/criar_usuario_service.py
from models.usuario import Usuario  

class CriarUsuarioService:
    @staticmethod
    def executar(dados):
        # Cria a instância do usuário com os dados recebidos do controller
        novo_usuario = Usuario(
            cpf=dados.get('cpf'),
            endereco=dados.get('endereco'),
            telefone=dados.get('telefone'),
            email=dados.get('email'),
            dataNascimento=dados.get('dataNascimento'),
            senha=dados.get('senha')  # Aqui você aplicaria criptografia depois
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_usuario.salvar()
        
        return novo_usuario