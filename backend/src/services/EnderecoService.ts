import { prisma } from "../prisma/client";
import {
    AtualizarEnderecoDTO,
    CriarEnderecoDTO
} from "../dtos/ContatoDTO";

export class EnderecoService {
    async salvarParaCliente(data: CriarEnderecoDTO) {
        return prisma.endereco.upsert({
            where: {
                clienteId: data.clienteId
            },
            create: data,
            update: {
                rua: data.rua,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                pais: data.pais,
                codigoPostal: data.codigoPostal
            },
            include: {
                cliente: true
            }
        });
    }

    async listar() {
        return prisma.endereco.findMany({
            include: {
                cliente: true
            }
        });
    }

    async buscarPorCliente(clienteId: number) {
        return prisma.endereco.findUnique({
            where: {
                clienteId
            },
            include: {
                cliente: true
            }
        });
    }

    async atualizar(
        id: number,
        data: AtualizarEnderecoDTO
    ) {
        return prisma.endereco.update({
            where: {
                id
            },
            data,
            include: {
                cliente: true
            }
        });
    }

    async remover(id: number) {
        return prisma.endereco.delete({
            where: {
                id
            }
        });
    }
}
