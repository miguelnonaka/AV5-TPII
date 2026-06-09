import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";
import ImpressorDocumentos from "./impressorDocumentos";
import ImpressorEndereco from "./impressorEndereco";

export default class ImpressaorCliente implements Impressor {
    private cliente: Cliente
    private impressor!: Impressor

    constructor(cliente: Cliente) {
        this.cliente = cliente

    }
    imprimir(): string {
        let impressao = `****************************\n`
            + `| Nome: ${this.cliente.Nome}\n`
            + `| Nome social: ${this.cliente.NomeSocial}\n`
            + `| Data de nascimento: ${this.cliente.DataNascimento.toLocaleDateString()}\n`
            + `| Data de cadastro: ${this.cliente.DataCadastro.toLocaleDateString()}`

        this.impressor = new ImpressorEndereco(this.cliente.Endereco)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        this.impressor = new ImpressorDocumentos(this.cliente.Documentos)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        if (this.cliente.Telefones.length > 0) {
            impressao += `\n| Telefones:`
            this.cliente.Telefones.forEach(tel => {
                impressao += `\n| (${tel.Ddd}) ${tel.Numero}`
            })
        }

        if (this.cliente.Depende) {
            if (this.cliente.Titular) {
                impressao += `\n| Titular: ${this.cliente.Titular.Nome}`
            }
        } else {
            if (this.cliente.Dependentes.length > 0) {
                impressao += `\n| Dependentes:`
                this.cliente.Dependentes.forEach(dep => {
                    impressao += `\n| - ${dep.Nome}`
                })
            }
        }

        impressao = impressao + `\n****************************`
        return impressao
    }

}