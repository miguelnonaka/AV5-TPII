import { Request, Response } from "express";
import { DocumentoService } from "../services/DocumentoService";

export class DocumentoController {
    private service = new DocumentoService();

    criar = async (req: Request, res: Response) => {
        try {
            const documento = await this.service.criar(req.body);

            return res.status(201).json(documento);
        } catch (error) {
            return this.erro(res, error, "Erro ao criar documento");
        }
    };

    listar = async (_req: Request, res: Response) => {
        const documentos = await this.service.listar();

        return res.status(200).json(documentos);
    };

    listarPorCliente = async (req: Request, res: Response) => {
        const clienteId = Number(req.params.clienteId);

        const documentos =
            await this.service.listarPorCliente(clienteId);

        return res.status(200).json(documentos);
    };

    buscarPorId = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const documento = await this.service.buscarPorId(id);

        if (!documento) {
            return res.status(404).json({
                mensagem: "Documento nao encontrado"
            });
        }

        return res.status(200).json(documento);
    };

    buscarPorNumero = async (req: Request, res: Response) => {
        const parametro = req.params.numero;
        const numero =
            Array.isArray(parametro) ? parametro[0] : parametro;

        const documento = await this.service.buscarPorNumero(numero);

        if (!documento) {
            return res.status(404).json({
                mensagem: "Documento nao encontrado"
            });
        }

        return res.status(200).json(documento);
    };

    atualizar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const documento =
                await this.service.atualizar(id, req.body);

            return res.status(200).json(documento);
        } catch (error) {
            return this.erro(res, error, "Erro ao atualizar documento");
        }
    };

    remover = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await this.service.remover(id);

            return res.status(204).send();
        } catch (error) {
            return this.erro(res, error, "Erro ao remover documento");
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
