import { Request, Response } from "express";
import { EnderecoService } from "../services/EnderecoService";

export class EnderecoController {
    private service = new EnderecoService();

    salvarParaCliente = async (req: Request, res: Response) => {
        try {
            const endereco =
                await this.service.salvarParaCliente(req.body);

            return res.status(200).json(endereco);
        } catch (error) {
            return this.erro(res, error, "Erro ao salvar endereco");
        }
    };

    listar = async (_req: Request, res: Response) => {
        const enderecos = await this.service.listar();

        return res.status(200).json(enderecos);
    };

    buscarPorCliente = async (req: Request, res: Response) => {
        const clienteId = Number(req.params.clienteId);

        const endereco =
            await this.service.buscarPorCliente(clienteId);

        if (!endereco) {
            return res.status(404).json({
                mensagem: "Endereco nao encontrado"
            });
        }

        return res.status(200).json(endereco);
    };

    atualizar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const endereco =
                await this.service.atualizar(id, req.body);

            return res.status(200).json(endereco);
        } catch (error) {
            return this.erro(res, error, "Erro ao atualizar endereco");
        }
    };

    remover = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await this.service.remover(id);

            return res.status(204).send();
        } catch (error) {
            return this.erro(res, error, "Erro ao remover endereco");
        }
    };

    private erro(res: Response, error: unknown, fallback: string) {
        const mensagem =
            error instanceof Error ? error.message : fallback;

        return res.status(400).json({
            mensagem
        });
    }
}
