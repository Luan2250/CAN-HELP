from models.tarefa import Tarefa

class CriarTarefaService:
    @staticmethod
    def executar(dados):

        novo_tarefa = Tarefa(
            idAgenda=dados.get('idAgenda'),
            descricao=dados.get('descricao'),
            horaTarefa=dados.get('horaTarefa'),
            notificacao=dados.get('notificacao'),
            statusTarefa=dados.get('statusTarefa') 
        )

        novo_tarefa.salvar()
        
        return novo_tarefa