import { Router } from "express";
import { listarAcomodacoes } from "../repositories/acomodacaoRepository";

const router = Router();

router.get("/", async (_request, response, next) => {
    try {
        const acomodacoes = await listarAcomodacoes();
        response.json(acomodacoes);
    } catch (erro) {
        next(erro);
    }
});

export default router;
