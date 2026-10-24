from datetime import datetime
from repositories.filtrarCuidadoresAvancado_repository import FiltrarCuidadoresAvancadoRepository

ORDENACOES_VALIDAS = ('nota', 'valor_asc', 'valor_desc')

class FiltrarCuidadoresAvancadoService:
    @staticmethod
    def execute(cidade=None, estado=None, valor_max=None, nota_min=None, data=None, ordenar=None):
        cidade = cidade.strip() if cidade else None
        estado = estado.strip() if estado else None

        if valor_max not in (None, ''):
            try:
                valor_max = float(valor_max)
            except ValueError:
                raise ValueError("valor_max deve ser um número.")
            if valor_max < 0:
                raise ValueError("valor_max não pode ser negativo.")
        else:
            valor_max = None

        if nota_min not in (None, ''):
            try:
                nota_min = float(nota_min)
            except ValueError:
                raise ValueError("nota_min deve ser um número.")
            if not 0 <= nota_min <= 5:
                raise ValueError("nota_min deve estar entre 0 e 5.")
        else:
            nota_min = None

        if data:
            try:
                datetime.strptime(data, '%Y-%m-%d')
            except ValueError:
                raise ValueError("data deve estar no formato AAAA-MM-DD.")
        else:
            data = None

        if ordenar and ordenar not in ORDENACOES_VALIDAS:
            raise ValueError("ordenar deve ser: " + ", ".join(ORDENACOES_VALIDAS) + ".")
        ordenar = ordenar or None

        return FiltrarCuidadoresAvancadoRepository.filtrar_cuidadores(cidade, estado, valor_max, nota_min, data, ordenar)
