import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";

export default class ListagemTitularEspecifico extends Processo {
    private impressor!: Impressor

    processar(): void {
        console.clear()
        console.log('Listagem do titular de um dependente...')

        let documento = this.entrada.receberTexto('Informe o documento do dependente:')

        let armazem = Armazem.InstanciaUnica

        let cliente = armazem.Clientes.find(c =>
            c.Documentos.some(doc => doc.Numero === documento)
        )

        if (!cliente) {
            console.log('Cliente não encontrado')
            return
        }

        if (!cliente.Titular) {
            console.log('Este cliente não possui titular')
            return
        }

        console.log(`Titular de ${cliente.Nome}:`)

        this.impressor = new ImpressaorCliente(cliente.Titular)
        console.log(this.impressor.imprimir())
    }
}