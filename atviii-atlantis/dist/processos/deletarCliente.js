"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class DeletarCliente extends processo_1.default {
    processar() {
        let armazem = armazem_1.default.InstanciaUnica;
        console.log('Iniciando remoção de cliente...');
        let documento = this.entrada.receberTexto('Informe o documento do cliente:');
        let cliente = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documento));
        if (!cliente) {
            console.log('Cliente não encontrado');
            return;
        }
        if (cliente.Titular) {
            let titular = cliente.Titular;
            titular.Dependentes = titular.Dependentes.filter(d => d !== cliente);
        }
        if (!cliente.Titular) {
            cliente.Dependentes.forEach(dep => {
                dep.Titular = undefined;
            });
        }
        armazem.Clientes = armazem.Clientes.filter(c => c !== cliente);
        console.log('Cliente removido com sucesso');
    }
}
exports.default = DeletarCliente;
