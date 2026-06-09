"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cadastrarDocumentosCliente_1 = __importDefault(require("./cadastrarDocumentosCliente"));
const cadastroEnderecoTitular_1 = __importDefault(require("./cadastroEnderecoTitular"));
class EditarTitular extends processo_1.default {
    processar() {
        let armazem = armazem_1.default.InstanciaUnica;
        console.log('Iniciando edição de cliente...');
        let documento = this.entrada.receberTexto('Informe o documento do cliente:');
        let cliente = armazem.Clientes.find(c => c.Documentos.some(doc => doc.Numero === documento));
        if (!cliente) {
            console.log('Cliente não encontrado');
            return;
        }
        else if (cliente.Titular !== undefined) {
            console.log('Este Cliente é um dependente');
            return;
        }
        console.log(`Cliente encontrado: ${cliente.Nome}`);
        let opcao;
        do {
            console.clear();
            console.log(`Editando: ${cliente.Nome}\n`);
            console.log('1 - Nome');
            console.log('2 - Nome Social');
            console.log('3 - Data de Nascimento');
            console.log('4 - Endereço');
            console.log('5 - Documentos');
            console.log('6 - Telefone');
            console.log('0 - Sair\n');
            opcao = this.entrada.receberNumero('Escolha uma opção:');
            switch (opcao) {
                case 1:
                    let nome = this.entrada.receberTexto('Novo nome:');
                    cliente.Nome = nome;
                    console.log('Nome atualizado');
                    break;
                case 2:
                    let nomeSocial = this.entrada.receberTexto('Novo nome social:');
                    cliente.NomeSocial = nomeSocial;
                    console.log('Nome social atualizado');
                    break;
                case 3:
                    let dataNascimento = this.entrada.receberData('Nova data de nascimento:');
                    cliente.DataNascimento = dataNascimento;
                    console.log('Data de nascimento atualizada');
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
                    if (cliente.Telefones.length === 0) {
                        console.log('Cliente não possui telefones');
                        break;
                    }
                    console.log('Telefones atuais:');
                    cliente.Telefones.forEach((tel, i) => {
                        console.log(`${i} - (${tel.Ddd}) ${tel.Numero}`);
                    });
                    let indice = this.entrada.receberNumero('Escolha o índice do telefone:');
                    let telefone = cliente.Telefones[indice];
                    if (!telefone) {
                        console.log('Telefone inválido');
                        break;
                    }
                    let novoDdd = this.entrada.receberTexto('Novo DDD:');
                    let novoNumero = this.entrada.receberTexto('Novo número:');
                    telefone.Ddd = novoDdd;
                    telefone.Numero = novoNumero;
                    console.log('Telefone atualizado');
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
        console.log('Finalizando edição do cliente...');
    }
}
exports.default = EditarTitular;
