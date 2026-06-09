"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Armazem {
    constructor() {
        this.clientes = [];
        this.acomodacoes = [];
    }
    static get InstanciaUnica() {
        return this.instanciaUnica;
    }
    get Clientes() {
        return this.clientes;
    }
    set Clientes(clientes) {
        this.clientes = clientes;
    }
    get Acomodacoes() {
        return this.acomodacoes;
    }
}
Armazem.instanciaUnica = new Armazem();
exports.default = Armazem;
