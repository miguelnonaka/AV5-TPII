import { Request, Response } from "express";
import { AcomodacaoService } from "../services/AcomodacaoService";

export class AcomodacaoController {
    private service = new AcomodacaoService();

    criarCatalogoPadrao = async (
        _req: Request,
        res: Response
    ) => {
        const acomodacoes =
            await this.service.garantirCatalogoPadrao();

        return res.status(201).json(acomodacoes);
    };

    criar = async (
        req: Request,
        res: Response
    ) => {
        try {
            const acomodacao =
                await this.service.criar(req.body);

            return res.status(201).json(acomodacao);
        } catch (error) {
            return this.erro(res, error, "Erro ao criar acomodacao");
        }
    };

    listar = async (
        _req: Request,
        res: Response
    ) => {
        const acomodacoes =
            await this.service.listar();

        return res.status(200).json(acomodacoes);
    };

    listarAcomodados = async (
        _req: Request,
        res: Response
    ) => {
        const clientes =
            await this.service.listarAcomodados();

        return res.status(200).json(clientes);
    };

    buscarPorId = async (
        req: Request,
        res: Response
    ) => {
        const id = Number(req.params.id);

        const acomodacao =
            await this.service.buscarPorId(id);

        if (!acomodacao) {
            return res.status(404).json({
                mensagem: "Acomodacao nao encontrada"
            });
        }

        return res.status(200).json(acomodacao);
    };

    vincular = async (
        req: Request,
        res: Response
    ) => {
        try {
            const hospedagem =
                await this.service.vincular(req.body);

            return res.status(200).json(hospedagem);
        } catch (error) {
            return this.erro(res, error, "Erro ao vincular acomodacao");
        }
    };

    atualizar = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);

            const acomodacao =
                await this.service.atualizar(id, req.body);

            return res.status(200).json(acomodacao);
        } catch (error) {
            return this.erro(res, error, "Erro ao atualizar acomodacao");
        }
    };

    cancelarHospedagem = async (
        req: Request,
        res: Response
    ) => {
        try {
            const titularId = Number(req.params.titularId);

            await this.service.cancelarHospedagem(titularId);

            return res.status(204).send();
        } catch (error) {
            return this.erro(res, error, "Erro ao cancelar hospedagem");
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
            return this.erro(res, error, "Erro ao remover acomodacao");
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
