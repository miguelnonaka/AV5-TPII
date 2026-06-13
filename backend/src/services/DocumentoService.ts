import { prisma } from "../prisma/client";
import {
    AtualizarDocumentoDTO,
    CriarDocumentoDTO
} from "../dtos/ContatoDTO";

export class DocumentoService {
    async criar(data: CriarDocumentoDTO) {
        return prisma.documento.create({
            data: {
                numero: data.numero,
                tipo: data.tipo,
                dataExpedicao: new Date(data.dataExpedicao),
                clienteId: data.clienteId
            },
            include: {
                cliente: true
            }
        });
    }

    async listar() {
        return prisma.documento.findMany({
            include: {
                cliente: true
            }
        });
    }

    async listarPorCliente(clienteId: number) {
        return prisma.documento.findMany({
            where: {
                clienteId
            }
        });
    }

    async buscarPorId(id: number) {
        return prisma.documento.findUnique({
            where: {
                id
            },
            include: {
                cliente: true
            }
        });
    }

    async buscarPorNumero(numero: string) {
        return prisma.documento.findFirst({
            where: {
                numero
            },
            include: {
                cliente: {
                    include: {
                        endereco: true,
                        telefones: true,
                        documentos: true,
                        dependentes: true,
                        titular: true,
                        acomodacao: true
                    }
                }
            }
        });
    }

    async atualizar(
        id: number,
        data: AtualizarDocumentoDTO
    ) {
        return prisma.documento.update({
            where: {
                id
            },
            data: {
                numero: data.numero,
                tipo: data.tipo,
                dataExpedicao: data.dataExpedicao
                    ? new Date(data.dataExpedicao)
                    : undefined
            },
            include: {
                cliente: true
            }
        });
    }

    async remover(id: number) {
        return prisma.documento.delete({
            where: {
                id
            }
        });
    }
}
