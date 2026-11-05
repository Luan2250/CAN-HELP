from functools import wraps
from flask import request, jsonify, g
from services.auth.token_service import TokenService
 
def exigir_autenticacao(funcao):
    """Protege uma rota: exige 'Authorization: Bearer <token>' e define g.id_usuario."""
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        cabecalho = request.headers.get('Authorization', '')
        if not cabecalho.startswith('Bearer '):
            return jsonify({'erro': 'Autenticação necessária'}), 401
        id_usuario = TokenService.validar(cabecalho[7:])
        if id_usuario is None:
            return jsonify({'erro': 'Token inválido ou expirado'}), 401
        g.id_usuario = id_usuario
        return funcao(*args, **kwargs)
    return wrapper