import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";

type AcomodacaoRow = RowDataPacket & {
    id: number;
    nome: string;
    cama_solteiro: number;
    cama_casal: number;
    suite: number;
    climatizacao: number;
    garagem: number;
};

export async function listarAcomodacoes() {
    const [rows] = await pool.query<AcomodacaoRow[]>(
        "SELECT * FROM acomodacoes ORDER BY id"
    );

    return rows.map((acomodacao) => ({
        id: acomodacao.id,
        nome: acomodacao.nome,
        camaSolteiro: acomodacao.cama_solteiro,
        camaCasal: acomodacao.cama_casal,
        suite: acomodacao.suite,
        climatizacao: Boolean(acomodacao.climatizacao),
        garagem: acomodacao.garagem
    }));
}
