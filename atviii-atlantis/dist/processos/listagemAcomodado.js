"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class ListarClientesAcomodado extends processo_1.default {
    processar() {
        console.clear();
        console.log("Clientes acomodados\n");
        const armazem = armazem_1.default.InstanciaUnica;
        const clientesAcomodados = armazem.Clientes.filter(cliente => cliente.Acomodacao);
        if (clientesAcomodados.length === 0) {
            console.log("Nenhum cliente está acomodado no momento");
            return;
        }
        clientesAcomodados.forEach((cliente, indice) => {
            var _a;
            console.log(`${indice + 1}. ${cliente.Nome} -> ${(_a = cliente.Acomodacao) === null || _a === void 0 ? void 0 : _a.NomeAcomadacao}`);
        });
    }
}
exports.default = ListarClientesAcomodado;
