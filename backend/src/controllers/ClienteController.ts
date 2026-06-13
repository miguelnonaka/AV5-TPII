import { Request, Response } from "express";
import { ClienteService } from "../services/ClienteService";

export class ClienteController {
    private service = new ClienteService();

    criar = async (
        req: Request,
        res: Response
    ) => {
        try {
            const cliente =
                await this.service.criarTitular(req.body);

            return res.status(201).json(cliente);
        } catch (error) {
            return this.erro(res, error, "Erro ao criar titular");
        }
    };

    criarDependente = async (
        req: Request,
        res: Response
    ) => {
        try {
            const titularId = Number(req.params.titularId);

            const dependente =
                await this.service.criarDependente(titularId, req.body);

            return res.status(201).json(dependente);
        } catch (error) {
            return this.erro(res, error, "Erro ao criar dependente");
        }
    };

    listar = async (
        _req: Request,
        res: Response
    ) => {
        const clientes =
            await this.service.listar();

        return res.status(200).json(clientes);
    };

    listarTitulares = async (
        _req: Request,
        res: Response
    ) => {
        const clientes =
            await this.service.listarTitulares();

        return res.status(200).json(clientes);
    };

    listarDependentes = async (
        _req: Request,
        res: Response
    ) => {
        const clientes =
            await this.service.listarDependentes();

        return res.status(200).json(clientes);
    };

    listarDependentesDoTitular = async (
        req: Request,
        res: Response
    ) => {
        try {
            const titularId = Number(req.params.titularId);

            const dependentes =
                await this.service.listarDependentesDoTitular(titularId);

            return res.status(200).json(dependentes);
        } catch (error) {
            return this.erro(res, error, "Erro ao listar dependentes");
        }
    };

    buscarTitularDoDependente = async (
        req: Request,
        res: Response
    ) => {
        try {
            const dependenteId = Number(req.params.dependenteId);

            const titular =
                await this.service.buscarTitularDoDependente(dependenteId);

            return res.status(200).json(titular);
        } catch (error) {
            return this.erro(res, error, "Erro ao buscar titular");
        }
    };

    buscarPorId = async (
        req: Request,
        res: Response
    ) => {
        const id = Number(req.params.id);

        const cliente =
            await this.service.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensagem: "Cliente nao encontrado"
            });
        }

        return res.status(200).json(cliente);
    };

    atualizar = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);

            const cliente =
                await this.service.atualizar(id, req.body);

            return res.status(200).json(cliente);
        } catch (error) {
            return this.erro(res, error, "Erro ao atualizar cliente");
        }
    };

    removerAcomodacao = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);

            const cliente =
                await this.service.removerAcomodacao(id);

            return res.status(200).json(cliente);
        } catch (error) {
            return this.erro(res, error, "Erro ao remover acomodacao do cliente");
        }
    };

    remover = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);

            await this.service.remover(id);

            return res.status(204).send();
        } catch (error) {
            return this.erro(res, error, "Erro ao remover cliente");
        }
    };

    private erro(
        res: Response,
        error: unknown,
        fallback: string
    ) {
        const mensagem =
            error instanceof Error ? error.message : fallback;

        return res.status(400).json({
            mensagem
        });
    }
}
