import Processo from "../abstracoes/processo";
import Cliente from "../modelos/cliente";
import Telefone from "../modelos/telefone";

export default class CadastroCelular extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        let ddd = this.entrada.receberTexto('Qual o DDD do telefone?')
        let numero = this.entrada.receberTexto('Qual o numero do telefone?')
        let celular = new Telefone(ddd, numero)
        this.cliente.Telefones.push(celular)
    }
}