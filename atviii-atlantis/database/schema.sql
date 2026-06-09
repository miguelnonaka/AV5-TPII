CREATE DATABASE IF NOT EXISTS atlantis
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE atlantis;

CREATE TABLE IF NOT EXISTS acomodacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cama_solteiro INT NOT NULL DEFAULT 0,
  cama_casal INT NOT NULL DEFAULT 0,
  suite INT NOT NULL DEFAULT 0,
  climatizacao BOOLEAN NOT NULL DEFAULT TRUE,
  garagem INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  nome_social VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  depende BOOLEAN NOT NULL DEFAULT FALSE,
  titular_id INT NULL,
  acomodacao_id INT NULL,
  CONSTRAINT fk_cliente_titular
    FOREIGN KEY (titular_id) REFERENCES clientes(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_cliente_acomodacao
    FOREIGN KEY (acomodacao_id) REFERENCES acomodacoes(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL UNIQUE,
  rua VARCHAR(120) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  pais VARCHAR(80) NOT NULL,
  codigo_postal VARCHAR(20) NOT NULL,
  CONSTRAINT fk_endereco_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telefones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  ddd VARCHAR(4) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  CONSTRAINT fk_telefone_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  numero VARCHAR(40) NOT NULL UNIQUE,
  tipo ENUM('CPF', 'RG', 'Passaporte') NOT NULL,
  data_expedicao DATE NOT NULL,
  CONSTRAINT fk_documento_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE
);

INSERT INTO acomodacoes
  (id, nome, cama_solteiro, cama_casal, suite, climatizacao, garagem)
VALUES
  (1, 'Acomodacao simples para casal', 0, 1, 1, TRUE, 1),
  (2, 'Acomodacao para familia com ate cinco criancas', 5, 1, 2, TRUE, 2),
  (3, 'Acomodacao para familia com ate duas criancas', 2, 1, 1, TRUE, 1),
  (4, 'Acomodacao para ate duas familias, casal e tres criancas cada', 6, 2, 3, TRUE, 2),
  (5, 'Acomodacao com garagem para solteiro(a)', 0, 1, 1, TRUE, 1),
  (6, 'Acomodacao simples para solteiro(a)', 1, 0, 1, TRUE, 0)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  cama_solteiro = VALUES(cama_solteiro),
  cama_casal = VALUES(cama_casal),
  suite = VALUES(suite),
  climatizacao = VALUES(climatizacao),
  garagem = VALUES(garagem);
