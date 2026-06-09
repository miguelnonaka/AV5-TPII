import Documento from "./documento"
import Endereco from "./endereco"
import Telefone from "./telefone"
import Acomodacao from "./acomodacao"   

export default class Cliente {
    private nome: string
    private nomeSocial: string
    private dataNascimento: Date
    private dataCadastro: Date
    private telefones: Telefone[] = []
    private endereco!: Endereco
    private documentos: Documento[] = []
    private dependentes: Cliente[] = []
    private titular!: Cliente
    private depende : boolean

    private acomodacao?: Acomodacao

    constructor(nome: string, nomeSocial: string, dataNascimento: Date, depende: boolean) {
        this.nome = nome
        this.nomeSocial = nomeSocial
        this.dataNascimento = dataNascimento
        this.dataCadastro = new Date()
        this.depende = depende
    }

    public get Nome() { return this.nome }
    public get NomeSocial() { return this.nomeSocial }
    public get DataNascimento() { return this.dataNascimento }
    public get DataCadastro() { return this.dataCadastro }
    public get Telefones() { return this.telefones }
    public get Endereco() { return this.endereco }
    public get Documentos() { return this.documentos }
    public get Dependentes() { return this.dependentes }
    public get Titular() { return this.titular }
    public get Depende() {return this.depende}
    public get Acomodacao() {return this.acomodacao}

    
    public set Nome(nome: string) { this.nome = nome }
    public set NomeSocial(nomeSocial: string) { this.nomeSocial = nomeSocial }
    public set DataNascimento(dataNascimento: Date) { this.dataNascimento = dataNascimento }
    public set Endereco(endereco: Endereco) { this.endereco = endereco }
    public set Titular(titular: Cliente) { this.titular = titular }
    public set Telefones(telefones: Telefone[]) { this.telefones = telefones }
    public set Documentos(documentos: Documento[]) { this.documentos = documentos }
    public set Dependentes(dependentes: Cliente[]) { this.dependentes = dependentes }
    public set Depende(depende:boolean) {this.depende = depende}
    public set Acomodacao(acomodacao: Acomodacao | undefined) {this.acomodacao = acomodacao}
    
}