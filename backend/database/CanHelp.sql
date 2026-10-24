CREATE DATABASE IF NOT EXISTS CanHelp;
USE CanHelp;

CREATE TABLE Usuario(
	idUsuario INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
	cpf VARCHAR(11) NOT NULL UNIQUE,
    endereco VARCHAR(100),
	telefone VARCHAR(45) NOT NULL,
    email VARCHAR(254) NOT NULL,
    dataNascimento DATE NOT NULL,
    dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    senha VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Perfil(
	idUsuario INT PRIMARY KEY,
    fotoURL VARCHAR(255),
    nome VARCHAR(70),
    bio VARCHAR(220),
    cidade VARCHAR(40),
    estado VARCHAR(40),
    
    CONSTRAINT fkPerfil
    FOREIGN KEY (idUsuario)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Cliente(
	idUsuario INT PRIMARY KEY,
    
    CONSTRAINT fkCliente
    FOREIGN KEY (idUsuario)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Cuidador(
	idUsuario INT PRIMARY KEY,
    certificado VARCHAR(30) NOT NULL UNIQUE, 
    orgaoEmissor VARCHAR(40) NOT NULL,
    valorServico DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    disponibilidade VARCHAR(160),
    
    CONSTRAINT fkCuidador
    FOREIGN KEY (idUsuario)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Avaliacoes(
	idAvaliacao INT AUTO_INCREMENT PRIMARY KEY,
    idAvaliador INT NOT NULL,
    idAvaliado INT NOT NULL,
    tipoAvaliador ENUM('cliente', 'cuidador') NOT NULL,
    nota TINYINT NOT NULL,
    comentario VARCHAR(180),
    gorjeta DECIMAL(10,2) DEFAULT 0.00,
    dataAvaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fkAvaliador
	FOREIGN KEY (idAvaliador)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE,
    
	CONSTRAINT fkAvaliado
	FOREIGN KEY (idAvaliado)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Denuncias(
	idDenuncia INT AUTO_INCREMENT PRIMARY KEY,
    idDenunciante INT NOT NULL,
    idDenunciado INT NOT NULL,
    tipoDenunciante ENUM('cliente', 'cuidador') NOT NULL,
    descricao TEXT NOT NULL,
    penalidade VARCHAR(180) DEFAULT 'Nenhuma',
    statusDenuncia ENUM('pendente', 'em análise', 'resolvida', 'arquivada') DEFAULT 'pendente',
    dataDenuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fkDenunciante
    FOREIGN KEY (idDenunciante)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE,
	CONSTRAINT fkDenunciado
    FOREIGN KEY (idDenunciado)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ListaServicos(
	idServico INT AUTO_INCREMENT PRIMARY KEY,
    tipoServico VARCHAR(50) NOT NULL UNIQUE,
    precoBase DECIMAL(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB;
INSERT INTO ListaServicos (tipoServico, precoBase) VALUES ('Transporte', 40.00), ('Banho', 35.00), ('Alimentação', 25.00), ('Compras', 30.00), ('Medicação', 20.00), ('Companhia', 30.00);

CREATE TABLE Contrato(
	idContrato INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idCuidador INT NOT NULL,
    dataContrato TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtendimento DATE NOT NULL,
    localizacao VARCHAR(160) NOT NULL,
    nomeAuxiliado VARCHAR(80) NOT NULL,
    statusContrato ENUM('pendente', 'aceito', 'recusado', 'cancelado_cliente', 'cancelado_cuidador', 'concluido') DEFAULT 'pendente',
    valorFinal DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT fkContratoCliente 
    FOREIGN KEY (idCliente) 
    REFERENCES Cliente(idUsuario) 
    ON DELETE CASCADE,
    CONSTRAINT fkContratoCuidador 
    FOREIGN KEY (idCuidador) 
    REFERENCES Cuidador(idUsuario) 
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ItensContrato(
	idContrato INT NOT NULL,
    idServico INT NOT NULL,
    PRIMARY KEY (idContrato, idServico),
    
    CONSTRAINT fkContrato 
    FOREIGN KEY (idContrato) 
    REFERENCES Contrato(idContrato) 
    ON DELETE CASCADE,
    CONSTRAINT fkItensServico 
    FOREIGN KEY (idServico) 
    REFERENCES ListaServicos(idServico) 
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Agenda(
	idAgenda INT AUTO_INCREMENT PRIMARY KEY,
    idContrato INT NOT NULL,
    dataAgenda DATE NOT NULL,
    horaAgenda TIME NOT NULL,
    ocasiao VARCHAR(100) NOT NULL,
    notificacao BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fkAgendaContrato
    FOREIGN KEY (idContrato)
    REFERENCES Contrato(idContrato)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Tarefa (
    idTarefa INT AUTO_INCREMENT PRIMARY KEY,
    idAgenda INT NOT NULL,
    descricao TEXT NOT NULL,
    horaTarefa TIME NOT NULL,
    notificacao BOOLEAN DEFAULT TRUE,
    statusTarefa ENUM('pendente', 'concluida') DEFAULT 'pendente',
    CONSTRAINT fkTarefaAgenda FOREIGN KEY (idAgenda)
        REFERENCES Agenda (idAgenda)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE Mensagem(
	idMensagem INT AUTO_INCREMENT PRIMARY KEY,
    idContrato INT NOT NULL,
    idRemetente INT NOT NULL,
    texto TEXT NOT NULL,
    dataEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,

    CONSTRAINT fkMensagemContrato
    FOREIGN KEY (idContrato)
    REFERENCES Contrato (idContrato)
    ON DELETE CASCADE,

    CONSTRAINT fkMensagemRemetente
    FOREIGN KEY (idRemetente)
    REFERENCES Usuario (idUsuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT idUsuario FROM Usuario;

INSERT INTO Usuario (cpf, endereco, telefone, email, dataNascimento, senha) 
VALUES ('12345678901', 'Rua das Flores, 123 - Centro', '11999998888', 'usuario@email.com', '1995-05-15', 'senha_criptografada_aqui');
INSERT INTO Usuario (cpf, endereco, telefone, email, dataNascimento, senha) 
VALUES ('98765432100', 'Avenida Paulista, 1000 - Bela Vista', '21988887777', 'contato@email.com', '1988-10-25', 'outra_senha_segura');

SELECT * FROM contrato;


DELIMITER $
CREATE PROCEDURE BuscarCuidadoresFiltro(
    IN p_cidade VARCHAR(40),
    IN p_ordenar_por_nota BOOLEAN
)
BEGIN
    SELECT 
        c.idUsuario,
        p.nome,
        p.fotoURL,
        p.bio,
        p.cidade,
        p.estado,
        c.valorServico,
        c.disponibilidade,
        COALESCE(AVG(a.nota), 0) AS notaMedia
    FROM Cuidador c
    INNER JOIN Perfil p ON c.idUsuario = p.idUsuario
    LEFT JOIN Avaliacoes a ON c.idUsuario = a.idAvaliado AND a.tipoAvaliador = 'cliente'
    WHERE (p_cidade IS NULL OR p_cidade = '' OR p.cidade LIKE CONCAT('%', p_cidade, '%'))
    GROUP BY c.idUsuario, p.nome, p.fotoURL, p.bio, p.cidade, p.estado, c.valorServico, c.disponibilidade
    ORDER BY 
        CASE WHEN p_ordenar_por_nota = 1 THEN COALESCE(AVG(a.nota), 0) END DESC,
        c.idUsuario ASC;
END$
DELIMITER ;


DELIMITER $
CREATE PROCEDURE RelatorioContratosCliente(
    IN p_idCliente INT
)
BEGIN
    SELECT 
        c.idContrato,
        p_cuidador.nome AS nomeCuidador,
        c.dataAtendimento,
        c.nomeAuxiliado,
        c.statusContrato,
        c.valorFinal,
        GROUP_CONCAT(ls.tipoServico SEPARATOR ', ') AS servicosContratados
    FROM Contrato c
    INNER JOIN Perfil p_cuidador ON c.idCuidador = p_cuidador.idUsuario
    LEFT JOIN ItensContrato ic ON c.idContrato = ic.idContrato
    LEFT JOIN ListaServicos ls ON ic.idServico = ls.idServico
    WHERE c.idCliente = p_idCliente
    GROUP BY c.idContrato, p_cuidador.nome, c.dataAtendimento, c.nomeAuxiliado, c.statusContrato, c.valorFinal
    ORDER BY c.dataAtendimento DESC;
END$
DELIMITER ;


DELIMITER $
CREATE PROCEDURE IdentificarTipoUsuario(
    IN p_idUsuario INT
)
BEGIN
    SELECT
        u.idUsuario,
        p.nome,
        p.fotoURL,
        CASE WHEN c.idUsuario IS NOT NULL THEN TRUE ELSE FALSE END AS ehCliente,
        CASE WHEN cu.idUsuario IS NOT NULL THEN TRUE ELSE FALSE END AS ehCuidador
    FROM Usuario u
    INNER JOIN Perfil p ON u.idUsuario = p.idUsuario
    LEFT JOIN Cliente c ON u.idUsuario = c.idUsuario
    LEFT JOIN Cuidador cu ON u.idUsuario = cu.idUsuario
    WHERE u.idUsuario = p_idUsuario;
END$
DELIMITER ;

DELIMITER $
CREATE PROCEDURE EncontrarCuidadoresDisponiveis(
    IN p_data DATE
)
BEGIN
    SELECT
        cu.idUsuario,
        p.nome,
        p.fotoURL,
        p.bio,
        p.cidade,
        p.estado,
        cu.valorServico,
        cu.disponibilidade,
        COALESCE(AVG(a.nota), 0) AS notaMedia
    FROM Cuidador cu
    INNER JOIN Perfil p ON cu.idUsuario = p.idUsuario
    LEFT JOIN Avaliacoes a ON cu.idUsuario = a.idAvaliado AND a.tipoAvaliador = 'cliente'
    WHERE cu.idUsuario NOT IN (
        SELECT c.idCuidador
        FROM Contrato c
        WHERE c.dataAtendimento = p_data
        AND c.statusContrato = 'aceito'
    )
    GROUP BY cu.idUsuario, p.nome, p.fotoURL, p.bio, p.cidade, p.estado, cu.valorServico, cu.disponibilidade
    ORDER BY notaMedia DESC;
END$
DELIMITER ;

CREATE TABLE Lembrete(
    idLembrete INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    dataLembrete DATE NOT NULL,
    horaLembrete TIME NOT NULL,
    CONSTRAINT fkLembreteUsuario
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;


DROP PROCEDURE IF EXISTS HistoricoDeServicos;
DELIMITER $
CREATE PROCEDURE HistoricoDeServicos(
    IN p_idUsuario INT
)
BEGIN
    SELECT
        c.idContrato,
        CASE WHEN c.idCliente = p_idUsuario THEN 'cliente' ELSE 'cuidador' END AS papel,
        pCl.nome AS nomeCliente,
        pCu.nome AS nomeCuidador,
        c.dataContrato,
        c.dataAtendimento,
        c.localizacao,
        c.nomeAuxiliado,
        c.statusContrato,
        c.valorFinal,
        GROUP_CONCAT(ls.tipoServico SEPARATOR ', ') AS servicosContratados
    FROM Contrato c
    INNER JOIN Perfil pCl ON c.idCliente  = pCl.idUsuario
    INNER JOIN Perfil pCu ON c.idCuidador = pCu.idUsuario
    LEFT JOIN ItensContrato ic ON c.idContrato = ic.idContrato
    LEFT JOIN ListaServicos ls ON ic.idServico = ls.idServico
    WHERE c.idCliente = p_idUsuario OR c.idCuidador = p_idUsuario
    GROUP BY c.idContrato, c.idCliente, pCl.nome, pCu.nome, c.dataContrato, c.dataAtendimento, c.localizacao, c.nomeAuxiliado, c.statusContrato, c.valorFinal
    ORDER BY c.dataAtendimento DESC, c.idContrato DESC;
END$
DELIMITER ;


DROP PROCEDURE IF EXISTS FiltrarCuidadores;
DELIMITER $
CREATE PROCEDURE FiltrarCuidadores(
    IN p_cidade     VARCHAR(40),
    IN p_estado     VARCHAR(40),
    IN p_valor_max  DECIMAL(10,2),
    IN p_nota_min   DECIMAL(3,2),
    IN p_data       DATE,
    IN p_ordenar    VARCHAR(20)   
)
BEGIN
    SELECT
        c.idUsuario,
        p.nome,
        p.fotoURL,
        p.bio,
        p.cidade,
        p.estado,
        c.valorServico,
        c.disponibilidade,
        COALESCE(AVG(a.nota), 0) AS notaMedia
    FROM Cuidador c
    INNER JOIN Perfil p ON c.idUsuario = p.idUsuario
    LEFT JOIN Avaliacoes a ON c.idUsuario = a.idAvaliado AND a.tipoAvaliador = 'cliente'
    WHERE (p_cidade IS NULL OR p_cidade = '' OR p.cidade LIKE CONCAT('%', p_cidade, '%'))
      AND (p_estado IS NULL OR p_estado = '' OR p.estado LIKE CONCAT('%', p_estado, '%'))
      AND (p_valor_max IS NULL OR c.valorServico <= p_valor_max)
      AND (p_data IS NULL OR c.idUsuario NOT IN (
            SELECT ct.idCuidador
            FROM Contrato ct
            WHERE ct.dataAtendimento = p_data
              AND ct.statusContrato = 'aceito'))
    GROUP BY c.idUsuario, p.nome, p.fotoURL, p.bio, p.cidade, p.estado, c.valorServico, c.disponibilidade
    HAVING (p_nota_min IS NULL OR COALESCE(AVG(a.nota), 0) >= p_nota_min)
    ORDER BY
        CASE WHEN p_ordenar = 'nota'       THEN COALESCE(AVG(a.nota), 0) END DESC,
        CASE WHEN p_ordenar = 'valor_asc'  THEN c.valorServico END ASC,
        CASE WHEN p_ordenar = 'valor_desc' THEN c.valorServico END DESC,
        c.idUsuario ASC;
END$
DELIMITER ;

DROP PROCEDURE IF EXISTS AvaliacoesDoUsuario;
DELIMITER $
CREATE PROCEDURE AvaliacoesDoUsuario(
    IN p_idUsuario INT
)
BEGIN
    SELECT
        a.idAvaliacao,
        p.nome AS nomeAvaliador,
        a.tipoAvaliador,
        a.nota,
        a.comentario,
        a.dataAvaliacao
    FROM Avaliacoes a
    INNER JOIN Perfil p ON a.idAvaliador = p.idUsuario
    WHERE a.idAvaliado = p_idUsuario
    ORDER BY a.dataAvaliacao DESC, a.idAvaliacao DESC;
END$
DELIMITER ;

ALTER TABLE ListaServicos ADD COLUMN precoBase DECIMAL(10,2) NOT NULL DEFAULT 0.00;

UPDATE ListaServicos SET precoBase = CASE tipoServico
    WHEN 'Transporte'   THEN 40.00
    WHEN 'Banho'        THEN 35.00
    WHEN 'Alimentação'  THEN 25.00
    WHEN 'Compras'      THEN 30.00
    WHEN 'Medicação'    THEN 20.00
    WHEN 'Companhia'    THEN 30.00
    ELSE precoBase END
WHERE idServico > 0;

CREATE TABLE Notificacao(
    idNotificacao INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idContrato INT NULL,
    mensagem VARCHAR(200) NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fkNotificacaoUsuario
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    CONSTRAINT fkNotificacaoContrato
    FOREIGN KEY (idContrato) REFERENCES Contrato(idContrato) ON DELETE CASCADE
) ENGINE=InnoDB;

SHOW COLUMNS FROM Perfil LIKE 'fotoURL';
ALTER TABLE Perfil MODIFY fotoURL LONGTEXT;