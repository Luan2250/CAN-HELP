# app/services/usuario/criar_usuario_service.py
from models.usuario import Usuario  

class CriarUsuarioService:
    @staticmethod
    def executar(dados):
        # Cria a instância do usuário com os dados recebidos do controller
        # (repare que 'senha' NÃO entra mais direto no construtor)
        novo_usuario = Usuario(
            cpf=dados.get('cpf'),
            endereco=dados.get('endereco'),
            telefone=dados.get('telefone'),
            email=dados.get('email'),
            dataNascimento=dados.get('dataNascimento')
        )

        # Gera o hash da senha em texto puro recebida do formulário,
        # e só então guarda no objeto.
        novo_usuario.definir_senha(dados.get('senha'))

        # Chama o método salvar que criamos na Model (Active Record)
        novo_usuario.salvar()
        
        return novo_usuario