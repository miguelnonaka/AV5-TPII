"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cliente_1 = __importDefault(require("../modelos/cliente"));
const cadastrarDocumentosCliente_1 = __importDefault(require("./cadastrarDocumentosCliente"));
class CadastroClienteDependente extends processo_1.default {
    processar() {
        console.log('Iniciando o cadastro de um novo cliente...');
        let nome = this.entrada.receberTexto('Qual o nome do novo cliente?');
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo cliente?');
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?');
        let cliente = new cliente_1.default(nome, nomeSocial, dataNascimento, true);
        this.processo = new cadastrarDocumentosCliente_1.default(cliente);
        this.processo.processar();
        let documentoTitular = this.entrada.receberTexto('RG/CPF/Passaporte do Titular (ou vazio se for titular):');
        let armazem = armazem_1.default.InstanciaUnica;
        if (documentoTitular) {
            let titular = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documentoTitular));
            if (!titular) {
                console.log('Titular não encontrado');
                return;
            }
            if (titular.Depende == true) {
                console.log('Esse Cliente é um dependente');
                return;
            }
            cliente.Endereco = titular.Endereco.clonar();
            cliente.Telefones = titular.Telefones.map(t => t.clonar());
            titular.Dependentes.push(cliente);
            cliente.Titular = titular;
            armazem.Clientes.push(cliente);
        }
        else {
            console.log('Titular não informado');
            return;
        }
        console.log('Finalizando o cadastro do cliente...');
    }
}
exports.default = CadastroClienteDependente;
