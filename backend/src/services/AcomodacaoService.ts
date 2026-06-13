import { prisma } from "../prisma/client";
import {
    AtualizarAcomodacaoDTO,
    CriarAcomodacaoDTO,
    VincularAcomodacaoDTO
} from "../dtos/AcomodacaoDTO";

const catalogoPadrao: CriarAcomodacaoDTO[] = [
    {
        nome: "Casal Simples",
        camaSolteiro: 0,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1
    },
    {
        nome: "Familia Simples",
        camaSolteiro: 2,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1
    },
    {
        nome: "Familia Mais",
        camaSolteiro: 5,
        camaCasal: 1,
        suite: 2,
        climatizacao: true,
        garagem: 2
    },
    {
        nome: "Familia Super",
        camaSolteiro: 6,
        camaCasal: 2,
        suite: 3,
        climatizacao: true,
        garagem: 2
    },
    {
        nome: "Solteiro Simples",
        camaSolteiro: 1,
        camaCasal: 0,
        suite: 1,
        climatizacao: true,
        garagem: 0
    },
    {
        nome: "Solteiro Mais",
        camaSolteiro: 0,
        camaCasal: 1,
        suite: 1,
        climatizacao: true,
        garagem: 1
    }
];

export class AcomodacaoService {
    async garantirCatalogoPadrao() {
        const criadas = [];

        for (const acomodacao of catalogoPadrao) {
            const existente = await prisma.acomodacao.findFirst({
                where: {
                    nome: acomodacao.nome
                }
            });

            if (existente) {
                criadas.push(existente);
                continue;
            }

            criadas.push(
                await prisma.acomodacao.create({
                    data: acomodacao
                })
            );
        }

        return criadas;
    }

    async criar(data: CriarAcomodacaoDTO) {
        return prisma.acomodacao.create({
            data
        });
    }

    async listar() {
        return prisma.acomodacao.findMany({
            include: {
                clientes: {
                    include: {
                        documentos: true
                    }
                }
            }
        });
    }

    async buscarPorId(id: number) {
        return prisma.acomodacao.findUnique({
            where: {
                id
            },
            include: {
                clientes: true
            }
        });
    }

    async atualizar(
        id: number,
        data: AtualizarAcomodacaoDTO
    ) {
        return prisma.acomodacao.update({
            where: {
                id
            },
            data,
            include: {
                clientes: true
            }
        });
    }

    async listarAcomodados() {
        return prisma.cliente.findMany({
            where: {
                acomodacaoId: {
                    not: null
                }
            },
            include: {
                acomodacao: true,
                documentos: true,
                titular: true,
                dependentes: true
            }
        });
    }

    async vincular(data: VincularAcomodacaoDTO) {
        const titular = await prisma.cliente.findFirst({
            where: {
                id: data.titularId,
                depende: false
            },
            include: {
                dependentes: true
            }
        });

        if (!titular) {
            throw new Error("Titular nao encontrado");
        }

        const acomodacao = await prisma.acomodacao.findUnique({
            where: {
                id: data.acomodacaoId
            }
        });

        if (!acomodacao) {
            throw new Error("Acomodacao nao encontrada");
        }

        const dependenteIds = data.dependenteIds || [];
        const idsDoTitular = new Set(
            titular.dependentes.map(dependente => dependente.id)
        );

        const invalidos = dependenteIds.filter(id => !idsDoTitular.has(id));

        if (invalidos.length > 0) {
            throw new Error("Dependente nao pertence ao titular informado");
        }

        const clientesParaAtualizar = [
            ...(data.incluirTitular === false ? [] : [titular.id]),
            ...dependenteIds
        ];

        if (clientesParaAtualizar.length === 0) {
            throw new Error("Nenhum hospede informado para acomodacao");
        }

        await prisma.cliente.updateMany({
            where: {
                id: {
                    in: clientesParaAtualizar
                }
            },
            data: {
                acomodacaoId: data.acomodacaoId
            }
        });

        return prisma.cliente.findUnique({
            where: {
                id: titular.id
            },
            include: {
                acomodacao: true,
                dependentes: {
                    include: {
                        acomodacao: true
                    }
                }
            }
        });
    }

    async cancelarHospedagem(titularId: number) {
        const titular = await prisma.cliente.findFirst({
            where: {
                id: titularId,
                depende: false
            },
            include: {
                dependentes: true
            }
        });

        if (!titular) {
            throw new Error("Titular nao encontrado");
        }

        const ids = [
            titular.id,
            ...titular.dependentes.map(dependente => dependente.id)
        ];

        await prisma.cliente.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                acomodacaoId: null
            }
        });
    }

    async remover(id: number) {
        return prisma.acomodacao.delete({
            where: {
                id
            }
        });
    }
}
