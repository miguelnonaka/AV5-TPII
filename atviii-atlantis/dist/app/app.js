"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cadastroAcomodacoes_1 = __importDefault(require("../processos/cadastroAcomodacoes"));
const principal_1 = __importDefault(require("../processos/principal"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cliente_1 = __importDefault(require("../modelos/cliente"));
const documento_1 = __importDefault(require("../modelos/documento"));
const endereco_1 = __importDefault(require("../modelos/endereco"));
const telefone_1 = __importDefault(require("../modelos/telefone"));
const TipoDocumento_1 = require("../enumeracoes/TipoDocumento");
console.clear();
console.log(`Bem-vindo(a) ao melhor sistema de gestão de clubes, hotéis e resorts do mundo, o Atlantis :)`);
let processo;
let execucao = true;
processo = new cadastroAcomodacoes_1.default();
processo.processar();
const armazem = armazem_1.default.InstanciaUnica;
const titular = new cliente_1.default("Miguel", "Tomo", new Date(2007, 5, 18), false);
titular.Endereco = new endereco_1.default("Rua das Flores", "Centro", "São José dos Campos", "São Paulo", "Brasil", "12200-000");
titular.Telefones = [
    new telefone_1.default("12", "99999-1111")
];
titular.Documentos = [
    new documento_1.default("12345678900", TipoDocumento_1.TipoDocumento.CPF, new Date(2020, 1, 10)),
    new documento_1.default("55443322", TipoDocumento_1.TipoDocumento.RG, new Date(2019, 3, 5))
];
const dependente1 = new cliente_1.default("Yuki", "Yuki", new Date(2012, 7, 12), true);
dependente1.Titular = titular;
dependente1.Documentos = [
    new documento_1.default("11122233344", TipoDocumento_1.TipoDocumento.CPF, new Date(2022, 6, 15))
];
dependente1.Endereco = titular.Endereco.clonar();
const dependente2 = new cliente_1.default("Akira", "Aki", new Date(2015, 2, 22), true);
dependente2.Titular = titular;
dependente2.Documentos = [
    new documento_1.default("55566677788", TipoDocumento_1.TipoDocumento.CPF, new Date(2023, 4, 18))
];
dependente2.Endereco = titular.Endereco.clonar();
titular.Dependentes = [
    dependente1,
    dependente2
];
const cliente2 = new cliente_1.default("Renato", "Ren", new Date(1998, 10, 9), false);
cliente2.Endereco = new endereco_1.default("Av. Brasil", "Jardim América", "São Paulo", "São Paulo", "Brasil", "01000-000");
cliente2.Telefones = [
    new telefone_1.default("11", "98888-7777")
];
cliente2.Documentos = [
    new documento_1.default("99988877766", TipoDocumento_1.TipoDocumento.CPF, new Date(2018, 8, 25))
];
armazem.Clientes.push(titular);
armazem.Clientes.push(dependente1);
armazem.Clientes.push(dependente2);
armazem.Clientes.push(cliente2);
while (execucao) {
    processo = new principal_1.default();
    processo.processar();
    execucao = processo.Execucao;
}
