import { Request, Response } from "express";
import { TelefoneService } from "../services/TelefoneService";

export class TelefoneController {
    private service = new TelefoneService();

    criar = async (req: Request, res: Response) => {
        try {
            const telefone = await this.service.criar(req.body);

            return res.status(201).json(telefone);
        } catch (error) {
            return this.erro(res, error, "Erro ao criar telefone");
        }
    };

    listar = async (_req: Request, res: Response) => {
        const telefones = await this.service.listar();

        return res.status(200).json(telefones);
    };

    listarPorCliente = async (req: Request, res: Response) => {
        const clienteId = Number(req.params.clienteId);

        const telefones =
            await this.service.listarPorCliente(clienteId);

        return res.status(200).json(telefones);
    };

    atualizar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const telefone =
                await this.service.atualizar(id, req.body);

            return res.status(200).json(telefone);
        } catch (error) {
            return this.erro(res, error, "Erro ao atualizar telefone");
        }
    };

    remover = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await this.service.remover(id);

            return res.status(204).send();
        } catch (error) {
            return this.erro(res, error, "Erro ao remover telefone");
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
