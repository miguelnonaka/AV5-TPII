"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class DeletarAcomodacao extends processo_1.default {
    processar() {
        const armazem = armazem_1.default.InstanciaUnica;
        const documentoDependente = this.entrada.receberTexto("Informe o documento do dependente:");
        const dependente = armazem.Clientes.find(cliente => cliente.Documentos.some(doc => doc.Numero === documentoDependente));
        if (!dependente) {
            console.log("Dependente não encontrado");
            return;
        }
        if (!dependente.Titular) {
            console.log("Este cliente não possui titular");
            return;
        }
        const titular = dependente.Titular;
        if (!titular.Acomodacao) {
            console.log("O titular não possui acomodação vinculada");
            return;
        }
        titular.Acomodacao = undefined;
        console.clear();
        console.log("Exclusão de acomodação concluida.");
        console.log(`Acomodação do titular ${titular.Nome} removida com sucesso`);
    }
}
exports.default = DeletarAcomodacao;
