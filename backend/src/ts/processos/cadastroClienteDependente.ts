import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import Endereco from "../modelos/endereco";
import Telefone from "../modelos/telefone";
import CadastrarDocumentosCliente from "./cadastrarDocumentosCliente";

export default class CadastroClienteDependente extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de um novo cliente...')
        let nome = this.entrada.receberTexto('Qual o nome do novo cliente?')
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo cliente?')
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?')
        let cliente = new Cliente(nome, nomeSocial, dataNascimento, true)

        this.processo = new CadastrarDocumentosCliente(cliente)
        this.processo.processar()

        

        let documentoTitular = this.entrada.receberTexto('RG/CPF/Passaporte do Titular (ou vazio se for titular):')

        let armazem = Armazem.InstanciaUnica

        if (documentoTitular) {
            let titular = armazem.Clientes.find(c =>
                    c.Documentos.some(doc => doc.Numero === documentoTitular))

            if (!titular) {
                console.log('Titular não encontrado')
                return
            }

            if(titular.Depende == true){
                console.log('Esse Cliente é um dependente')
                return
            }

            cliente.Endereco = titular.Endereco.clonar() as Endereco
            cliente.Telefones = titular.Telefones.map(t => t.clonar() as Telefone)

            titular.Dependentes.push(cliente)
            cliente.Titular = titular

            armazem.Clientes.push(cliente)
        }else{
            console.log('Titular não informado')
            return
        }

        console.log('Finalizando o cadastro do cliente...')
    }
}