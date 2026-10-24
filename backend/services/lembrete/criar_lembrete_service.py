from datetime import datetime
from models.lembrete import Lembrete
 
class CriarLembreteService:
    @staticmethod
    def executar(id_usuario, dados):
        titulo = (dados.get('titulo') or '').strip()
        if not titulo:
            raise ValueError('Título é obrigatório.')
        if len(titulo) > 100:
            raise ValueError('Título deve ter no máximo 100 caracteres.')
 
        descricao = (dados.get('descricao') or '').strip() or None
        if descricao and len(descricao) > 255:
            raise ValueError('Descrição deve ter no máximo 255 caracteres.')
 
        try:
            data = datetime.strptime(dados.get('dataLembrete') or '', '%Y-%m-%d').date()
            hora = datetime.strptime(dados.get('horaLembrete') or '', '%H:%M').time()
        except ValueError:
            raise ValueError('Data (AAAA-MM-DD) e hora (HH:MM) válidas são obrigatórias.')
 
        # idUsuario vem do token (id_usuario), NUNCA do corpo da requisição.
        lembrete = Lembrete(idUsuario=id_usuario, titulo=titulo, descricao=descricao,
                            dataLembrete=data, horaLembrete=hora)
        lembrete.salvar()
        return lembrete 
        