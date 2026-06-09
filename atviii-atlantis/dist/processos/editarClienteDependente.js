"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cadastrarDocumentosCliente_1 = __importDefault(require("./cadastrarDocumentosCliente"));
const cadastroEnderecoTitular_1 = __importDefault(require("./cadastroEnderecoTitular"));
class EditarDependente extends processo_1.default {
    processar() {
        let armazem = armazem_1.default.InstanciaUnica;
        console.log('Iniciando edição de dependente...');
        let documento = this.entrada.receberTexto('Informe o documento do dependente:');
        let cliente = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documento));
        if (!cliente) {
            console.log('Cliente não encontrado');
            return;
        }
        if (cliente.Depende == false) {
            console.log('Este cliente não é dependente');
            return;
        }
        let opcao;
        do {
            console.clear();
            console.log(`Editando dependente: ${cliente.Nome}\n`);
            console.log('1 - Nome');
            console.log('2 - Nome Social');
            console.log('3 - Data de Nascimento');
            console.log('4 - Endereço');
            console.log('5 - Documentos');
            console.log('6 - Telefones');
            console.log('0 - Sair\n');
            opcao = this.entrada.receberNumero('Escolha uma opção:');
            switch (opcao) {
                case 1:
                    cliente.Nome = this.entrada.receberTexto('Novo nome:');
                    console.log('Nome atualizado');
                    break;
                case 2:
                    cliente.NomeSocial = this.entrada.receberTexto('Novo nome social:');
                    console.log('Nome social atualizado');
                    break;
                case 3:
                    cliente.DataNascimento = this.entrada.receberData('Nova data:');
                    console.log('Data atualizada');
                    break;
                case 4:
                    this.processo = new cadastroEnderecoTitular_1.default(cliente);
                    this.processo.processar();
                    break;
                case 5:
                    this.processo = new cadastrarDocumentosCliente_1.default(cliente);
                    this.processo.processar();
                    break;
                case 6:
                    if (!cliente.Titular) {
                        console.log('Dependente sem titular definido');
                        break;
                    }
                    if (cliente.Titular.Telefones.length === 0) {
                        console.log('Titular não possui telefones');
                        break;
                    }
                    cliente.Telefones = cliente.Titular.Telefones.map(t => t.clonar());
                    console.log('Telefones atualizados com base no titular');
                    break;
                case 0:
                    break;
                default:
                    console.log('Opção inválida');
            }
            if (opcao !== 0) {
                this.entrada.receberTexto('Pressione ENTER para continuar...');
            }
        } while (opcao !== 0);
        console.log('Finalizando edição do dependente...');
    }
}
exports.default = EditarDependente;
