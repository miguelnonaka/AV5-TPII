"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cliente {
    constructor(nome, nomeSocial, dataNascimento, depende) {
        this.telefones = [];
        this.documentos = [];
        this.dependentes = [];
        this.nome = nome;
        this.nomeSocial = nomeSocial;
        this.dataNascimento = dataNascimento;
        this.dataCadastro = new Date();
        this.depende = depende;
    }
    get Nome() { return this.nome; }
    get NomeSocial() { return this.nomeSocial; }
    get DataNascimento() { return this.dataNascimento; }
    get DataCadastro() { return this.dataCadastro; }
    get Telefones() { return this.telefones; }
    get Endereco() { return this.endereco; }
    get Documentos() { return this.documentos; }
    get Dependentes() { return this.dependentes; }
    get Titular() { return this.titular; }
    get Depende() { return this.depende; }
    get Acomodacao() { return this.acomodacao; }
    set Nome(nome) { this.nome = nome; }
    set NomeSocial(nomeSocial) { this.nomeSocial = nomeSocial; }
    set DataNascimento(dataNascimento) { this.dataNascimento = dataNascimento; }
    set Endereco(endereco) { this.endereco = endereco; }
    set Titular(titular) { this.titular = titular; }
    set Telefones(telefones) { this.telefones = telefones; }
    set Documentos(documentos) { this.documentos = documentos; }
    set Dependentes(dependentes) { this.dependentes = dependentes; }
    set Depende(depende) { this.depende = depende; }
    set Acomodacao(acomodacao) { this.acomodacao = acomodacao; }
}
exports.default = Cliente;
