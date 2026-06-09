"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorCliente_1 = __importDefault(require("../impressores/impressorCliente"));
class ListagemDependentesTodos extends processo_1.default {
    processar() {
        console.clear();
        console.log('Listagem de dependentes de um titular...');
        let documento = this.entrada.receberTexto('Informe o documento do titular:');
        let armazem = armazem_1.default.InstanciaUnica;
        let titular = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documento));
        if (!titular) {
            console.log('Titular não encontrado');
            return;
        }
        if (titular.Titular !== undefined) {
            console.log('Cliente informado não é titular');
            return;
        }
        if (titular.Dependentes.length === 0) {
            console.log('Este titular não possui dependentes');
            return;
        }
        console.log(`Dependentes de ${titular.Nome}:`);
        titular.Dependentes.forEach(dep => {
            this.impressor = new impressorCliente_1.default(dep);
            console.log(this.impressor.imprimir());
        });
    }
}
exports.default = ListagemDependentesTodos;
