"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const menuPricipal_1 = __importDefault(require("../menus/menuPricipal"));
const tipoCadastroCliente_1 = __importDefault(require("./tipoCadastroCliente"));
const tipoListagemClientes_1 = __importDefault(require("./tipoListagemClientes"));
const tipoEditarCliente_1 = __importDefault(require("./tipoEditarCliente"));
const deletarCliente_1 = __importDefault(require("./deletarCliente"));
const listagemAcomodacoes_1 = __importDefault(require("./listagemAcomodacoes"));
const listagemAcomodado_1 = __importDefault(require("./listagemAcomodado"));
const vincularAcomodacao_1 = __importDefault(require("./vincularAcomodacao"));
const deletarAcomodacao_1 = __importDefault(require("./deletarAcomodacao"));
class Principal extends processo_1.default {
    constructor() {
        super();
        this.execucao = true;
        this.menu = new menuPricipal_1.default();
    }
    processar() {
        this.menu.mostrar();
        this.opcao = this.entrada.receberNumero('Qual opção desejada?');
        switch (this.opcao) {
            case 1:
                this.processo = new tipoCadastroCliente_1.default();
                this.processo.processar();
                break;
            case 2:
                this.processo = new tipoEditarCliente_1.default();
                this.processo.processar();
                break;
            case 3:
                this.processo = new tipoListagemClientes_1.default();
                this.processo.processar();
                break;
            case 4:
                this.processo = new deletarCliente_1.default();
                this.processo.processar();
                break;
            case 5:
                this.processo = new listagemAcomodacoes_1.default();
                this.processo.processar();
                break;
            case 6:
                this.processo = new listagemAcomodado_1.default();
                this.processo.processar();
                break;
            case 7:
                this.processo = new vincularAcomodacao_1.default();
                this.processo.processar();
                break;
            case 8:
                this.processo = new deletarAcomodacao_1.default();
                this.processo.processar();
                break;
            case 0:
                this.execucao = false;
                console.log('Até logo!');
                console.clear();
                break;
            default:
                console.log('Opção não entendida :(');
        }
    }
}
exports.default = Principal;
