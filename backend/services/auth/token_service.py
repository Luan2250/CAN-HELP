import os
import datetime
import jwt
 
SECRET = os.environ.get('JWT_SECRET', 'dev-secret-trocar')
 
class TokenService:
    @staticmethod
    def gerar(id_usuario):
        payload = {
            'sub': str(id_usuario),
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)
        }
        return jwt.encode(payload, SECRET, algorithm='HS256')
 
    @staticmethod
    def validar(token):
        """Retorna o idUsuario do token, ou None se inválido/expirado."""
        try:
            dados = jwt.decode(token, SECRET, algorithms=['HS256'])
            return int(dados['sub'])
        except (jwt.PyJWTError, KeyError, ValueError):
            return None
 