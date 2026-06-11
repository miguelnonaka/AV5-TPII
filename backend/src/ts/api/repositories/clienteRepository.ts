import { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../config/database";
import { ClienteInput, DocumentoInput, EnderecoInput, TelefoneInput } from "../types";

type ClienteRow = RowDataPacket & {
    id: number;
    nome: string;
    nome_social: string;
    data_nascimento: string;
    data_cadastro: string;
    depende: number;
    titular_id: number | null;
    acomodacao_id: number | null;
    acomodacao_nome: string | null;
};

export async function listarClientes() {
    const [rows] = await pool.query<ClienteRow[]>(`
        SELECT
            c.*,
            a.nome AS acomodacao_nome
        FROM clientes c
        LEFT JOIN acomodacoes a ON a.id = c.acomodacao_id
        ORDER BY c.nome
    `);

    return rows.map(formatarClienteResumo);
}

export async function buscarClientePorId(id: number) {
    const [rows] = await pool.query<ClienteRow[]>(`
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

    const [enderecos] = await pool.query<RowDataPacket[]>(
        "SELECT rua, bairro, cidade, estado, pais, codigo_postal FROM enderecos WHERE cliente_id = ?",
        [id]
    );
    const [telefones] = await pool.query<RowDataPacket[]>(
        "SELECT id, ddd, numero FROM telefones WHERE cliente_id = ? ORDER BY id",
        [id]
    );
    const [documentos] = await pool.query<RowDataPacket[]>(
        "SELECT id, numero, tipo, data_expedicao FROM documentos WHERE cliente_id = ? ORDER BY id",
        [id]
    );
    const [dependentes] = await pool.query<ClienteRow[]>(`
        SELECT
            c.*,
            a.nome AS acomodacao_nome
        FROM clientes c
        LEFT JOIN acomodacoes a ON a.id = c.acomodacao_id
        WHERE c.titular_id = ?
        ORDER BY c.nome
    `, [id]);

    return {
        ...formatarClienteResumo(cliente),
        endereco: enderecos[0] ? {
            rua: enderecos[0].rua,
            bairro: enderecos[0].bairro,
            cidade: enderecos[0].cidade,
            estado: enderecos[0].estado,
            pais: enderecos[0].pais,
            codigoPostal: enderecos[0].codigo_postal
        } : null,
        telefones: telefones.map((telefone) => ({
            id: telefone.id,
            ddd: telefone.ddd,
            numero: telefone.numero
        })),
        documentos: documentos.map((documento) => ({
            id: documento.id,
            numero: documento.numero,
            tipo: documento.tipo,
            dataExpedicao: documento.data_expedicao
        })),
        dependentes: dependentes.map(formatarClienteResumo)
    };
}

export async function criarCliente(input: ClienteInput) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute<ResultSetHeader>(`
            INSERT INTO clientes
                (nome, nome_social, data_nascimento, depende, titular_id)
            VALUES (?, ?, ?, ?, ?)
        `, [
            input.nome,
            input.nomeSocial,
            input.dataNascimento,
            Boolean(input.depende),
            input.titularId ?? null
        ]);

        const clienteId = result.insertId;

        if (input.endereco) {
            await salvarEndereco(clienteId, input.endereco, connection);
        }

        if (input.telefones?.length) {
            await salvarTelefones(clienteId, input.telefones, connection);
        }

        if (input.documentos?.length) {
            await salvarDocumentos(clienteId, input.documentos, connection);
        }

        await connection.commit();
        return buscarClientePorId(clienteId);
    } catch (erro) {
        await connection.rollback();
        throw erro;
    } finally {
        connection.release();
    }
}

export async function atualizarCliente(id: number, input: ClienteInput) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute<ResultSetHeader>(`
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
            input.titularId ?? null,
            id
        ]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return null;
        }

        await connection.execute("DELETE FROM enderecos WHERE cliente_id = ?", [id]);
        await connection.execute("DELETE FROM telefones WHERE cliente_id = ?", [id]);
        await connection.execute("DELETE FROM documentos WHERE cliente_id = ?", [id]);

        if (input.endereco) {
            await salvarEndereco(id, input.endereco, connection);
        }

        if (input.telefones?.length) {
            await salvarTelefones(id, input.telefones, connection);
        }

        if (input.documentos?.length) {
            await salvarDocumentos(id, input.documentos, connection);
        }

        await connection.commit();
        return buscarClientePorId(id);
    } catch (erro) {
        await connection.rollback();
        throw erro;
    } finally {
        connection.release();
    }
}

export async function excluirCliente(id: number) {
    const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM clientes WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
}

export async function vincularAcomodacao(clienteId: number, acomodacaoId: number, dependentesIds: number[]) {
    const ids = [clienteId, ...dependentesIds];
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE clientes SET acomodacao_id = ? WHERE id IN (?)",
        [acomodacaoId, ids]
    );

    return result.affectedRows;
}

export async function removerAcomodacao(clienteId: number) {
    const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE clientes SET acomodacao_id = NULL WHERE id = ? OR titular_id = ?",
        [clienteId, clienteId]
    );

    return result.affectedRows;
}

type Executor = Pool | PoolConnection;

async function salvarEndereco(clienteId: number, endereco: EnderecoInput, connection: Executor = pool) {
    await connection.execute(`
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
}

async function salvarTelefones(clienteId: number, telefones: TelefoneInput[], connection: Executor = pool) {
    for (const telefone of telefones) {
        await connection.execute(`
            INSERT INTO telefones (cliente_id, ddd, numero)
            VALUES (?, ?, ?)
        `, [clienteId, telefone.ddd, telefone.numero]);
    }
}

async function salvarDocumentos(clienteId: number, documentos: DocumentoInput[], connection: Executor = pool) {
    for (const documento of documentos) {
        await connection.execute(`
            INSERT INTO documentos (cliente_id, numero, tipo, data_expedicao)
            VALUES (?, ?, ?, ?)
        `, [clienteId, documento.numero, documento.tipo, documento.dataExpedicao]);
    }
}

function formatarClienteResumo(cliente: ClienteRow) {
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
