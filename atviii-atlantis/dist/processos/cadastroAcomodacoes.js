"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const diretorCasalSimples_1 = __importDefault(require("../diretores/diretorCasalSimples"));
const diretorFamiliaMais_1 = __importDefault(require("../diretores/diretorFamiliaMais"));
const diretorFamiliaSimples_1 = __importDefault(require("../diretores/diretorFamiliaSimples"));
const diretorFamiliaSuper_1 = __importDefault(require("../diretores/diretorFamiliaSuper"));
const diretorSolteiroMais_1 = __importDefault(require("../diretores/diretorSolteiroMais"));
const diretorSolteiroSimples_1 = __importDefault(require("../diretores/diretorSolteiroSimples"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class CadastroAcomodacoes extends processo_1.default {
    constructor() {
        super();
        this.acomodacoes = armazem_1.default.InstanciaUnica.Acomodacoes;
    }
    processar() {
        this.acomodacoes.push(new diretorCasalSimples_1.default().construir());
        this.acomodacoes.push(new diretorFamiliaMais_1.default().construir());
        this.acomodacoes.push(new diretorFamiliaSimples_1.default().construir());
        this.acomodacoes.push(new diretorFamiliaSuper_1.default().construir());
        this.acomodacoes.push(new diretorSolteiroMais_1.default().construir());
        this.acomodacoes.push(new diretorSolteiroSimples_1.default().construir());
        console.log("Cadastro realizado com sucesso.");
    }
}
exports.default = CadastroAcomodacoes;
