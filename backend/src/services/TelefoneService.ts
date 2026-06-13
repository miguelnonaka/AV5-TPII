import { prisma } from "../prisma/client";
import {
    AtualizarTelefoneDTO,
    CriarTelefoneDTO
} from "../dtos/ContatoDTO";

export class TelefoneService {
    async criar(data: CriarTelefoneDTO) {
        return prisma.telefone.create({
            data,
            include: {
                cliente: true
            }
        });
    }

    async listar() {
        return prisma.telefone.findMany({
            include: {
                cliente: true
            }
        });
    }

    async listarPorCliente(clienteId: number) {
        return prisma.telefone.findMany({
            where: {
                clienteId
            }
        });
    }

    async atualizar(
        id: number,
        data: AtualizarTelefoneDTO
    ) {
        return prisma.telefone.update({
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
        return prisma.telefone.delete({
            where: {
                id
            }
        });
    }
}
