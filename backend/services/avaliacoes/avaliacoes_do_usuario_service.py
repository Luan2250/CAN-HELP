from repositories.avaliacoesDoUsuario_repository import AvaliacoesDoUsuarioRepository

class AvaliacoesDoUsuarioService:
    @staticmethod
    def execute(id_usuario):
        if not id_usuario:
            raise ValueError("O ID do usuário é obrigatório para consultar as avaliações.")

        avaliacoes = AvaliacoesDoUsuarioRepository.avaliacoes_do_usuario(id_usuario)

        total = len(avaliacoes)
        media = round(sum(a["nota"] for a in avaliacoes) / total, 1) if total else None

        return {"total": total, "media": media, "avaliacoes": avaliacoes}