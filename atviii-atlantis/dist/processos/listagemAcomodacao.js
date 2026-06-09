"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class ListarAcomodacao extends processo_1.default {
    processar() {
        console.clear();
        console.log("Lista de acomodações\n");
        const armazem = armazem_1.default.InstanciaUnica;
        if (armazem.Acomodacoes.length === 0) {
            console.log("Nenhuma acomodação cadastrada");
            return;
        }
        armazem.Acomodacoes.forEach((acomodacao, indice) => {
            console.log(`${indice + 1}. ${acomodacao.NomeAcomadacao}`);
        });
    }
}
exports.default = ListarAcomodacao;
