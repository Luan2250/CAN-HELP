from sqlalchemy import select, func, and_
from extensions import db
from models.cuidador import Cuidador
from models.perfil import Perfil
from models.contrato import Contrato
from models.avaliacoes import Avaliacoes


class CuidadorImediatoRepository:
    @staticmethod
    def buscar_melhor_disponivel(data, id_cliente, cidade=None):
        """Retorna o idUsuario do cuidador mais bem avaliado que está livre
        na data informada, ou None se não houver nenhum."""

        ocupados = select(Contrato.idCuidador).where(
            Contrato.dataAtendimento == data,
            Contrato.statusContrato.in_(['aceito', 'pendente'])
        )

        nota_media = func.coalesce(func.avg(Avaliacoes.nota), 0)

        query = (
            db.session.query(Cuidador.idUsuario)
            .outerjoin(
                Avaliacoes,
                and_(Avaliacoes.idAvaliado == Cuidador.idUsuario,
                     Avaliacoes.tipoAvaliador == 'cliente')
            )
            .filter(Cuidador.idUsuario != id_cliente)      # não chamar a si mesmo
            .filter(Cuidador.idUsuario.not_in(ocupados))
        )

        if cidade:
            query = query.join(Perfil, Perfil.idUsuario == Cuidador.idUsuario) \
                         .filter(Perfil.cidade.like(f'%{cidade}%'))

        linha = (query.group_by(Cuidador.idUsuario)
                      .order_by(nota_media.desc(), Cuidador.idUsuario.asc())
                      .first())

        return linha[0] if linha else None