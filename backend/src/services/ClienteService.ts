import { prisma } from "../prisma/client";
import {
    AtualizarClienteDTO,
    CriarClienteDTO,
    CriarDependenteDTO
} from "../dtos/ClienteDTO";

export class ClienteService {
    private includeCompleto = {
        endereco: true,
        telefones: true,
        documentos: true,
        titular: {
            include: {
                endereco: true,
                telefones: true,
                documentos: true,
                acomodacao: true
            }
        },
        dependentes: {
            include: {
                endereco: true,
                telefones: true,
                documentos: true,
                acomodacao: true
            }
        },
        acomodacao: true
    };

    async criar(data: CriarClienteDTO) {
        return this.criarTitular(data);
    }

    async criarTitular(data: CriarClienteDTO) {
        return prisma.cliente.create({
            data: {
                nome: data.nome,
                nomeSocial: data.nomeSocial,
                dataNascimento: new Date(data.dataNascimento),
                depende: false,
                endereco: data.endereco
                    ? {
                        create: data.endereco
                    }
                    : undefined,
                telefones: {
                    create: data.telefones?.map(telefone => ({
                        ddd: telefone.ddd,
                        numero: telefone.numero
                    })) || []
                },
                documentos: {
                    create: data.documentos.map(documento => ({
                        numero: documento.numero,
                        tipo: documento.tipo,
                        dataExpedicao: new Date(documento.dataExpedicao)
                    }))
                }
            },
            include: this.includeCompleto
        });
    }

    async criarDependente(
        titularId: number,
        data: CriarDependenteDTO
    ) {
        const titular = await prisma.cliente.findUnique({
            where: {
                id: titularId
            },
            include: {
                endereco: true,
                telefones: true
            }
        });

        if (!titular || titular.depende) {
            throw new Error("Titular nao encontrado");
        }

        const enderecoBase =
            data.endereco || titular.endereco || undefined;

        const telefonesBase =
            data.telefones && data.telefones.length > 0
                ? data.telefones
                : titular.telefones.map(telefone => ({
                    ddd: telefone.ddd,
                    numero: telefone.numero
                }));

        return prisma.cliente.create({
            data: {
                nome: data.nome,
                nomeSocial: data.nomeSocial,
                dataNascimento: new Date(data.dataNascimento),
                depende: true,
                titularId,
                endereco: enderecoBase
                    ? {
                        create: {
                            rua: enderecoBase.rua,
                            bairro: enderecoBase.bairro,
                            cidade: enderecoBase.cidade,
                            estado: enderecoBase.estado,
                            pais: enderecoBase.pais,
                            codigoPostal: enderecoBase.codigoPostal
                        }
                    }
                    : undefined,
                telefones: {
                    create: telefonesBase.map(telefone => ({
                        ddd: telefone.ddd,
                        numero: telefone.numero
                    }))
                },
                documentos: {
                    create: data.documentos.map(documento => ({
                        numero: documento.numero,
                        tipo: documento.tipo,
                        dataExpedicao: new Date(documento.dataExpedicao)
                    }))
                }
            },
            include: this.includeCompleto
        });
    }

    async listar() {
        return prisma.cliente.findMany({
            include: this.includeCompleto
        });
    }

    async listarTitulares() {
        return prisma.cliente.findMany({
            where: {
                depende: false,
                titularId: null
            },
            include: this.includeCompleto
        });
    }

    async listarDependentes() {
        return prisma.cliente.findMany({
            where: {
                depende: true
            },
            include: this.includeCompleto
        });
    }

    async listarDependentesDoTitular(titularId: number) {
        const titular = await prisma.cliente.findFirst({
            where: {
                id: titularId,
                depende: false
            }
        });

        if (!titular) {
            throw new Error("Titular nao encontrado");
        }

        return prisma.cliente.findMany({
            where: {
                titularId
            },
            include: this.includeCompleto
        });
    }

    async buscarPorId(id: number) {
        return prisma.cliente.findUnique({
            where: {
                id
            },
            include: this.includeCompleto
        });
    }

    async buscarTitularDoDependente(dependenteId: number) {
        const dependente = await prisma.cliente.findFirst({
            where: {
                id: dependenteId,
                depende: true
            },
            include: {
                titular: {
                    include: this.includeCompleto
                }
            }
        });

        if (!dependente || !dependente.titular) {
            throw new Error("Titular do dependente nao encontrado");
        }

        return dependente.titular;
    }

    async atualizar(
        id: number,
        data: AtualizarClienteDTO
    ) {
        const cliente = await prisma.cliente.findUnique({
            where: {
                id
            }
        });

        if (!cliente) {
            throw new Error("Cliente nao encontrado");
        }

        await prisma.cliente.update({
            where: {
                id
            },
            data: {
                nome: data.nome,
                nomeSocial: data.nomeSocial,
                dataNascimento: data.dataNascimento
                    ? new Date(data.dataNascimento)
                    : undefined
            }
        });

        if (data.endereco) {
            await prisma.endereco.upsert({
                where: {
                    clienteId: id
                },
                create: {
                    ...data.endereco,
                    clienteId: id
                },
                update: data.endereco
            });
        }

        if (data.telefones) {
            await prisma.telefone.deleteMany({
                where: {
                    clienteId: id
                }
            });

            if (data.telefones.length > 0) {
                await prisma.telefone.createMany({
                    data: data.telefones.map(telefone => ({
                        ...telefone,
                        clienteId: id
                    }))
                });
            }
        }

        if (data.documentos) {
            await prisma.documento.deleteMany({
                where: {
                    clienteId: id
                }
            });

            if (data.documentos.length > 0) {
                await prisma.documento.createMany({
                    data: data.documentos.map(documento => ({
                        numero: documento.numero,
                        tipo: documento.tipo,
                        dataExpedicao: new Date(documento.dataExpedicao),
                        clienteId: id
                    }))
                });
            }
        }

        return this.buscarPorId(id);
    }

    async removerAcomodacao(id: number) {
        return prisma.cliente.update({
            where: {
                id
            },
            data: {
                acomodacaoId: null
            },
            include: this.includeCompleto
        });
    }

    async remover(id: number) {
        return prisma.cliente.delete({
            where: {
                id
            }
        });
    }
}
