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

CREATE TABLE Contratacao(
    idContratacao INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idCuidador INT NOT NULL,
    dataContratacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtendimento DATE NOT NULL,
    localizacao VARCHAR(160) NOT NULL,
    nomeAuxiliado VARCHAR(80) NOT NULL,
    statusContratacao ENUM('pendente', 'aceito', 'recusado', 'cancelado_cliente', 'cancelado_cuidador', 'concluido') DEFAULT 'pendente',
    valorFinal DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT fkContratacaoCliente FOREIGN KEY (idCliente) REFERENCES Cliente(idUsuario) ON DELETE CASCADE,
    CONSTRAINT fkContratacaoCuidador FOREIGN KEY (idCuidador) REFERENCES Cuidador(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Perguntar p Bernardo 
CREATE TABLE ItensContratacao(
	idContratacao INT NOT NULL,
    idServico INT NOT NULL,
    PRIMARY KEY (idContratacao, idServico),
    
    CONSTRAINT fkContratacao 
    FOREIGN KEY (idContratacao) 
    REFERENCES Contratacao(idContratacao) 
    ON DELETE CASCADE,
    CONSTRAINT fkItensServico 
    FOREIGN KEY (idServico) 
    REFERENCES ListaServicos(idServico) 
    ON DELETE CASCADE
) ENGINE=InnoDB;

