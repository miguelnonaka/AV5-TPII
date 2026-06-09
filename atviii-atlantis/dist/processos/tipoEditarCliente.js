"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const menuTipoEditarClientes_1 = __importDefault(require("../menus/menuTipoEditarClientes"));
const editarClienteDependente_1 = __importDefault(require("./editarClienteDependente"));
const editarClienteTitular_1 = __importDefault(require("./editarClienteTitular"));
class TipEditarCliente extends processo_1.default {
    constructor() {
        super();
        this.menu = new menuTipoEditarClientes_1.default();
    }
    processar() {
        this.menu.mostrar();
        this.opcao = this.entrada.receberNumero('Qual opção desejada?');
        switch (this.opcao) {
            case 1:
                this.processo = new editarClienteTitular_1.default();
                this.processo.processar();
                break;
            case 2:
                this.processo = new editarClienteDependente_1.default();
                this.processo.processar();
                break;
            default:
                console.log('Opção não entendida :(');
        }
    }
}
exports.default = TipEditarCliente;
