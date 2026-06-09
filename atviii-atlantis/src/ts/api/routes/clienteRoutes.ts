import { Router } from "express";
import {
    atualizarCliente,
    buscarClientePorId,
    criarCliente,
    excluirCliente,
    listarClientes,
    removerAcomodacao,
    vincularAcomodacao
} from "../repositories/clienteRepository";
import { ClienteInput } from "../types";

const router = Router();

router.get("/", async (_request, response, next) => {
    try {
        const clientes = await listarClientes();
        response.json(clientes);
    } catch (erro) {
        next(erro);
    }
});

router.get("/:id", async (request, response, next) => {
    try {
        const cliente = await buscarClientePorId(Number(request.params.id));

        if (!cliente) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }

        response.json(cliente);
    } catch (erro) {
        next(erro);
    }
});

router.post("/", async (request, response, next) => {
    try {
        const input = request.body as ClienteInput;
        const cliente = await criarCliente(input);
        response.status(201).json(cliente);
    } catch (erro) {
        next(erro);
    }
});

router.put("/:id", async (request, response, next) => {
    try {
        const input = request.body as ClienteInput;
        const cliente = await atualizarCliente(Number(request.params.id), input);

        if (!cliente) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }

        response.json(cliente);
    } catch (erro) {
        next(erro);
    }
});

router.delete("/:id", async (request, response, next) => {
    try {
        const excluido = await excluirCliente(Number(request.params.id));

        if (!excluido) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }

        response.status(204).send();
    } catch (erro) {
        next(erro);
    }
});

router.post("/:id/acomodacao", async (request, response, next) => {
    try {
        const clienteId = Number(request.params.id);
        const acomodacaoId = Number(request.body.acomodacaoId);
        const dependentesIds = Array.isArray(request.body.dependentesIds)
            ? request.body.dependentesIds.map(Number)
            : [];

        const alterados = await vincularAcomodacao(clienteId, acomodacaoId, dependentesIds);
        response.json({ mensagem: "Hospedagem registrada", alterados });
    } catch (erro) {
        next(erro);
    }
});

router.delete("/:id/acomodacao", async (request, response, next) => {
    try {
        const alterados = await removerAcomodacao(Number(request.params.id));
        response.json({ mensagem: "Hospedagem removida", alterados });
    } catch (erro) {
        next(erro);
    }
});

export default router;
