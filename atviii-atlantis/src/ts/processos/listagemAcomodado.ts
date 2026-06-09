import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";

export default class ListarClientesAcomodado extends Processo {

    processar(): void {
        console.clear()
        console.log("Clientes acomodados\n")

        const armazem = Armazem.InstanciaUnica

        const clientesAcomodados = armazem.Clientes.filter(cliente => cliente.Acomodacao)

        if (clientesAcomodados.length === 0) {
            console.log("Nenhum cliente está acomodado no momento")
            return
        }

        clientesAcomodados.forEach((cliente, indice) => {
            console.log(`${indice + 1}. ${cliente.Nome} -> ${cliente.Acomodacao?.NomeAcomadacao}`)
        })
    }
}