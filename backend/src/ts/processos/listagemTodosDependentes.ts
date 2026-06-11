import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";

export default class ListagemDependentesTodos extends Processo {
    private impressor!: Impressor

    processar(): void {
        console.clear()
        console.log('Listagem de dependentes de um titular...')

        let documento = this.entrada.receberTexto('Informe o documento do titular:')

        let armazem = Armazem.InstanciaUnica

        let titular = armazem.Clientes.find(c =>
            c.Documentos.some(doc => doc.Numero === documento)
        )

        if (!titular) {
            console.log('Titular não encontrado')
            return
        }

        if (titular.Titular !== undefined) {
            console.log('Cliente informado não é titular')
            return
        }

        if (titular.Dependentes.length === 0) {
            console.log('Este titular não possui dependentes')
            return
        }

        console.log(`Dependentes de ${titular.Nome}:`)

        titular.Dependentes.forEach(dep => {
            this.impressor = new ImpressaorCliente(dep)
            console.log(this.impressor.imprimir())
        })
    }
}