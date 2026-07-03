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
    tipoServico VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;
INSERT INTO ListaServicos (tipoServico) VALUES ('Transporte'), ('Banho'), ('Alimentação'), ('Compras'), ('Medicação'), ('Companhia');

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

CREATE TABLE Tarefa(
	idTarefa INT AUTO_INCREMENT PRIMARY KEY,
    idAgenda INT NOT NULL,
    descricao TEXT NOT NULL, 
    horaTarefa TIME NOT NULL,
    notificacao BOOLEAN DEFAULT TRUE,
    statusTarefa ENUM('pendente', 'concluida') DEFAULT 'pendente',
    
    CONSTRAINT fkTarefaAgenda
    FOREIGN KEY (idAgenda)
    REFERENCES Agenda(idAgenda)
    ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT idUsuario FROM Usuario;

INSERT INTO Usuario (cpf, endereco, telefone, email, dataNascimento, senha) 
VALUES ('12345678901', 'Rua das Flores, 123 - Centro', '11999998888', 'usuario@email.com', '1995-05-15', 'senha_criptografada_aqui');
INSERT INTO Usuario (cpf, endereco, telefone, email, dataNascimento, senha) 
VALUES ('98765432100', 'Avenida Paulista, 1000 - Bela Vista', '21988887777', 'contato@email.com', '1988-10-25', 'outra_senha_segura');
