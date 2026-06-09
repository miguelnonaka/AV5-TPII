"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarClientes = listarClientes;
exports.buscarClientePorId = buscarClientePorId;
exports.criarCliente = criarCliente;
exports.atualizarCliente = atualizarCliente;
exports.excluirCliente = excluirCliente;
exports.vincularAcomodacao = vincularAcomodacao;
exports.removerAcomodacao = removerAcomodacao;
const database_1 = require("../config/database");
function listarClientes() {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield database_1.pool.query(`
        SELECT
            c.*,
            a.nome AS acomodacao_nome
        FROM clientes c
        LEFT JOIN acomodacoes a ON a.id = c.acomodacao_id
        ORDER BY c.nome
    `);
        return rows.map(formatarClienteResumo);
    });
}
function buscarClientePorId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield database_1.pool.query(`
        SELECT
            c.*,
            a.nome AS acomodacao_nome
        FROM clientes c
        LEFT JOIN acomodacoes a ON a.id = c.acomodacao_id
        WHERE c.id = ?
    `, [id]);
        const cliente = rows[0];
        if (!cliente) {
            return null;
        }
        const [enderecos] = yield database_1.pool.query("SELECT rua, bairro, cidade, estado, pais, codigo_postal FROM enderecos WHERE cliente_id = ?", [id]);
        const [telefones] = yield database_1.pool.query("SELECT id, ddd, numero FROM telefones WHERE cliente_id = ? ORDER BY id", [id]);
        const [documentos] = yield database_1.pool.query("SELECT id, numero, tipo, data_expedicao FROM documentos WHERE cliente_id = ? ORDER BY id", [id]);
        const [dependentes] = yield database_1.pool.query(`
        SELECT
            c.*,
            a.nome AS acomodacao_nome
        FROM clientes c
        LEFT JOIN acomodacoes a ON a.id = c.acomodacao_id
        WHERE c.titular_id = ?
        ORDER BY c.nome
    `, [id]);
        return Object.assign(Object.assign({}, formatarClienteResumo(cliente)), { endereco: enderecos[0] ? {
                rua: enderecos[0].rua,
                bairro: enderecos[0].bairro,
                cidade: enderecos[0].cidade,
                estado: enderecos[0].estado,
                pais: enderecos[0].pais,
                codigoPostal: enderecos[0].codigo_postal
            } : null, telefones: telefones.map((telefone) => ({
                id: telefone.id,
                ddd: telefone.ddd,
                numero: telefone.numero
            })), documentos: documentos.map((documento) => ({
                id: documento.id,
                numero: documento.numero,
                tipo: documento.tipo,
                dataExpedicao: documento.data_expedicao
            })), dependentes: dependentes.map(formatarClienteResumo) });
    });
}
function criarCliente(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const connection = yield database_1.pool.getConnection();
        try {
            yield connection.beginTransaction();
            const [result] = yield connection.execute(`
            INSERT INTO clientes
                (nome, nome_social, data_nascimento, depende, titular_id)
            VALUES (?, ?, ?, ?, ?)
        `, [
                input.nome,
                input.nomeSocial,
                input.dataNascimento,
                Boolean(input.depende),
                (_a = input.titularId) !== null && _a !== void 0 ? _a : null
            ]);
            const clienteId = result.insertId;
            if (input.endereco) {
                yield salvarEndereco(clienteId, input.endereco, connection);
            }
            if ((_b = input.telefones) === null || _b === void 0 ? void 0 : _b.length) {
                yield salvarTelefones(clienteId, input.telefones, connection);
            }
            if ((_c = input.documentos) === null || _c === void 0 ? void 0 : _c.length) {
                yield salvarDocumentos(clienteId, input.documentos, connection);
            }
            yield connection.commit();
            return buscarClientePorId(clienteId);
        }
        catch (erro) {
            yield connection.rollback();
            throw erro;
        }
        finally {
            connection.release();
        }
    });
}
function atualizarCliente(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const connection = yield database_1.pool.getConnection();
        try {
            yield connection.beginTransaction();
            const [result] = yield connection.execute(`
            UPDATE clientes
            SET nome = ?,
                nome_social = ?,
                data_nascimento = ?,
                depende = ?,
                titular_id = ?
            WHERE id = ?
        `, [
                input.nome,
                input.nomeSocial,
                input.dataNascimento,
                Boolean(input.depende),
                (_a = input.titularId) !== null && _a !== void 0 ? _a : null,
                id
            ]);
            if (result.affectedRows === 0) {
                yield connection.rollback();
                return null;
            }
            yield connection.execute("DELETE FROM enderecos WHERE cliente_id = ?", [id]);
            yield connection.execute("DELETE FROM telefones WHERE cliente_id = ?", [id]);
            yield connection.execute("DELETE FROM documentos WHERE cliente_id = ?", [id]);
            if (input.endereco) {
                yield salvarEndereco(id, input.endereco, connection);
            }
            if ((_b = input.telefones) === null || _b === void 0 ? void 0 : _b.length) {
                yield salvarTelefones(id, input.telefones, connection);
            }
            if ((_c = input.documentos) === null || _c === void 0 ? void 0 : _c.length) {
                yield salvarDocumentos(id, input.documentos, connection);
            }
            yield connection.commit();
            return buscarClientePorId(id);
        }
        catch (erro) {
            yield connection.rollback();
            throw erro;
        }
        finally {
            connection.release();
        }
    });
}
function excluirCliente(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield database_1.pool.execute("DELETE FROM clientes WHERE id = ?", [id]);
        return result.affectedRows > 0;
    });
}
function vincularAcomodacao(clienteId, acomodacaoId, dependentesIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const ids = [clienteId, ...dependentesIds];
        const [result] = yield database_1.pool.query("UPDATE clientes SET acomodacao_id = ? WHERE id IN (?)", [acomodacaoId, ids]);
        return result.affectedRows;
    });
}
function removerAcomodacao(clienteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield database_1.pool.execute("UPDATE clientes SET acomodacao_id = NULL WHERE id = ? OR titular_id = ?", [clienteId, clienteId]);
        return result.affectedRows;
    });
}
function salvarEndereco(clienteId_1, endereco_1) {
    return __awaiter(this, arguments, void 0, function* (clienteId, endereco, connection = database_1.pool) {
        yield connection.execute(`
        INSERT INTO enderecos
            (cliente_id, rua, bairro, cidade, estado, pais, codigo_postal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            clienteId,
            endereco.rua,
            endereco.bairro,
            endereco.cidade,
            endereco.estado,
            endereco.pais,
            endereco.codigoPostal
        ]);
    });
}
function salvarTelefones(clienteId_1, telefones_1) {
    return __awaiter(this, arguments, void 0, function* (clienteId, telefones, connection = database_1.pool) {
        for (const telefone of telefones) {
            yield connection.execute(`
            INSERT INTO telefones (cliente_id, ddd, numero)
            VALUES (?, ?, ?)
        `, [clienteId, telefone.ddd, telefone.numero]);
        }
    });
}
function salvarDocumentos(clienteId_1, documentos_1) {
    return __awaiter(this, arguments, void 0, function* (clienteId, documentos, connection = database_1.pool) {
        for (const documento of documentos) {
            yield connection.execute(`
            INSERT INTO documentos (cliente_id, numero, tipo, data_expedicao)
            VALUES (?, ?, ?, ?)
        `, [clienteId, documento.numero, documento.tipo, documento.dataExpedicao]);
        }
    });
}
function formatarClienteResumo(cliente) {
    return {
        id: cliente.id,
        nome: cliente.nome,
        nomeSocial: cliente.nome_social,
        dataNascimento: cliente.data_nascimento,
        dataCadastro: cliente.data_cadastro,
        depende: Boolean(cliente.depende),
        titularId: cliente.titular_id,
        acomodacao: cliente.acomodacao_id ? {
            id: cliente.acomodacao_id,
            nome: cliente.acomodacao_nome
        } : null
    };
}
