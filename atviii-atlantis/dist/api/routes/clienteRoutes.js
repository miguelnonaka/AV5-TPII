"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteRepository_1 = require("../repositories/clienteRepository");
const router = (0, express_1.Router)();
router.get("/", (_request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield (0, clienteRepository_1.listarClientes)();
        response.json(clientes);
    }
    catch (erro) {
        next(erro);
    }
}));
router.get("/:id", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cliente = yield (0, clienteRepository_1.buscarClientePorId)(Number(request.params.id));
        if (!cliente) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }
        response.json(cliente);
    }
    catch (erro) {
        next(erro);
    }
}));
router.post("/", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = request.body;
        const cliente = yield (0, clienteRepository_1.criarCliente)(input);
        response.status(201).json(cliente);
    }
    catch (erro) {
        next(erro);
    }
}));
router.put("/:id", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = request.body;
        const cliente = yield (0, clienteRepository_1.atualizarCliente)(Number(request.params.id), input);
        if (!cliente) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }
        response.json(cliente);
    }
    catch (erro) {
        next(erro);
    }
}));
router.delete("/:id", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const excluido = yield (0, clienteRepository_1.excluirCliente)(Number(request.params.id));
        if (!excluido) {
            response.status(404).json({ mensagem: "Cliente nao encontrado" });
            return;
        }
        response.status(204).send();
    }
    catch (erro) {
        next(erro);
    }
}));
router.post("/:id/acomodacao", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clienteId = Number(request.params.id);
        const acomodacaoId = Number(request.body.acomodacaoId);
        const dependentesIds = Array.isArray(request.body.dependentesIds)
            ? request.body.dependentesIds.map(Number)
            : [];
        const alterados = yield (0, clienteRepository_1.vincularAcomodacao)(clienteId, acomodacaoId, dependentesIds);
        response.json({ mensagem: "Hospedagem registrada", alterados });
    }
    catch (erro) {
        next(erro);
    }
}));
router.delete("/:id/acomodacao", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alterados = yield (0, clienteRepository_1.removerAcomodacao)(Number(request.params.id));
        response.json({ mensagem: "Hospedagem removida", alterados });
    }
    catch (erro) {
        next(erro);
    }
}));
exports.default = router;
