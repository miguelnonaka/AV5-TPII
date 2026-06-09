"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const TipoDocumento_1 = require("../enumeracoes/TipoDocumento");
const documento_1 = __importDefault(require("../modelos/documento"));
class CadastroCPF extends processo_1.default {
    constructor(cliente) {
        super();
        this.cliente = cliente;
    }
    processar() {
        let numero = this.entrada.receberTexto('Qual o número do documento?');
        let dataExpedicao = this.entrada.receberData('Qual a data de expedição do documento?');
        let rg = new documento_1.default(numero, TipoDocumento_1.TipoDocumento.CPF, dataExpedicao);
        while (rg.Numero == undefined) {
            numero = this.entrada.receberTexto('Qual o número do documento? Você não preencheu corretamente');
        }
        this.cliente.Documentos.push(rg);
    }
}
exports.default = CadastroCPF;
