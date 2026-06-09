"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorCliente_1 = __importDefault(require("../impressores/impressorCliente"));
class ListagemTitularEspecifico extends processo_1.default {
    processar() {
        console.clear();
        console.log('Listagem do titular de um dependente...');
        let documento = this.entrada.receberTexto('Informe o documento do dependente:');
        let armazem = armazem_1.default.InstanciaUnica;
        let cliente = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documento));
        if (!cliente) {
            console.log('Cliente não encontrado');
            return;
        }
        if (!cliente.Titular) {
            console.log('Este cliente não possui titular');
            return;
        }
        console.log(`Titular de ${cliente.Nome}:`);
        this.impressor = new impressorCliente_1.default(cliente.Titular);
        console.log(this.impressor.imprimir());
    }
}
exports.default = ListagemTitularEspecifico;
