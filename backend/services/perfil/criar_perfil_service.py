# app/services/perfil/criar_perfil_service.py
from extensions import db
from models.usuario import Usuario
from models.perfil import Perfil
from models.cliente import Cliente
from models.cuidador import Cuidador
from datetime import datetime
from sqlalchemy.exc import IntegrityError


class CriarPerfilService:
    @staticmethod
    def executar(dados):
        try:
            data_nasc = datetime.strptime(dados.get('dataNascimento'), '%Y-%m-%d')
            if data_nasc.year < 1900 or data_nasc.year > 2026:
                raise ValueError("Data de nascimento inválida.")
        except (ValueError, TypeError):
            raise ValueError("Data de nascimento inválida.")

        tipo = dados.get('tipo')
        if tipo not in ('cliente', 'cuidador'):
            raise ValueError("Informe o tipo: 'cliente' ou 'cuidador'.")

        if tipo == 'cuidador':
            if not dados.get('certificado') or not dados.get('orgaoEmissor'):
                raise ValueError("Cuidador precisa informar certificado e órgão emissor.")

        novo_usuario = Usuario(
            cpf=dados.get('cpf'),
            endereco=dados.get('endereco'),
            telefone=dados.get('telefone'),
            email=dados.get('email'),
            dataNascimento=dados.get('dataNascimento'),
            senha=dados.get('senha')
        )

        try:
            novo_usuario.salvar()

            novo_perfil = Perfil(
                idUsuario=novo_usuario.idUsuario,
                fotoURL=dados.get('fotoURL'),
                nome=dados.get('nome'),
                bio=dados.get('bio'),
                cidade=dados.get('cidade'),
                estado=dados.get('estado')
            )
            novo_perfil.salvar()

            if tipo == 'cliente':
                Cliente(idUsuario=novo_usuario.idUsuario).salvar()
            else:
                Cuidador(
                    idUsuario=novo_usuario.idUsuario,
                    certificado=dados.get('certificado'),
                    orgaoEmissor=dados.get('orgaoEmissor'),
                    valorServico=dados.get('valorServico', 0.00),
                    disponibilidade=dados.get('disponibilidade')
                ).salvar()

        except IntegrityError:
            db.session.rollback()
            raise ValueError("Já existe um usuário com esse CPF ou email.")

        except Exception as erro:
            db.session.rollback()
            if novo_usuario.idUsuario:
                novo_usuario.deletar()
            raise erro

        return {
            "usuario": novo_usuario.to_dict(),
            "perfil": novo_perfil.to_dict(),
            "tipo": tipo
        }