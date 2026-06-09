"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class vincularAcomodacao extends processo_1.default {
    processar() {
        const dados = armazem_1.default.InstanciaUnica;
        const documento = this.entrada.receberTexto("Informe o documento do titular:");
        const hospedePrincipal = dados.Clientes.find(cliente => cliente.Documentos.some(doc => doc.Numero === documento));
        if (!hospedePrincipal) {
            console.log("Titular não localizado");
            return;
        }
        console.log("Quartos disponíveis no sistema:");
        for (let posicao = 0; posicao < dados.Acomodacoes.length; posicao++) {
            const quarto = dados.Acomodacoes[posicao];
            console.log(`${posicao + 1} -> ${quarto.NomeAcomadacao}`);
        }
        const escolha = this.entrada.receberNumero("Digite o número da acomodação:");
        const quartoSelecionado = dados.Acomodacoes[escolha - 1];
        if (quartoSelecionado === undefined) {
            console.log("Acomodação inexistente");
            return;
        }
        hospedePrincipal.Acomodacao = quartoSelecionado;
        if (hospedePrincipal.Dependentes.length !== 0) {
            console.log("Lista de dependentes:");
            hospedePrincipal.Dependentes.forEach((dependente, indice) => {
                console.log(`${indice + 1} - ${dependente.Nome}`);
            });
            let continuar = true;
            while (continuar) {
                const opcao = this.entrada.receberNumero("Escolha um dependente para incluir (0 para finalizar):");
                if (opcao === 0) {
                    continuar = false;
                }
                else {
                    const acompanhante = hospedePrincipal.Dependentes[opcao - 1];
                    if (!acompanhante) {
                        console.log("Dependente inválido");
                    }
                    else {
                        acompanhante.Acomodacao = quartoSelecionado;
                        console.log(`${acompanhante.Nome} foi adicionado à hospedagem`);
                    }
                }
            }
        }
        console.clear();
        console.log("Registro de hospedagem");
        console.log("Hospedagem registrada");
    }
}
exports.default = vincularAcomodacao;
