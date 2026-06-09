"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Telefone {
    constructor(ddd, numero) {
        this.ddd = ddd;
        this.numero = numero;
    }
    get Ddd() { return this.ddd; }
    get Numero() { return this.numero; }
    set Ddd(ddd) { this.ddd = ddd; }
    set Numero(numero) { this.numero = numero; }
    clonar() {
        let telefone = new Telefone(this.ddd, this.numero);
        return telefone;
    }
}
exports.default = Telefone;
